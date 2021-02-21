import { ImageFile } from './core/file-storage/image-file';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { Network } from './core/system';
import { DataElement } from './data-element';
import { PeerCursor } from './peer-cursor';
import { TabletopObject } from './tabletop-object';
import { moveToTopmost } from './tabletop-object-util';
import config from 'src/app/plugins/config';

export enum CardState {
  FRONT,
  BACK,
}

@SyncObject('card')
export class Card extends TabletopObject {
  @SyncVar() state: CardState = CardState.FRONT;
  @SyncVar() rotate: number = 0;
  @SyncVar() owner: string = '';
  @SyncVar() zindex: number = 0;
  @SyncVar() isSelfHide: boolean = false;

  get isVisibleOnTable(): boolean { return this.location.name === 'table' && (!this.parentIsAssigned || this.parentIsDestroyed); }

  get name(): string { return this.getCommonValue('name', ''); }
  get size(): number { return this.getCommonValue('size', 2); }
  set size(size: number) { this.setCommonValue('size', size); }
  get frontImage(): ImageFile { return this.getImageFile('front'); }
  get backImage(): ImageFile { return this.getImageFile('back'); }

  get imageFile(): ImageFile { return this.isVisible ? this.frontImage : this.backImage; }

  get ownerName(): string {
    let object = PeerCursor.findByUserId(this.owner);
    return object ? object.name : '';
  }

  get hasOwner(): boolean { return 0 < this.owner.length; }
  get isHand(): boolean { return Network.peerContext.userId === this.owner; }
  get isFront(): boolean { return this.state === CardState.FRONT; }
  get isVisible(): boolean {
    if(this.isCardGMView && PeerCursor.myCursor.isCardGMView) return true
    if(config.useCardOnlySelfHide){
      return this.isHand && !this.isSelfHide || this.isOtherSelfHide || this.isFront;
    }
    return this.isHand || this.isFront;
  }
  get isOtherSelfHide(): boolean { return this.owner !== '' && Network.peerContext.userId !== this.owner && this.isSelfHide }
  get isCardGMView(): boolean{ return config.useCardGMView && PeerCursor.myCursor.isCardGMView }

  // start with fly
  get ownerColor(): string {
    let object = PeerCursor.findByUserId(this.owner);
    return object ? object.color : '#ff0';
  }
  // end with fly

  // 自分だけ隠す with-plus
  setSelfHide() {
    this.owner = Network.peerContext.userId;
    this.isSelfHide = true
  }

  faceUp() {
    this.state = CardState.FRONT;
    this.owner = '';
  }

  faceDown() {
    this.state = CardState.BACK;
    this.owner = '';
  }

  toTopmost() {
    moveToTopmost(this, ['card-stack']);
  }

  static create(name: string, fornt: string, back: string, size: number = 2, identifier?: string): Card {
    let object: Card = null;

    if (identifier) {
      object = new Card(identifier);
    } else {
      object = new Card();
    }
    object.createDataElements();

    object.commonDataElement.appendChild(DataElement.create('name', name, {}, 'name_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('size', size, {}, 'size_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('front', fornt, { type: 'image' }, 'front_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('back', back, { type: 'image' }, 'back_' + object.identifier));
    object.initialize();

    return object;
  }
}
