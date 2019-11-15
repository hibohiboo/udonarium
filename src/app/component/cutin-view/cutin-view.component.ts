import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild ,ComponentFactoryResolver} from '@angular/core';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuService } from 'service/context-menu.service';
import { CutinView } from '@udonarium/cutin-view';
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
  gridSize: number = 50;
  get isPanelOver(): boolean { return true; }

  constructor(
    private changeDetector: ChangeDetectorRef,
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

    if(!this.isPanelOver) {
      return;
    }

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
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  onClick (){
    this.cutin.destroy();
  }
}
