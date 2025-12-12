import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { BlankCard } from '../../class/blank-card';
import { BlankCardStack } from '../../class/blank-card-stack';
import { Card } from '@udonarium/card';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { MathUtil } from '@udonarium/core/system/util/math-util';
import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { BlankCardSheetComponent } from '../blank-card-sheet/blank-card-sheet.component';
import { ObjectInteractGesture } from 'component/game-table/object-interact-gesture';
import { MovableOption } from 'directive/movable.directive';
import { RotableOption } from 'directive/rotable.directive';
import { ContextMenuAction, ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { ImageService } from 'service/image.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { SelectionState, TabletopSelectionService } from 'service/tabletop-selection.service';

@Component({
  selector: 'blank-card-stack',
  templateUrl: './blank-card-stack.component.html',
  styleUrls: ['./blank-card-stack.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('shuffle', [
      transition('* => active', [
        animate('800ms ease', keyframes([
          style({ transform: 'scale3d(0, 0, 0) rotateZ(0deg)', offset: 0 }),
          style({ transform: 'scale3d(1.2, 1.2, 1.2) rotateZ(360deg)', offset: 0.5 }),
          style({ transform: 'scale3d(0.75, 0.75, 0.75) rotateZ(520deg)', offset: 0.75 }),
          style({ transform: 'scale3d(1.125, 1.125, 1.125) rotateZ(630deg)', offset: 0.875 }),
          style({ transform: 'scale3d(1.0, 1.0, 1.0) rotateZ(720deg)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class BlankCardStackComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() cardStack: BlankCardStack = null;
  @Input() is3D: boolean = false;

  get name(): string { return this.cardStack.name; }
  get rotate(): number { return this.cardStack.rotate; }
  set rotate(rotate: number) { this.cardStack.rotate = rotate; }
  get zindex(): number { return this.cardStack.zindex; }
  get isShowTotal(): boolean { return this.cardStack.isShowTotal; }
  get cards(): BlankCard[] { return this.cardStack.cards; }
  get isEmpty(): boolean { return this.cardStack.isEmpty; }
  get size(): number {
    let card = this.cardStack.topCard;
    return card ? MathUtil.clampMin(card.size) : 2;
  }

  get hasOwner(): boolean { return this.cardStack.hasOwner; }
  get ownerName(): string { return this.cardStack.ownerName; }

  get topCard(): BlankCard { return this.cardStack.topCard; }
  get imageFile(): ImageFile { return this.imageService.getSkeletonOr(this.cardStack.imageFile); }

  get selectionState(): SelectionState { return this.selectionService.state(this.cardStack); }
  get isSelected(): boolean { return this.selectionState !== SelectionState.NONE; }
  get isMagnetic(): boolean { return this.selectionState === SelectionState.MAGNETIC; }

  animeState: string = 'inactive';

  private iconHiddenTimer: NodeJS.Timeout = null;
  get isIconHidden(): boolean { return this.iconHiddenTimer != null };

  gridSize: number = 50;

  movableOption: MovableOption = {};
  rotableOption: RotableOption = {};

  private interactGesture: ObjectInteractGesture = null;

  constructor(
    private ngZone: NgZone,
    private contextMenuService: ContextMenuService,
    private panelService: PanelService,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef,
    private selectionService: TabletopSelectionService,
    private imageService: ImageService,
    private pointerDeviceService: PointerDeviceService
  ) { }

  ngOnChanges(): void {
    EventSystem.unregister(this);
    EventSystem.register(this)
      .on('SHUFFLE_CARD_STACK', event => {
        if (event.data.identifier === this.cardStack.identifier) {
          this.animeState = 'active';
          this.changeDetector.markForCheck();
        }
      })
      .on(`UPDATE_GAME_OBJECT/aliasName/${PeerCursor.aliasName}`, event => {
        let object = ObjectStore.instance.get<PeerCursor>(event.data.identifier);
        if (this.cardStack && object && object.userId === this.cardStack.owner) {
          this.changeDetector.markForCheck();
        }
      })
      .on(`UPDATE_GAME_OBJECT/identifier/${this.cardStack?.identifier}`, event => {
        this.changeDetector.markForCheck();
      })
      .on(`UPDATE_OBJECT_CHILDREN/identifier/${this.cardStack?.identifier}`, event => {
        this.changeDetector.markForCheck();
      })
      .on('SYNCHRONIZE_FILE_LIST', event => {
        this.changeDetector.markForCheck();
      })
      .on('UPDATE_FILE_RESOURE', event => {
        this.changeDetector.markForCheck();
      })
      .on(`UPDATE_SELECTION/identifier/${this.cardStack?.identifier}`, event => {
        this.changeDetector.markForCheck();
      })
      .on('DISCONNECT_PEER', event => {
        let cursor = PeerCursor.findByPeerId(event.data.peerId);
        if (!cursor || this.cardStack.owner === cursor.userId) this.changeDetector.markForCheck();
      });
    this.movableOption = {
      tabletopObject: this.cardStack,
      transformCssOffset: 'translateZ(0.15px)',
      colideLayers: ['terrain']
    };
    this.rotableOption = {
      tabletopObject: this.cardStack
    };
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.interactGesture = new ObjectInteractGesture(this.elementRef.nativeElement);
    });

    this.interactGesture.onstart = this.onInputStart.bind(this);
    this.interactGesture.oninteract = this.onDoubleClick.bind(this);
  }

  ngOnDestroy() {
    this.interactGesture.destroy();
    EventSystem.unregister(this);
  }

  animationShuffleStarted(event: any) {

  }

  animationShuffleDone(event: any) {
    this.animeState = 'inactive';
    this.changeDetector.markForCheck();
  }

  @HostListener('carddrop', ['$event'])
  onCardDrop(e) {
    if (this.cardStack === e.detail || (e.detail instanceof BlankCard === false && e.detail instanceof BlankCardStack === false)) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    if (e.detail instanceof BlankCard) {
      let card: BlankCard = e.detail;
      let distance: number = this.cardStack.calcSqrDistance(card);
      if (distance < 50 ** 2) this.cardStack.putOnTop(card);
    } else if (e.detail instanceof BlankCardStack) {
      let cardStack: BlankCardStack = e.detail;
      let distance: number = this.cardStack.calcSqrDistance(cardStack);
      if (distance < 25 ** 2) this.concatStack(cardStack);
    }
  }

  onDoubleClick() {
    this.ngZone.run(() => {
      if (this.drawCard() != null) SoundEffect.play(PresetSound.cardDraw);
    });
  }

  @HostListener('dragstart', ['$event'])
  onDragstart(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onInputStart(e: MouseEvent | TouchEvent) {
    this.ngZone.run(() => {
      this.cardStack.toTopmost();
      this.startIconHiddenTimer();
    });
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;
    let position = this.pointerDeviceService.pointers[0];

    let menuActions: ContextMenuAction[] = [];
    menuActions = menuActions.concat(this.makeSelectionContextMenu());
    menuActions = menuActions.concat(this.makeContextMenu());

    this.contextMenuService.open(position, menuActions, this.name);
  }

  onMove() {
    this.contextMenuService.close();
    SoundEffect.play(PresetSound.cardPick);
  }

  onMoved() {
    SoundEffect.play(PresetSound.cardPut);
    this.ngZone.run(() => this.dispatchCardDropEvent());
  }

  private drawCard(): BlankCard {
    let card = this.cardStack.drawCard();
    if (card) {
      card.location.x += 100 + (Math.random() * 50);
      card.location.y += 25 + (Math.random() * 50);
      card.setLocation(this.cardStack.location.name);
    }
    return card;
  }

  private breakStack() {
    let cards = this.cardStack.drawCardAll().reverse();
    for (let card of cards) {
      card.location.x += 25 - (Math.random() * 50);
      card.location.y += 25 - (Math.random() * 50);
      card.toTopmost();
      card.setLocation(this.cardStack.location.name);
    }
    this.cardStack.setLocation('graveyard');
    this.cardStack.destroy();
  }

  private concatStack(topStack: BlankCardStack, bottomStack: BlankCardStack = this.cardStack) {
    let newCardStack = BlankCardStack.create(topStack.name);
    newCardStack.location.name = bottomStack.location.name;
    newCardStack.location.x = bottomStack.location.x;
    newCardStack.location.y = bottomStack.location.y;
    newCardStack.posZ = bottomStack.posZ;
    newCardStack.zindex = topStack.zindex;
    newCardStack.rotate = bottomStack.rotate;

    let bottomCards: BlankCard[] = bottomStack.drawCardAll();
    let topCards: BlankCard[] = topStack.drawCardAll();
    for (let card of topCards.concat(bottomCards)) newCardStack.putOnBottom(card);

    bottomStack.setLocation('');
    bottomStack.destroy();

    topStack.setLocation('');
    topStack.destroy();
  }

  private dispatchCardDropEvent() {
    let element: HTMLElement = this.elementRef.nativeElement;
    let parent = element.parentElement;
    let children = parent.children;
    let event = new CustomEvent('carddrop', { detail: this.cardStack, bubbles: true });
    for (let i = 0; i < children.length; i++) {
      children[i].dispatchEvent(event);
    }
  }

  private makeSelectionContextMenu(): ContextMenuAction[] {
    if (this.selectionService.objects.length < 1) return [];

    let actions: ContextMenuAction[] = [];

    let size = this.cardStack.topCard?.size ?? 2;
    let objectPosition = {
      x: this.cardStack.location.x + (size * this.gridSize) / 2,
      y: this.cardStack.location.y + (size * this.gridSize) / 2,
      z: this.cardStack.posZ
    };
    actions.push({ name: 'ここに集める', action: () => this.selectionService.congregate(objectPosition) });

    if (this.isSelected) {
      let selectedCardStacks = () => this.selectionService.objects.filter(object => object.aliasName === this.cardStack.aliasName) as BlankCardStack[];
      actions.push(
        {
          name: '選択した山札', action: null, subActions: [
            {
              name: 'すべて表にする', action: () => {
                selectedCardStacks().forEach(cardStack => cardStack.faceUpAll());
                SoundEffect.play(PresetSound.cardDraw);
              }
            },
            {
              name: 'すべて裏にする', action: () => {
                selectedCardStacks().forEach(cardStack => cardStack.faceDownAll());
                SoundEffect.play(PresetSound.cardDraw);
              }
            },
            {
              name: 'すべて正位置にする', action: () => {
                selectedCardStacks().forEach(cardStack => cardStack.uprightAll());
                SoundEffect.play(PresetSound.cardDraw);
              }
            },
            ContextMenuSeparator,
            {
              name: 'すべてシャッフル', action: () => {
                SoundEffect.play(PresetSound.cardShuffle);
                selectedCardStacks().forEach(cardStack => {
                  cardStack.shuffle();
                  EventSystem.call('SHUFFLE_CARD_STACK', { identifier: cardStack.identifier });
                });
              }
            },
          ]
        }
      );
    }
    actions.push(ContextMenuSeparator);
    return actions;
  }

  private makeContextMenu(): ContextMenuAction[] {
    let actions: ContextMenuAction[] = [];

    actions.push({
      name: '１枚引く', action: () => {
        if (this.drawCard() != null) {
          SoundEffect.play(PresetSound.cardDraw);
        }
      }
    });
    actions.push(ContextMenuSeparator);
    actions.push({
      name: '一番上を表にする', action: () => {
        this.cardStack.faceUp();
        SoundEffect.play(PresetSound.cardDraw);
      }
    });
    actions.push({
      name: '一番上を裏にする', action: () => {
        this.cardStack.faceDown();
        SoundEffect.play(PresetSound.cardDraw);
      }
    });
    actions.push(ContextMenuSeparator);
    actions.push({
      name: 'すべて表にする', action: () => {
        this.cardStack.faceUpAll();
        SoundEffect.play(PresetSound.cardDraw);
      }
    });
    actions.push({
      name: 'すべて裏にする', action: () => {
        this.cardStack.faceDownAll();
        SoundEffect.play(PresetSound.cardDraw);
      }
    });
    actions.push({
      name: 'すべて正位置にする', action: () => {
        this.cardStack.uprightAll();
        SoundEffect.play(PresetSound.cardDraw);
      }
    });
    actions.push(ContextMenuSeparator);
    actions.push({
      name: 'シャッフル', action: () => {
        this.cardStack.shuffle();
        SoundEffect.play(PresetSound.cardShuffle);
        EventSystem.call('SHUFFLE_CARD_STACK', { identifier: this.cardStack.identifier });
      }
    });
    actions.push(ContextMenuSeparator);
    actions.push((this.isShowTotal
      ? { name: '枚数を非表示にする', action: () => { this.cardStack.isShowTotal = false; } }
      : { name: '枚数を表示する', action: () => { this.cardStack.isShowTotal = true; } }
    ));
    actions.push({ name: 'カードサイズを揃える', action: () => { if (this.cardStack.topCard) this.cardStack.unifyCardsSize(this.cardStack.topCard.size); } });
    actions.push(ContextMenuSeparator);
    actions.push({
      name: '山札を崩す', action: () => {
        this.breakStack();
        SoundEffect.play(PresetSound.cardShuffle);
      }
    });
    actions.push(ContextMenuSeparator);
    actions.push({ name: '詳細を表示', action: () => { this.showDetail(this.cardStack); } });
    actions.push({
      name: 'コピーを作る', action: () => {
        let cloneObject = this.cardStack.clone();
        cloneObject.location.x += this.gridSize;
        cloneObject.location.y += this.gridSize;
        cloneObject.owner = '';
        cloneObject.toTopmost();
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    actions.push({
      name: '山札を削除する', action: () => {
        this.cardStack.setLocation('graveyard');
        this.cardStack.destroy();
        SoundEffect.play(PresetSound.sweep);
      }
    });
    return actions;
  }

  private showDetail(gameObject: BlankCardStack) {
    EventSystem.trigger('SELECT_TABLETOP_OBJECT', { identifier: gameObject.identifier, className: gameObject.aliasName });
    let coordinate = this.pointerDeviceService.pointers[0];
    let title = 'ブランクカード山札設定';
    if (gameObject.name.length) title += ' - ' + gameObject.name;
    let option: PanelOption = { title: title, left: coordinate.x - 300, top: coordinate.y - 300, width: 600, height: 600 };
    let component = this.panelService.open<BlankCardSheetComponent>(BlankCardSheetComponent, option);
    component.tabletopObject = gameObject;
  }

  private startIconHiddenTimer() {
    clearTimeout(this.iconHiddenTimer);
    this.iconHiddenTimer = setTimeout(() => {
      this.iconHiddenTimer = null;
      this.changeDetector.markForCheck();
    }, 300);
    this.changeDetector.markForCheck();
  }
}
