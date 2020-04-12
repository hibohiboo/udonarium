import { ImageFile } from './core/file-storage/image-file';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { Network } from './core/system';
import { DataElement } from './data-element';
import { PeerCursor } from './peer-cursor';
import { TabletopObject } from './tabletop-object';
import { moveToTopmost } from './tabletop-object-util';
import { Card, CardState } from './card';
import { ChatPalette } from './chat-palette';

@SyncObject('rooper-card')
export class RooperCard extends Card {
  // @SyncVar() state: CardState = CardState.FRONT;
  // @SyncVar() rotate: number = 0;
  // @SyncVar() owner: string = '';
  // @SyncVar() zindex: number = 0;
  // @SyncVar() roll: number = 0;

  // get name(): string { return this.getCommonValue('name', ''); }
  // get size(): number { return this.getCommonValue('size', 2); }
  // set size(size: number) { this.setCommonValue('size', size); }
  // get frontImage(): ImageFile { return this.getImageFile('front'); }
  // get backImage(): ImageFile { return this.getImageFile('back'); }

  // get imageFile(): ImageFile { return this.isVisible ? this.frontImage : this.backImage; }

  // get ownerName(): string {
  //   let object = PeerCursor.find(this.owner);
  //   return object ? object.name : '';
  // }

  // get hasOwner(): boolean { return PeerCursor.find(this.owner) != null; }
  // get isHand(): boolean { return Network.peerId === this.owner; }
  // get isFront(): boolean { return this.state === CardState.FRONT; }
  // get isVisible(): boolean { return this.isHand || this.isFront; }

  // faceUp() {
  //   this.state = CardState.FRONT;
  //   this.owner = '';
  // }

  // faceDown() {
  //   this.state = CardState.BACK;
  //   this.owner = '';
  // }

  // toTopmost() {
  //   moveToTopmost(this, ['card-stack']);
  // }

  static create(name: string, front: string, back: string, size: number = 3, identifier?: string): RooperCard {
    let object: RooperCard = null;

    if (identifier) {
      object = new RooperCard(identifier);
    } else {
      object = new RooperCard();
    }
    object.createDataElements();

    // object.commonDataElement.appendChild(DataElement.create('name', name, {}, 'name_' + object.identifier));
    // object.commonDataElement.appendChild(DataElement.create('size', size, {}, 'size_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('front', front, { type: 'image' }, 'front_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('back', back, { type: 'image' }, 'back_' + object.identifier));
    object.initialize();

    object.createTestGameDataElement(name, size, front);
    return object;
  }

