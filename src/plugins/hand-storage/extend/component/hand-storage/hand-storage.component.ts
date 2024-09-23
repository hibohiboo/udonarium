import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
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
import {
  ContextMenuSeparator,
  ContextMenuService,
} from 'service/context-menu.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopService } from 'service/tabletop.service';
import { HandStorage } from '../../class/hand-storage';
import { TabletopObject } from '@udonarium/tabletop-object';
import { CoordinateService } from 'service/coordinate.service';
import { TabletopActionService } from 'service/tabletop-action.service';
import {
  hideVirtualStorage,
  onObjectDropVirtualStorage,
  virtualScreenHandStorageContextMenu,
  virtualScreenName,
} from 'src/plugins/virtual-screen/extend/component/hand-storage/hand-storage.component';
import { Card } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { isMyHandStorageOnly } from 'src/plugins/hand-storage-self-only';
import { RotableOption } from 'directive/rotable.directive';
import {
  extendCloneRotateOffHandStorage,
  getObjectRotateOffHandStorage,
  rotateOffContextMenuHandStorage,
} from 'src/plugins/object-rotate-off/extends/components/hand-storage/hand-storage.component';
import { returnHandCardContextMenu } from 'src/plugins/return-the-hand/extend/component/hand-storage/hand-storage.component';
import { PeerCursor } from '@udonarium/peer-cursor';
import { tapCardContextMenuHandStorage } from 'src/plugins/tap-card/extend/component/card/card.component';
import { handCardContextMenuHandStorage } from 'src/plugins/return-the-hand/extend/component/card/card.component';
import {
  initKeyboardShortcutHandStorage,
  onKeyDownKeyboardShortcutHandStorage,
} from 'src/plugins/keyboard-shortcut/extend/component/hand-storage/hand-storage.component';
import { cardBackImageAllChangeContextMenuHandStorage } from 'src/plugins/card-back-image-all-change/extend/component/hand-storage/hand-storage.component';
import { ModalService } from 'service/modal.service';
import { handStorageAlignmentContextMenu } from 'src/plugins/hand-storage-alignment/extend/component/hand-storage/hand-storage.component';

interface TopOfObject {
  obj: TabletopObject;
  distanceX: number;
  distanceY: number;
}

