import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { GameCharacterSheetComponent } from 'component/game-character-sheet/game-character-sheet.component';
import { InputHandler } from 'directive/input-handler';
import { MovableOption } from 'directive/movable.directive';
import { ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopService } from 'service/tabletop.service';
import { HandStorage } from '../class/hand-storage';
import config from 'src/app/plugins/config';
import { TabletopObject } from '@udonarium/tabletop-object';
import { CoordinateService } from 'service/coordinate.service';
import { TabletopActionService } from 'service/tabletop-action.service';

interface TopOfObject {
  obj: TabletopObject
  distanceX: number
  distanceY: number
}


@Component({
  selector: 'hand-storage',
  templateUrl: './hand-storage.component.html',
  styleUrls: ['./hand-storage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandStorageComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() handStorage: HandStorage = null;
  @Input() is3D: boolean = false;

  get name(): string { return this.handStorage.name; }
  get width(): number { return this.adjustMinBounds(this.handStorage.width); }
  get height(): number { return this.adjustMinBounds(this.handStorage.height); }
  get opacity(): number { return this.handStorage.opacity; }
  get imageFile(): ImageFile { return this.handStorage.imageFile; }
  get isLock(): boolean { return this.handStorage.isLock; }
  set isLock(isLock: boolean) { this.handStorage.isLock = isLock; }
  get hasOwner(): boolean { return this.handStorage.hasOwner; }
  get ownerName(): string { return this.handStorage.ownerName; }
  get ownerColor(): string { return this.handStorage.ownerColor; }
  get usePlayerColor(){ return config.usePlayerColor; }

  gridSize: number = 50;

  movableOption: MovableOption = {};

  private input: InputHandler = null;
  private topOfObjects: TopOfObject[] = []

  constructor(
    private ngZone: NgZone,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private elementRef: ElementRef<HTMLElement>,
    private panelService: PanelService,
    private changeDetector: ChangeDetectorRef,
    private pointerDeviceService: PointerDeviceService,
    private coordinateService: CoordinateService,
    private tabletopActionService: TabletopActionService,
  ) { }

  ngOnInit() {
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        let object = ObjectStore.instance.get(event.data.identifier);
        if (!this.handStorage || !object) return;
        if (this.handStorage === object || (object instanceof ObjectNode && this.handStorage.contains(object))) {
          this.changeDetector.markForCheck();
        }
      })
      .on('SYNCHRONIZE_FILE_LIST', event => {
        this.changeDetector.markForCheck();
      })
      .on('UPDATE_FILE_RESOURE', -1000, event => {
        this.changeDetector.markForCheck();
      });
    this.movableOption = {
      tabletopObject: this.handStorage,
      transformCssOffset: 'translateZ(0.15px)',
      colideLayers: ['terrain']
    };
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.input = new InputHandler(this.elementRef.nativeElement);
    });
    this.input.onStart = this.onInputStart.bind(this);
  }

  ngOnDestroy() {
    this.input.destroy();
    EventSystem.unregister(this);
  }

  @HostListener('dragstart', ['$event'])
  onDragstart(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onInputStart(e: any) {
    this.input.cancel();
    if (this.isLock) {
      EventSystem.trigger('DRAG_LOCKED_OBJECT', {});
    }
    this.handStorage.index = 0;
    const x = this.handStorage.location.x;
    const y = this.handStorage.location.y;
    const w = this.width * this.gridSize;
    const h = this.height * this.gridSize;
    const objects = [
      ...this.tabletopService.cards,
      ...this.tabletopService.cardStacks,
      ...this.tabletopService.characters,
      ...this.tabletopService.terrains,
      ...this.tabletopService.diceSymbols,
    ]
    for (const obj of objects) {
      const distanceX = obj.location.x - x
      const distanceY = obj.location.y - y
      if (-this.gridSize < distanceX && -this.gridSize < distanceY && distanceX < w && distanceY < h) {
        this.topOfObjects.push({ obj: obj, distanceX, distanceY })
      }
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;
    let menuPosition = this.pointerDeviceService.pointers[0];
    let objectPosition = this.coordinateService.calcTabletopLocalCoordinate();
    this.contextMenuService.open(menuPosition, [
      (this.isLock
        ? {
          name: '固定解除', action: () => {
            this.isLock = false;
            SoundEffect.play(PresetSound.unlock);
          }
        }
        : {
          name: '固定する', action: () => {
            this.isLock = true;
            SoundEffect.play(PresetSound.lock);
          }
        }
      ),
      ContextMenuSeparator,
      { name: '手札置き場を編集', action: () => { this.showDetail(this.handStorage); } },
      {
        name: '削除する', action: () => {
          this.handStorage.destroy();
          SoundEffect.play(PresetSound.sweep);
        }
      },
      ContextMenuSeparator,
      { name: 'オブジェクト作成', action: null, subActions: this.tabletopActionService.makeDefaultContextMenuActions(objectPosition) }
    ], this.name);
  }

  onMove() {
    SoundEffect.play(PresetSound.cardPick);
  }

  onMoved() {
    SoundEffect.play(PresetSound.cardPut);
    for (const topOfObject of this.topOfObjects) {
      topOfObject.obj.location.x = this.handStorage.location.x + topOfObject.distanceX
      topOfObject.obj.location.y = this.handStorage.location.y + topOfObject.distanceY
      topOfObject.obj.update()
    }
    this.topOfObjects = []
  }

  private adjustMinBounds(value: number, min: number = 0): number {
    return value < min ? min : value;
  }

  private showDetail(gameObject: HandStorage) {
    let coordinate = this.pointerDeviceService.pointers[0];
    let title = 'マップマスク設定';
    if (gameObject.name.length) title += ' - ' + gameObject.name;
    let option: PanelOption = { title: title, left: coordinate.x - 200, top: coordinate.y - 150, width: 400, height: 300 };
    let component = this.panelService.open<GameCharacterSheetComponent>(GameCharacterSheetComponent, option);
    component.tabletopObject = gameObject;
  }
}
