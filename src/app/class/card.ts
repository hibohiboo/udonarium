import { extendCreateForWritableText, initCardClassForWritableText } from 'src/plugins/add-card-text-writable/extend/class/card';
import { initRotateOffCard } from 'src/plugins/object-rotate-off/extends/class/card';
import { hasOwnerExtend, initReturnTheHandCard, ownerNameExtend } from 'src/plugins/return-the-hand/extend/class/card';
import { addSyncHideVirtualScreen } from 'src/plugins/virtual-screen/extend/class/addSyncHideVirtualScreen';
import { ImageFile } from './core/file-storage/image-file';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { Network } from './core/system';
import { DataElement } from './data-element';
import { TabletopObject } from './tabletop-object';
import { moveToBackmost, moveToTopmost } from './tabletop-object-util';

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
  constructor(identifier?: string) {
    super(identifier);
    addSyncHideVirtualScreen(this);
    initCardClassForWritableText(this);
    initReturnTheHandCard(this);
    initRotateOffCard(this);
  }

  get isVisibleOnTable(): boolean { return this.location.name === 'table' && (!this.parentIsAssigned || this.parentIsDestroyed); }

  get name(): string { return this.getCommonValue('name', ''); }
  get size(): number { return this.getCommonValue('size', 2); }
  set size(size: number) { this.setCommonValue('size', size); }
  get frontImage(): ImageFile { return this.getImageFile('front'); }
  get backImage(): ImageFile { return this.getImageFile('back'); }

  get imageFile(): ImageFile { return this.isVisible ? this.frontImage : this.backImage; }

  get ownerName(): string {
    return ownerNameExtend(this);
  }
  get hasOwner(): boolean { return hasOwnerExtend(this) }

  get ownerIsOnline(): boolean { return this.hasOwner && (this.isHand || Network.peers.some(peer => peer.userId === this.owner && peer.isOpen)); }
  get isHand(): boolean { return Network.peer.userId === this.owner; }
  get isFront(): boolean { return this.state === CardState.FRONT; }
  get isVisible(): boolean { return this.isHand || this.isFront; }

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

  toBackmost() {
    moveToBackmost(this, ['card-stack']);
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
    extendCreateForWritableText(object);
    object.initialize();

    return object;
  }
}