  get chatPalette(): ChatPalette {
    for (let child of this.children) {
      if (child instanceof ChatPalette) return child;
    }
    return null;
  }
  createTestGameDataElement(name: string, size: number, imageIdentifier: string) {
    this.createDataElements();

    let nameElement: DataElement = DataElement.create('name', name, {}, 'name_' + this.identifier);
    let sizeElement: DataElement = DataElement.create('size', size, {}, 'size_' + this.identifier);

    // if (this.imageDataElement.getFirstElementByName('imageIdentifier')) {
    //   this.imageDataElement.getFirstElementByName('imageIdentifier').value = imageIdentifier;
    // }

    // let resourceElement: DataElement = DataElement.create('リソース', '', {}, 'リソース' + this.identifier);
    let goodwillElement: DataElement = DataElement.create('友好', 0, { 'type': 'numberResource', 'currentValue': '0' }, 'Goodwill_' + this.identifier);
    let paranoiaElement: DataElement = DataElement.create('不安', 0, { 'type': 'numberResource', 'currentValue': '0' }, 'Paranoia_' + this.identifier);
    let intrigueElement: DataElement = DataElement.create('暗躍', 0, { 'type': 'numberResource', 'currentValue': '0' }, 'Intrigue_' + this.identifier);
    let positionElement: DataElement = DataElement.create('位置', '神社', {  }, 'Position_' + this.identifier);

    this.commonDataElement.appendChild(nameElement);
    this.commonDataElement.appendChild(sizeElement);

    this.commonDataElement.appendChild(goodwillElement);
    this.commonDataElement.appendChild(paranoiaElement);
    this.commonDataElement.appendChild(intrigueElement);
    this.commonDataElement.appendChild(positionElement);

    // this.detailDataElement.appendChild(resourceElement);
    // resourceElement.appendChild(goodwillElement);
    // resourceElement.appendChild(paranoiaElement);
    // resourceElement.appendChild(intrigueElement);

    // //TEST
    // let testElement: DataElement = DataElement.create('情報', '', {}, '情報' + this.identifier);
    // this.detailDataElement.appendChild(testElement);
    // testElement.appendChild(DataElement.create('説明', 'ここに説明を書く\nあいうえお', { 'type': 'note' }, '説明' + this.identifier));
    // testElement.appendChild(DataElement.create('メモ', '任意の文字列\n１\n２\n３\n４\n５', { 'type': 'note' }, 'メモ' + this.identifier));

    // //TEST
    // testElement = DataElement.create('能力', '', {}, '能力' + this.identifier);
    // this.detailDataElement.appendChild(testElement);
    // testElement.appendChild(DataElement.create('器用度', 24, {}, '器用度' + this.identifier));
    // testElement.appendChild(DataElement.create('敏捷度', 24, {}, '敏捷度' + this.identifier));
    // testElement.appendChild(DataElement.create('筋力', 24, {}, '筋力' + this.identifier));
    // testElement.appendChild(DataElement.create('生命力', 24, {}, '生命力' + this.identifier));
    // testElement.appendChild(DataElement.create('知力', 24, {}, '知力' + this.identifier));
    // testElement.appendChild(DataElement.create('精神力', 24, {}, '精神力' + this.identifier));

    // //TEST
    // testElement = DataElement.create('戦闘特技', '', {}, '戦闘特技' + this.identifier);
    // this.detailDataElement.appendChild(testElement);
    // testElement.appendChild(DataElement.create('Lv1', '全力攻撃', {}, 'Lv1' + this.identifier));
    // testElement.appendChild(DataElement.create('Lv3', '武器習熟/ソード', {}, 'Lv3' + this.identifier));
    // testElement.appendChild(DataElement.create('Lv5', '武器習熟/ソードⅡ', {}, 'Lv5' + this.identifier));
    // testElement.appendChild(DataElement.create('Lv7', '頑強', {}, 'Lv7' + this.identifier));
    // testElement.appendChild(DataElement.create('Lv9', '薙ぎ払い', {}, 'Lv9' + this.identifier));
    // testElement.appendChild(DataElement.create('自動', '治癒適正', {}, '自動' + this.identifier));

    // let domParser: DOMParser = new DOMParser();
    // let gameCharacterXMLDocument: Document = domParser.parseFromString(this.rootDataElement.toXml(), 'application/xml');

    let palette: ChatPalette = new ChatPalette('ChatPalette_' + this.identifier);
//     palette.setPalette(`チャットパレット入力例：
// 2d6+1 ダイスロール
// １ｄ２０＋{敏捷}＋｛格闘｝　{name}の格闘！
// //敏捷=10+{敏捷A}
// //敏捷A=10
// //格闘＝１`);
    palette.initialize();
    this.appendChild(palette);
  }

  // パラメータ追加
  get goodwillElement (){
    return this.commonDataElement.getFirstElementByName('友好');
  }
  get goodwill (): number {
    return parseInt(this.goodwillElement.currentValue as string);
  }
  increaseGoodwillCounter(){
    this.goodwillElement.currentValue = this.goodwill + 1;
  }
  decreaseGoodwillCounter(){
    this.goodwillElement.currentValue = this.goodwill - 1;
  }
  get paranoiaElement (){
    return this.commonDataElement.getFirstElementByName('不安');
  }
  get paranoia (): number {
    return parseInt(this.paranoiaElement.currentValue as string);
  }
  increaseParanoiaCounter(){
    this.paranoiaElement.currentValue = this.paranoia + 1;
  }
  decreaseParanoiaCounter(){
    this.paranoiaElement.currentValue = this.paranoia - 1;
  }
  get intrigueElement (){
    return this.commonDataElement.getFirstElementByName('暗躍');
  }
  get intrigue (): number {
    return parseInt(this.intrigueElement.currentValue as string);
  }
  increaseIntrigueCounter(){
    this.intrigueElement.currentValue = this.intrigue + 1;
  }
  decreaseIntrigueCounter(){
    this.intrigueElement.currentValue = this.intrigue - 1;
  }
  get isDead():boolean {
    const rotate = this.rotate;// 正の数しかとれないので不要 → Math.abs(this.rotate);
    return rotate >= 70 && rotate <=110 || rotate >= 260 && rotate <=280;
  }
  set isDead(value:boolean) {
    if(!value){
      this.revive();
      return;
    }
    this.kill();
  }
  kill () {
    this.rotate = 90;
  }

  revive() {
    this.rotate = 0;
  }

  get positionElement (){
    return this.commonDataElement.getFirstElementByName('位置');
  }
  get position (): string {
    return this.positionElement.value as string;
  }
  setPosition(value: string){
    this.positionElement.value = value;
  }

}
