import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit
} from "@angular/core";
import { Card, CardState } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";
import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ObjectNode } from "@udonarium/core/synchronize-object/object-node";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { EventSystem, Network } from "@udonarium/core/system";
import { PeerCursor } from "@udonarium/peer-cursor";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { GameCharacterSheetComponent } from "component/game-character-sheet/game-character-sheet.component";
import { InputHandler } from "directive/input-handler";
import { MovableOption } from "directive/movable.directive";
import { RotableOption } from "directive/rotable.directive";
import {
  ContextMenuSeparator,
  ContextMenuService
} from "service/context-menu.service";
import { PanelOption, PanelService } from "service/panel.service";
import { PointerDeviceService } from "service/pointer-device.service";
import { TabletopService } from "service/tabletop.service";
import { RooperCard } from "@udonarium/rooper-card";

@Component({
  selector: "rooper-card",
  templateUrl: "./rooper-card.component.html",
  styleUrls: ["./rooper-card.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RooperCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() card: RooperCard = null;
  @Input() is3D: boolean = false;

  get name(): string {
    return this.card.name;
  }
  get state(): CardState {
    return this.card.state;
  }
  set state(state: CardState) {
    this.card.state = state;
  }
  get rotate(): number {
    return this.card.rotate;
  }
  set rotate(rotate: number) {
    this.card.rotate = rotate;
  }
  get owner(): string {
    return this.card.owner;
  }
  set owner(owner: string) {
    this.card.owner = owner;
  }
  get zindex(): number {
    return this.card.zindex;
  }
  get size(): number {
    return this.adjustMinBounds(this.card.size);
  }

  get isHand(): boolean {
    return this.card.isHand;
  }
  get isFront(): boolean {
    return this.card.isFront;
  }
  get isVisible(): boolean {
    return this.card.isVisible;
  }
  get hasOwner(): boolean {
    return this.card.hasOwner;
  }
  get ownerName(): string {
    return this.card.ownerName;
  }

  get imageFile(): ImageFile {
    return this.card.imageFile;
  }
  get frontImage(): ImageFile {
    return this.card.frontImage;
  }
  get backImage(): ImageFile {
    return this.card.backImage;
  }

  private iconHiddenTimer: NodeJS.Timer = null;
  get isIconHidden(): boolean {
    return this.iconHiddenTimer != null;
  }

  gridSize: number = 50;

  movableOption: MovableOption = {};
  rotableOption: RotableOption = {};

  private doubleClickTimer: NodeJS.Timer = null;
  private doubleClickPoint = { x: 0, y: 0 };

  private input: InputHandler = null;

  @HostBinding("tabIndex") tabIndex: string; //tabIndexを付与するため、ComponentにtabIndexをバインドするメンバを用意
  constructor(
    private ngZone: NgZone,
    private contextMenuService: ContextMenuService,
    private panelService: PanelService,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef,
    private tabletopService: TabletopService,
    private pointerDeviceService: PointerDeviceService
  ) {
    this.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
  }

  ngOnInit() {
    EventSystem.register(this)
      .on("UPDATE_GAME_OBJECT", -1000, event => {
        let object = ObjectStore.instance.get(event.data.identifier);
        if (!this.card || !object) return;
        if (
          this.card === object ||
          (object instanceof ObjectNode && this.card.contains(object)) ||
          (object instanceof PeerCursor && object.peerId === this.card.owner)
        ) {
          this.changeDetector.markForCheck();
        }
      })
      .on("SYNCHRONIZE_FILE_LIST", event => {
        this.changeDetector.markForCheck();
      })
      .on("UPDATE_FILE_RESOURE", -1000, event => {
        this.changeDetector.markForCheck();
      })
      .on("DISCONNECT_PEER", event => {
        if (this.card.owner === event.data.peer)
          this.changeDetector.markForCheck();
      });
    this.movableOption = {
      tabletopObject: this.card,
      transformCssOffset: "translateZ(0.15px)",
      colideLayers: ["terrain"]
    };
    this.rotableOption = {
      tabletopObject: this.card
    };
  }

  ngAfterViewInit() {
    this.input = new InputHandler(this.elementRef.nativeElement);
    this.input.onStart = this.onInputStart.bind(this);
  }

  ngOnDestroy() {
    this.input.destroy();
    EventSystem.unregister(this);
  }

  @HostListener("carddrop", ["$event"])
  onCardDrop(e) {
    if (
      this.card === e.detail ||
      (e.detail instanceof RooperCard === false &&
        e.detail instanceof CardStack === false)
    ) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    if (e.detail instanceof CardStack) {
      let cardStack: CardStack = e.detail;
      let distance: number =
        (cardStack.location.x - this.card.location.x) ** 2 +
        (cardStack.location.y - this.card.location.y) ** 2 +
        (cardStack.posZ - this.card.posZ) ** 2;
      if (distance < 25 ** 2) {
        cardStack.location.x = this.card.location.x;
        cardStack.location.y = this.card.location.y;
        cardStack.posZ = this.card.posZ;
        cardStack.putOnBottom(this.card);
      }
    }
  }

  onDoubleClick(e) {
    if (!this.doubleClickTimer) {
      this.doubleClickTimer = setTimeout(() => {
        clearTimeout(this.doubleClickTimer);
        this.doubleClickTimer = null;
      }, 300);
      this.doubleClickPoint = this.input.pointer;
      return;
    }
    clearTimeout(this.doubleClickTimer);
    this.doubleClickTimer = null;
    let distance =
      (this.doubleClickPoint.x - this.input.pointer.x) ** 2 +
      (this.doubleClickPoint.y - this.input.pointer.y) ** 2;
    if (distance < 10 ** 2) {
      console.log("onDoubleClick !!!!");
      if (this.hasOwner && !this.isHand) return;
      this.state =
        this.isVisible && !this.isHand ? CardState.BACK : CardState.FRONT;
      this.owner = "";
      SoundEffect.play(PresetSound.cardDraw);
    }
  }

  @HostListener("dragstart", ["$event"])
  onDragstart(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onInputStart(e: MouseEvent | TouchEvent) {
    this.input.cancel();
    this.onDoubleClick(e);
    this.card.toTopmost();
    if (e instanceof MouseEvent) this.startIconHiddenTimer();
  }

  @HostListener("contextmenu", ["$event"])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;
    let position = this.pointerDeviceService.pointers[0];
    this.contextMenuService.open(
      position,
      [
        !this.isVisible || this.isHand
          ? {
            name: "表にする",
            action: () => {
              this.card.faceUp();
              SoundEffect.play(PresetSound.cardDraw);
            }
          }
          : {
            name: "裏にする",
            action: () => {
              this.card.faceDown();
              SoundEffect.play(PresetSound.cardDraw);
            }
          },
        ContextMenuSeparator,
        {
          name: "カードを編集",
          action: () => {
            this.showDetail(this.card);
          }
        },
        ContextMenuSeparator,
        {
          name: "削除する",
          action: () => {
            this.card.destroy();
            SoundEffect.play(PresetSound.sweep);
          }
        }
      ],
      this.isVisible ? this.name : "カード"
    );
  }

  onMove() {
    SoundEffect.play(PresetSound.cardPick);
  }

  onMoved() {
    SoundEffect.play(PresetSound.cardPut);
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
    if (e.key === "t") {
      this.card.kill();
      return;
    }
    if (e.key === "u") {
      this.card.revive();
      return;
    }
    // 友好カウンター
    if (e.key === "Y") {
      this.card.decreaseGoodwillCounter();
      return;
    }
    if (e.key === "y") {
      this.card.increaseGoodwillCounter();
      return;
    }
    // 不安カウンター
    if (e.key === "H") {
      this.card.decreaseParanoiaCounter();
      return;
    }
    if (e.key === "h") {
      this.card.increaseParanoiaCounter();
      return;
    }
    if (e.key === "A") {
      this.card.decreaseIntrigueCounter();
      return;
    }
    if (e.key === "a") {
      this.card.increaseIntrigueCounter();
      return;
    }
  }

  // private createStack() {
  //   let cardStack = CardStack.create('山札');
  //   cardStack.location.x = this.card.location.x;
  //   cardStack.location.y = this.card.location.y;
  //   cardStack.posZ = this.card.posZ;
  //   cardStack.location.name = this.card.location.name;
  //   cardStack.rotate = this.rotate;
  //   cardStack.zindex = this.card.zindex;

  //   let cards: RooperCard[] = this.tabletopService.rooperCards.filter(card => {
  //     let distance: number = (card.location.x - this.card.location.x) ** 2 + (card.location.y - this.card.location.y) ** 2 + (card.posZ - this.card.posZ) ** 2;
  //     return distance < 100 ** 2;
  //   });

  //   cards.sort((a, b) => {
  //     if (a.zindex < b.zindex) return 1;
  //     if (a.zindex > b.zindex) return -1;
  //     return 0;
  //   });

  //   for (let card of cards) {
  //     cardStack.putOnBottom(card);
  //   }
  // }

  private dispatchCardDropEvent() {
    console.log("dispatchCardDropEvent");
    let element: HTMLElement = this.elementRef.nativeElement;
    let parent = element.parentElement;
    let children = parent.children;
    let event = new CustomEvent("carddrop", {
      detail: this.card,
      bubbles: true
    });
    for (let i = 0; i < children.length; i++) {
      children[i].dispatchEvent(event);
    }
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

  private showDetail(gameObject: RooperCard) {
    EventSystem.trigger("SELECT_TABLETOP_OBJECT", {
      identifier: gameObject.identifier,
      className: gameObject.aliasName
    });
    let coordinate = this.pointerDeviceService.pointers[0];
    let title = "カード設定";
    if (gameObject.name.length) title += " - " + gameObject.name;
    let option: PanelOption = {
      title: title,
      left: coordinate.x - 300,
      top: coordinate.y - 300,
      width: 600,
      height: 600
    };
    let component = this.panelService.open<GameCharacterSheetComponent>(
      GameCharacterSheetComponent,
      option
    );
    component.tabletopObject = gameObject;
  }

  get goodwill3() {
    if(this.card.goodwill <= 0 ) { return []; }
    return Array(Math.floor(this.card.goodwill / 3));
  }
  get goodwill() {
    if(this.card.goodwill <= 0 ) { return []; }
    return Array(this.card.goodwill % 3);
  }

  get paranoia3() {
    if(this.card.paranoia <= 0 ) { return []; }
    return Array(Math.floor(this.card.paranoia / 3));
  }
  get paranoia() {
    if(this.card.paranoia <= 0 ) { return []; }
    return Array(this.card.paranoia % 3);
  }

  get intrigue3() {
    if(this.card.intrigue <= 0 ) { return []; }
    return Array(Math.floor(this.card.intrigue / 3));
  }
  get intrigue() {
    if(this.card.intrigue <= 0 ) { return []; }
    return Array(this.card.intrigue % 3);
  }
}
