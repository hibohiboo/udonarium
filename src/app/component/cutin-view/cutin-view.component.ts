import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, ViewChild ,ComponentFactoryResolver} from '@angular/core';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { GameCharacterSheetComponent } from 'component/game-character-sheet/game-character-sheet.component';
import { MovableOption } from 'directive/movable.directive';
import { RotableOption } from 'directive/rotable.directive';
import { ContextMenuService } from 'service/context-menu.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { CutinView } from '@udonarium/cutin-view';
import { ModalService } from 'service/modal.service';
import { HelpKeyboardComponent } from 'component/help-keyboard/help-keyboard.component';
import { OverviewPanelComponent } from 'component/overview-panel/overview-panel.component';


@Component({
  selector: 'cutin-view',
  templateUrl: './cutin-view.component.html',
  styleUrls: ['./cutin-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CutinViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('textArea', { static: true }) textAreaElementRef: ElementRef;

  @Input() cutin: CutinView = null;
  // @Input() is3D: boolean = false;

  get title(): string { return this.cutin.title; }
  get imageFile(): ImageFile { return this.cutin.imageFile; }

  get isSelected(): boolean { return document.activeElement === this.textAreaElementRef.nativeElement; }

  // private callbackOnMouseUp = (e) => this.onMouseUp(e);

  gridSize: number = 50;

  private calcFitHeightTimer: NodeJS.Timer = null;

  constructor(
    private ngZone: NgZone,
    private contextMenuService: ContextMenuService,
    private panelService: PanelService,
    private changeDetector: ChangeDetectorRef,
    private pointerDeviceService: PointerDeviceService,
    private modalService: ModalService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        let object = ObjectStore.instance.get(event.data.identifier);
        if (!this.cutin || !object) return;
        if (this.cutin === object || (object instanceof ObjectNode && this.cutin.contains(object))) {
          this.changeDetector.markForCheck();
        }
      })
      .on('SYNCHRONIZE_FILE_LIST', event => {
        this.changeDetector.markForCheck();
      })
      .on('UPDATE_FILE_RESOURE', -1000, event => {
        this.changeDetector.markForCheck();
      });

    // カットインのオーバービュー表示
    // angularのループ後にカットインを表示を呼び出さないとExpressionChangedAfterItHasBeenCheckedErrorになる
    setTimeout(()=>{
      const parentViewContainerRef = ContextMenuService.defaultParentViewContainerRef;
      const injector = parentViewContainerRef.injector;
      const panelComponentFactory = this.componentFactoryResolver.resolveComponentFactory(OverviewPanelComponent);
      const tooltipComponentRef = parentViewContainerRef.createComponent(panelComponentFactory, parentViewContainerRef.length, injector);
      const cutin = this.cutin;
      tooltipComponentRef.instance.tabletopObject = cutin;
      EventSystem.register(this)
      .on('DELETE_GAME_OBJECT', -1000, event => {
        if (cutin && cutin.identifier === event.data.identifier){
          tooltipComponentRef.destroy();
        } 
      });
    }, 1);

  }

  ngAfterViewInit() {
    SoundEffect.play(PresetSound.bell);


    // EventSystem.register(this)
    //   .on('DELETE_GAME_OBJECT', -1000, event => {
    //     if (cutin && cutin.identifier === event.data.identifier){ cutin.destroy(); }
    //   });
      // if (this.modalService.isShow) { return;}
      // this.modalService.open(CutinViewComponent, {cutin: this.cutin});

  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  onClick (){
    this.cutin.destroy();
  }

  // @HostListener('dragstart', ['$event'])
  // onDragstart(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  // }

  // @HostListener('mousedown', ['$event'])
  // onMouseDown(e: any) {
  //   if (this.isSelected) return;
  //   e.preventDefault();
  //   // this.cutin.toTopmost();

  //   // TODO:もっと良い方法考える
  //   if (e.button === 2) {
  //     EventSystem.trigger('DRAG_LOCKED_OBJECT', {});
  //     return;
  //   }

  //   this.addMouseEventListeners();
  // }

  // onMouseUp(e: any) {
  //   if (this.pointerDeviceService.isAllowedToOpenContextMenu) {
  //     let selection = window.getSelection();
  //     if (!selection.isCollapsed) selection.removeAllRanges();
  //     this.textAreaElementRef.nativeElement.focus();
  //   }
  //   this.removeMouseEventListeners();
  //   e.preventDefault();
  // }

  onRotateMouseDown(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  // private showDetail(gameObject: cutin) {
  //   EventSystem.trigger('SELECT_TABLETOP_OBJECT', { identifier: gameObject.identifier, className: gameObject.aliasName });
  //   let coordinate = this.pointerDeviceService.pointers[0];
  //   let title = '共有メモ設定';
  //   if (gameObject.title.length) title += ' - ' + gameObject.title;
  //   let option: PanelOption = { title: title, left: coordinate.x - 350, top: coordinate.y - 200, width: 700, height: 400 };
  //   let component = this.panelService.open<GameCharacterSheetComponent>(GameCharacterSheetComponent, option);
  //   component.tabletopObject = gameObject;
  // }
}
