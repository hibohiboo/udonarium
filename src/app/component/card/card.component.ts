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
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Card, CardState } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { GameCharacterSheetComponent } from 'component/game-character-sheet/game-character-sheet.component';
import { InputHandler } from 'directive/input-handler';
import { MovableOption } from 'directive/movable.directive';
import { RotableOption } from 'directive/rotable.directive';
import { ContextMenuAction, ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { ImageService } from 'service/image.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { SelectionState, TabletopSelectionService } from 'service/tabletop-selection.service';
import { TabletopService } from 'service/tabletop.service';
import { initCardComponentForWritableText, isCardWritable } from 'src/plugins/add-card-text-writable/extend/component/card/card.component';
import { GameCharacterSheetComponentExtendPlus } from 'src/plugins/extends/app/component/game-character-sheet/game-character-sheet.component';
import { initKeyboardShortcutCard, onKeyDownKeyboardShortcutCard } from 'src/plugins/keyboard-shortcut/extend/component/card/card.component';
import { endMoveStackedCard, startMoveStackedCard } from 'src/plugins/move-stacked-card/extend/component/card.component';
import { extendCloneRotateOffCard, getObjectRotateOffCard, rotateOffContextMenuCard } from 'src/plugins/object-rotate-off/extends/components/card/card.component';
import { handCardContextMenu } from 'src/plugins/return-the-hand/extend/component/card/card.component';
import { tapCardContextMenu } from 'src/plugins/tap-card/extend/component/card/card.component';
import { hideVirtualScreenCard, initVirtualScreenCard, onMovedVirtualScreen } from 'src/plugins/virtual-screen/extend/component/card/card.component';
import { virtualScreenContextMenu } from 'src/plugins/virtual-screen/extend/menu';


@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnDestroy, OnChanges, AfterViewInit {
  @Input() card: Card = null;
  @Input() is3D: boolean = false;

  get name(): string { return this.card.name; }
  get state(): CardState { return this.card.state; }
  set state(state: CardState) { this.card.state = state; }
  get rotate(): number { return this.card.rotate; }
  set rotate(rotate: number) { this.card.rotate = rotate; }
  get owner(): string { return this.card.owner; }
  set owner(owner: string) { this.card.owner = owner; }
  get zindex(): number { return this.card.zindex; }
  get size(): number { return this.adjustMinBounds(this.card.size); }

  get isHand(): boolean { return this.card.isHand; }
  get isFront(): boolean { return this.card.isFront; }
  get isVisible(): boolean { return this.card.isVisible; }
  get hasOwner(): boolean { return this.card.hasOwner; }
  get ownerIsOnline(): boolean { return this.card.ownerIsOnline; }
  get ownerName(): string { return this.card.ownerName; }

  get imageFile(): ImageFile { return this.imageService.getSkeletonOr(this.card.imageFile); }
  get frontImage(): ImageFile { return this.imageService.getSkeletonOr(this.card.frontImage); }
  get backImage(): ImageFile { return this.imageService.getSkeletonOr(this.card.backImage); }

  get selectionState(): SelectionState { return this.selectionService.state(this.card); }
  get isSelected(): boolean { return this.selectionState !== SelectionState.NONE; }
  get isMagnetic(): boolean { return this.selectionState === SelectionState.MAGNETIC; }

  private iconHiddenTimer: NodeJS.Timer = null;
  get isIconHidden(): boolean { return this.iconHiddenTimer != null };

  gridSize: number = 50;

  movableOption: MovableOption = {};
  rotableOption: RotableOption = {};

  private doubleClickTimer: NodeJS.Timer = null;
  private doubleClickPoint = { x: 0, y: 0 };

  private input: InputHandler = null;
  @HostBinding('class.hide-virtual-screen-component') get hideVirtualScreen(){ return hideVirtualScreenCard(this); };

  @HostBinding('tabIndex') tabIndex:string;//tabIndexを付与するため、ComponentにtabIndexをバインドするメンバを用意
  constructor(
    private ngZone: NgZone,
    protected contextMenuService: ContextMenuService,
    private panelService: PanelService,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef,
    private tabletopService: TabletopService,
    private selectionService: TabletopSelectionService,
    private imageService: ImageService,
    private pointerDeviceService: PointerDeviceService
  ) {
    initVirtualScreenCard(this);
    initCardComponentForWritableText(this);
    initKeyboardShortcutCard(this);
   }
  get isCardWritable() { return isCardWritable; }

  ngOnChanges(): void {
    EventSystem.register(this)
      .on(`UPDATE_GAME_OBJECT/aliasName/${PeerCursor.aliasName}`, event => {
        let object = ObjectStore.instance.get<PeerCursor>(event.data.identifier);
        if (this.card && object && object.userId === this.card.owner) {
          this.changeDetector.markForCheck();
        }
      })
      .on(`UPDATE_GAME_OBJECT/identifier/${this.card?.identifier}`, event => {
        this.changeDetector.markForCheck();
      })
      .on(`UPDATE_OBJECT_CHILDREN/identifier/${this.card?.identifier}`, event => {
        this.changeDetector.markForCheck();
      })
      .on('SYNCHRONIZE_FILE_LIST', event => {
        this.changeDetector.markForCheck();
      })
      .on('UPDATE_FILE_RESOURE', event => {
        this.changeDetector.markForCheck();
      })
      .on(`UPDATE_SELECTION/identifier/${this.card?.identifier}`, event => {
        this.changeDetector.markForCheck();
      })
      .on('DISCONNECT_PEER', event => {
        let cursor = PeerCursor.findByPeerId(event.data.peerId);
        if (!cursor || this.card.owner === cursor.userId) this.changeDetector.markForCheck();
      });
    this.movableOption = {
      tabletopObject: this.card,
      transformCssOffset: 'translateZ(0.15px)',
      colideLayers: ['terrain']
    };
    this.rotableOption = {
      tabletopObject: this.card
    };
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.input = new InputHandler(this.elementRef.nativeElement);
    });
    this.input.onStart = e => this.ngZone.run(() => this.onInputStart(e));
  }

  ngOnDestroy() {
    this.input.destroy();
    EventSystem.unregister(this);
  }

  @HostListener('carddrop', ['$event'])
  onCardDrop(e) {
    if (this.card === e.detail || (e.detail instanceof Card === false && e.detail instanceof CardStack === false)) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    if (e.detail instanceof CardStack) {
      let cardStack: CardStack = e.detail;
      let distance: number = (cardStack.location.x - this.card.location.x) ** 2 + (cardStack.location.y - this.card.location.y) ** 2 + (cardStack.posZ - this.card.posZ) ** 2;
      if (distance < 25 ** 2) {
        cardStack.location.x = this.card.location.x;
        cardStack.location.y = this.card.location.y;
        cardStack.posZ = this.card.posZ;
        cardStack.putOnBottom(this.card);
      }
    }
  }

  startDoubleClickTimer(e) {
    if (!this.doubleClickTimer) {
      this.stopDoubleClickTimer();
      this.doubleClickTimer = setTimeout(() => this.stopDoubleClickTimer(), e.touches ? 500 : 300);
      this.doubleClickPoint = this.input.pointer;
      return;
    }

    if (e.touches) {
      this.input.onEnd = this.onDoubleClick.bind(this);
    } else {
      this.onDoubleClick();
    }
  }

  stopDoubleClickTimer() {
    clearTimeout(this.doubleClickTimer);
    this.doubleClickTimer = null;
    this.input.onEnd = null;
  }

  onDoubleClick() {
    this.stopDoubleClickTimer();
    let distance = (this.doubleClickPoint.x - this.input.pointer.x) ** 2 + (this.doubleClickPoint.y - this.input.pointer.y) ** 2;
    if (distance < 10 ** 2) {
      console.log('onDoubleClick !!!!');
      if (this.ownerIsOnline && !this.isHand) return;
      this.state = this.isVisible && !this.isHand ? CardState.BACK : CardState.FRONT;
      this.owner = '';
      SoundEffect.play(PresetSound.cardDraw);
    }
  }

  @HostListener('dragstart', ['$event'])
  onDragstart(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onInputStart(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent && (e.button !== 0 || e.ctrlKey || e.shiftKey)) return;
    startMoveStackedCard(this); // 上に乗っているカードを判定するため toTopmostよりも先に実行。
    this.startDoubleClickTimer(e);
    this.card.toTopmost();
    this.startIconHiddenTimer();
  }

  @HostBinding('class.object-rotate-off') get objectRotateOff(){ return getObjectRotateOffCard(this); };

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;
    let position = this.pointerDeviceService.pointers[0];

    let menuActions: ContextMenuAction[] = [];
    menuActions = menuActions.concat(this.makeSelectionContextMenu());
    menuActions = menuActions.concat(this.makeContextMenu());

    this.contextMenuService.open(position, menuActions, this.isVisible ? this.name : 'カード');
  }

  onMove() {
    this.input.cancel();
    this.contextMenuService.close();
    SoundEffect.play(PresetSound.cardPick);
  }

  onMoved() {
    SoundEffect.play(PresetSound.cardPut);
    onMovedVirtualScreen(this)
    this.ngZone.run(() => this.dispatchCardDropEvent());
  }

  @HostListener("pointerenter", ["$event"])
  onPointerenter(e: KeyboardEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.elementRef.nativeElement.focus();
  }

  @HostListener("keydown", ["$event"])
  onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
    e.preventDefault();

    // ポインタ（マウスカーソル）がカードの上にあるとき、その画像をターゲットとしている。
    // カードの画像のエレメントと比較することで、現在のポインタがあるカードのみを対象にできる。
    // if (this.pointerDeviceService.targetElement !== this.elementRef.nativeElement.querySelector('img')) return;
    if (e.key === 't') {
      this.card.rotate = 90;
      return;
    }
    if (e.key === 'u') {
      this.rotate = 0;
      return;
    }
    onKeyDownKeyboardShortcutCard(this,e);
  }

  protected createStack() {
    let cardStack = CardStack.create('山札');
    cardStack.location.x = this.card.location.x;
    cardStack.location.y = this.card.location.y;
    cardStack.posZ = this.card.posZ;
    cardStack.location.name = this.card.location.name;
    cardStack.rotate = this.rotate;
    cardStack.zindex = this.card.zindex;

    let cards: Card[] = this.tabletopService.cards.filter(card => {
      let distance: number = (card.location.x - this.card.location.x) ** 2 + (card.location.y - this.card.location.y) ** 2 + (card.posZ - this.card.posZ) ** 2;
      return distance < 100 ** 2;
    });

    cards.sort((a, b) => {
      if (a.zindex < b.zindex) return 1;
      if (a.zindex > b.zindex) return -1;
      return 0;
    });

    for (let card of cards) {
      cardStack.putOnBottom(card);
    }
  }

  private dispatchCardDropEvent() {
    console.log('dispatchCardDropEvent');
    let element: HTMLElement = this.elementRef.nativeElement;
    let parent = element.parentElement;
    let children = parent.children;
    let event = new CustomEvent('carddrop', { detail: this.card, bubbles: true });
    for (let i = 0; i < children.length; i++) {
      children[i].dispatchEvent(event);
    }
    endMoveStackedCard(this)
  }

  private makeSelectionContextMenu(): ContextMenuAction[] {
    let actions: ContextMenuAction[] = [];

    if (this.selectionService.objects.length) {
      let objectPosition = {
        x: this.card.location.x + (this.card.size * this.gridSize) / 2,
        y: this.card.location.y + (this.card.size * this.gridSize) / 2,
        z: this.card.posZ
      };
      actions.push({ name: 'ここに集める', action: () => this.selectionService.congregate(objectPosition) });
    }

    if (this.isSelected) {
      let selectedCards = () => this.selectionService.objects.filter(object => object.aliasName === this.card.aliasName) as Card[];
      actions.push(
        {
          name: '選択したカード', action: null, subActions: [
            {
              name: 'すべて表にする', action: () => {
                selectedCards().forEach(card => card.faceUp());
                SoundEffect.play(PresetSound.cardDraw);
              }
            },
            {
              name: 'すべて裏にする', action: () => {
                selectedCards().forEach(card => card.faceDown());
                SoundEffect.play(PresetSound.cardDraw);
              }
            },
            {
              name: 'すべて自分だけ見る', action: () => {
                selectedCards().forEach(card => {
                  card.faceDown();
                  card.owner = Network.peer.userId;
                });
                SoundEffect.play(PresetSound.cardDraw);
              }
            },
          ]
        }
      );
    }
    if (this.selectionService.objects.length) {
      actions.push(ContextMenuSeparator);
    }
    return actions;
  }

  private makeContextMenu(): ContextMenuAction[] {
    let actions: ContextMenuAction[] = [];

    actions.push(!this.isVisible || this.isHand
      ? {
        name: '表にする', action: () => {
          this.card.faceUp();
          SoundEffect.play(PresetSound.cardDraw);
        }
      }
      : {
        name: '裏にする', action: () => {
          this.card.faceDown();
          SoundEffect.play(PresetSound.cardDraw);
        }
      });
    actions.push(this.isHand
      ? {
        name: '裏にする', action: () => {
          this.card.faceDown();
          SoundEffect.play(PresetSound.cardDraw);
        }
      }
      : {
        name: '自分だけ見る', action: () => {
          SoundEffect.play(PresetSound.cardDraw);
          this.card.faceDown();
          this.owner = Network.peer.userId;
        }
      });
    actions.push(ContextMenuSeparator);
    actions.push({
      name: '重なったカードで山札を作る', action: () => {
        this.createStack();
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    actions.push(...handCardContextMenu(this));
    actions.push(...tapCardContextMenu(this));
    actions.push(ContextMenuSeparator);
    actions.push({ name: 'カードを編集', action: () => { this.showDetail(this.card); } });
    actions.push({
      name: 'コピーを作る', action: () => {
        let cloneObject = this.card.clone();
        cloneObject.location.x += this.gridSize;
        cloneObject.location.y += this.gridSize;
        extendCloneRotateOffCard(this.card, cloneObject);
        cloneObject.toTopmost();
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    actions.push({
      name: '削除する', action: () => {
        this.card.destroy();
        SoundEffect.play(PresetSound.sweep);
      }
    });
    actions.push(...rotateOffContextMenuCard(this));
    actions.push(...virtualScreenContextMenu(this));
    return actions;
  }

  private startIconHiddenTimer() {
    clearTimeout(this.iconHiddenTimer);
    this.iconHiddenTimer = setTimeout(() => {
      this.iconHiddenTimer = null;
      this.changeDetector.markForCheck();
    }, 300);
    this.changeDetector.markForCheck();
  }

  private adjustMinBounds(value: number, min: number = 0): number {
    return value < min ? min : value;
  }

  protected showDetail(gameObject: Card) {
    EventSystem.trigger('SELECT_TABLETOP_OBJECT', { identifier: gameObject.identifier, className: gameObject.aliasName });
    let coordinate = this.pointerDeviceService.pointers[0];
    let title = 'カード設定';
    if (gameObject.name.length) title += ' - ' + gameObject.name;
    let option: PanelOption = { title: title, left: coordinate.x - 300, top: coordinate.y - 300, width: 600, height: 600 };
    if(this.isCardWritable) {
      let component = this.panelService.open<GameCharacterSheetComponentExtendPlus>(GameCharacterSheetComponentExtendPlus, option);
      component.tabletopObject = gameObject;
      return;
    }
    let component = this.panelService.open<GameCharacterSheetComponent>(GameCharacterSheetComponent, option);
    component.tabletopObject = gameObject;
  }
}