@Component({
  selector: 'hand-storage',
  templateUrl: './hand-storage.component.html',
  styleUrls: ['./hand-storage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandStorageComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() handStorage: HandStorage = null;
  @Input() is3D = false;
  rotableOption: RotableOption = {};
  get name(): string {
    return this.handStorage.name;
  }
  get width(): number {
    return this.adjustMinBounds(this.handStorage.width);
  }
  get height(): number {
    return this.adjustMinBounds(this.handStorage.height);
  }
  get opacity(): number {
    return this.handStorage.opacity;
  }
  get imageFile(): ImageFile {
    return this.handStorage.imageFile;
  }
  get isLock(): boolean {
    if (isMyHandStorageOnly(this.handStorage)) return true;
    return this.handStorage.isLock;
  }
  set isLock(isLock: boolean) {
    this.handStorage.isLock = isLock;
  }

  get ownerName(): string {
    return this.handStorage.ownerName;
  }
  get ownerColor(): string {
    return this.handStorage.ownerColor;
  }

  get titleLabel(): string {
    const vname = virtualScreenName(this.handStorage);
    if (vname) return vname;
    if (this.ownerName) return `${this.ownerName}の個人ボード`;
    if (this.name) return this.name;
    return `ボード`;
  }

  gridSize = 50;

  movableOption: MovableOption = {};

  private input: InputHandler = null;
  private topOfObjects: TopOfObject[] = [];

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
    private modalService: ModalService, // card-back-image-all-change で使用
  ) {
    initKeyboardShortcutHandStorage(this);
  }

  @HostBinding('class.object-rotate-off') get objectRotateOff() {
    return getObjectRotateOffHandStorage(this);
  }

  @HostBinding('tabIndex') tabIndex: string; //tabIndexを付与するため、ComponentにtabIndexをバインドするメンバを用意
  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    onKeyDownKeyboardShortcutHandStorage(this, e);
  }

  ngOnInit() {
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, (event) => {
        const object = ObjectStore.instance.get(event.data.identifier);
        if (!this.handStorage || !object) return;
        if (
          this.handStorage === object ||
          (object instanceof ObjectNode && this.handStorage.contains(object))
        ) {
          this.changeDetector.markForCheck();
        }
      })
      .on('SYNCHRONIZE_FILE_LIST', (event) => {
        this.changeDetector.markForCheck();
      })
      .on('UPDATE_FILE_RESOURE', -1000, (event) => {
        this.changeDetector.markForCheck();
      });
    this.movableOption = {
      tabletopObject: this.handStorage,
      transformCssOffset: 'translateZ(0.0px)',
      colideLayers: ['hand-storage'],
      layerName: 'hand-storage',
    };
    this.rotableOption = {
      tabletopObject: this.handStorage,
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

  onInputStart() {
    this.input.cancel();
    if (this.isLock) {
      EventSystem.trigger('DRAG_LOCKED_OBJECT', {});
    }
    this.handStorage.index = 0;
    this.calcTopOfObjects();
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;
    if (isMyHandStorageOnly(this.handStorage)) return;
    const menuPosition = this.pointerDeviceService.pointers[0];
    const objectPosition = this.coordinateService.calcTabletopLocalCoordinate();
    this.contextMenuService.open(
      menuPosition,
      [
        ...virtualScreenHandStorageContextMenu(this),
        {
          name: `カードの一括操作`,
          action: null,
          subActions: [
            {
              name: '全て表にする',
              action: () => {
                this._calcTopObjects(this.tabletopService.cards).forEach(
                  ({ obj: card }) => {
                    card.faceUp();
                  },
                );
                SoundEffect.play(PresetSound.cardDraw);
              },
            },
            {
              name: '全て裏にする',
              action: () => {
                this._calcTopObjects(this.tabletopService.cards).forEach(
                  ({ obj: card }) => {
                    card.faceDown();
                  },
                );
                SoundEffect.play(PresetSound.cardDraw);
              },
            },
            {
              name: '全て自分だけ見る',
              action: () => {
                this._calcTopObjects(this.tabletopService.cards).forEach(
                  ({ obj: card }) => {
                    card.faceDown();
                    card.owner = PeerCursor.myCursor.userId;
                  },
                );
                SoundEffect.play(PresetSound.cardDraw);
              },
            },
            ...handCardContextMenuHandStorage(this),
            ...tapCardContextMenuHandStorage(this),
            ...cardBackImageAllChangeContextMenuHandStorage(this),
          ],
        },
        ...returnHandCardContextMenu(this),
        ...handStorageAlignmentContextMenu(this),
        ContextMenuSeparator,
        this.isLock
          ? {
              name: '固定解除',
              action: () => {
                this.isLock = false;
                SoundEffect.play(PresetSound.unlock);
              },
            }
          : {
              name: '固定する',
              action: () => {
                this.isLock = true;
                SoundEffect.play(PresetSound.lock);
              },
            },
        {
          name: 'ボードを編集',
          action: () => {
            this.showDetail(this.handStorage);
          },
        },
        {
          name: '削除する',
          action: () => {
            this.handStorage.destroy();
            SoundEffect.play(PresetSound.sweep);
          },
        },
        {
          name: 'コピーを作る',
          action: () => {
            const cloneObject = this.handStorage.clone();
            cloneObject.location.x += this.gridSize;
            cloneObject.location.y += this.gridSize;
            cloneObject.isLock = false;
            extendCloneRotateOffHandStorage(this.handStorage, cloneObject);
            if (this.handStorage.parent)
              this.handStorage.parent.appendChild(cloneObject);
            SoundEffect.play(PresetSound.cardPut);
          },
        },
        ...rotateOffContextMenuHandStorage(this),
        ContextMenuSeparator,
        {
          name: 'ボード上のオブジェクトを一括削除',
          action: () => {
            if (
              !confirm('ボード上のオブジェクトをすべて削除してよろしいですか？')
            )
              return;
            this.calcTopOfObjects();
            for (const topOfObject of this.topOfObjects) {
              topOfObject.obj.destroy();
            }
            SoundEffect.play(PresetSound.sweep);
          },
        },
      ],
      this.name,
    );
  }

  onMove() {
    SoundEffect.play(PresetSound.cardPick);
  }

  onMoved() {
    SoundEffect.play(PresetSound.cardPut);
    for (const topOfObject of this.topOfObjects) {
      topOfObject.obj.location.x =
        this.handStorage.location.x + topOfObject.distanceX;
      topOfObject.obj.location.y =
        this.handStorage.location.y + topOfObject.distanceY;
      topOfObject.obj.update();
    }
    hideVirtualStorage(this, this.topOfObjects);
    this.topOfObjects = [];
  }

  onRotate() {
    SoundEffect.play(PresetSound.cardPick);
  }

  onRotated() {
    SoundEffect.play(PresetSound.cardPut);
    this.calcTopOfObjects();
    for (const topOfObject of this.topOfObjects) {
      const tmp: any = topOfObject as any;
      if (tmp.obj.rotate != null) {
        tmp.obj.rotate = this.handStorage.rotate;
        topOfObject.obj.update();
      }
    }
    hideVirtualStorage(this, this.topOfObjects);
    this.topOfObjects = [];
  }

  @HostListener('carddrop', ['$event'])
  onCardDrop(e) {
    if (
      e.detail instanceof Card === false &&
      e.detail instanceof CardStack === false
    ) {
      return;
    }
    onObjectDropVirtualStorage(this, e);
  }
  @HostListener('objectdrop', ['$event'])
  onObjectDrop(e) {
    onObjectDropVirtualStorage(this, e);
  }
  private calcTopOfObjects() {
    const objects = [
      ...this.tabletopService.cards,
      ...this.tabletopService.cardStacks,
      ...this.tabletopService.characters,
      ...this.tabletopService.terrains,
      ...this.tabletopService.diceSymbols,
    ];
    const topOfObjects = this._calcTopObjects(objects);
    this.topOfObjects = topOfObjects;
    return topOfObjects;
  }

  private _calcTopObjects(objects) {
    const { x, y, w, h } = this.getHandStorageArea();
    const topOfObjects = [];
    for (const obj of objects) {
      const { distanceX, distanceY } = this.getDistance(x, y, obj);
      if (this.isTopOfHandStorage(x, y, w, h, distanceX, distanceY)) {
        topOfObjects.push({ obj: obj, distanceX, distanceY });
      }
    }

    return topOfObjects;
  }

  private isTopOfHandStorage(x, y, w, h, distanceX, distanceY) {
    return (
      -this.gridSize < distanceX &&
      -this.gridSize < distanceY &&
      distanceX < w &&
      distanceY < h
    );
  }
  private getHandStorageArea() {
    const x = this.handStorage.location.x;
    const y = this.handStorage.location.y;
    const w = this.width * this.gridSize;
    const h = this.height * this.gridSize;
    return { x, y, w, h };
  }

  private getDistance(x, y, obj) {
    const distanceX = obj.location.x - x;
    const distanceY = obj.location.y - y;
    return { distanceX, distanceY };
  }

  private adjustMinBounds(value: number, min = 0): number {
    return value < min ? min : value;
  }

  private showDetail(gameObject: HandStorage) {
    const coordinate = this.pointerDeviceService.pointers[0];
    let title = 'ボード設定';
    if (gameObject.name.length) title += ' - ' + gameObject.name;
    const option: PanelOption = {
      title: title,
      left: coordinate.x - 200,
      top: coordinate.y - 150,
      width: 400,
      height: 300,
    };
    const component = this.panelService.open<GameCharacterSheetComponent>(
      GameCharacterSheetComponent,
      option,
    );
    component.tabletopObject = gameObject;
  }
}
