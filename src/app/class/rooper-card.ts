import { SyncObject } from './core/synchronize-object/decorator';
import { DataElement } from './data-element';
import { Card } from './card';
import { ChatPalette } from './chat-palette';

export type Board = '神社' | '学校' | '病院' | '都市';

@SyncObject('rooper-card')
export class RooperCard extends Card {
  static create(name: string, front: string, back: string, size: number = 3, identifier?: string, position?: Board): RooperCard {
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

    object.createTestGameDataElement(name, size, front, position);
    return object;
  }

  get chatPalette(): ChatPalette {
    for (let child of this.children) {
      if (child instanceof ChatPalette) return child;
    }
    return null;
  }
  createTestGameDataElement(name: string, size: number, imageIdentifier: string, position: Board) {
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
    let positionElement: DataElement = DataElement.create('位置', position, {  }, 'Position_' + this.identifier);
    let defaultPositionElement: DataElement = DataElement.create('初期位置', position, {  }, 'DefaultPosition_' + this.identifier);

    this.commonDataElement.appendChild(nameElement);
    this.commonDataElement.appendChild(sizeElement);

    this.commonDataElement.appendChild(goodwillElement);
    this.commonDataElement.appendChild(paranoiaElement);
    this.commonDataElement.appendChild(intrigueElement);
    this.commonDataElement.appendChild(positionElement);
    this.commonDataElement.appendChild(defaultPositionElement);
  }

  // パラメータ追加
  get goodwillElement (){
    return this.commonDataElement.getFirstElementByName('友好');
  }
  get goodwill (): number {
    return parseInt(this.goodwillElement.currentValue as string);
  }
  set goodwill (value: number) {
    this.goodwillElement.currentValue = value;
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
  set paranoia (value: number) {
    this.paranoiaElement.currentValue = value;
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
  set intrigue (value: number) {
    this.intrigueElement.currentValue = value;
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
  get position (): Board {
    return this.positionElement.value as Board;
  }
  setPosition(value: string){
    this.positionElement.value = value;
  }
  get defaultPositionElement (){
    return this.commonDataElement.getFirstElementByName('初期位置');
  }
  get defaultPosition (): Board {
    return this.defaultPositionElement.value as Board;
  }

}

export const rooperCharacterList: {
    name: string,
    card_num: string,
    default_position: Board
  }[] = [
  {name:'男子学生', card_num:'01', default_position: '学校' },
  {name:'女子学生', card_num:'02', default_position: '学校' },
  {name:'お嬢様', card_num:'03', default_position: '学校' },
  {name:'巫女', card_num:'04', default_position: '神社' },
  {name:'刑事', card_num:'05', default_position: '都市' },
  {name:'サラリーマン', card_num:'06', default_position: '都市'},
  {name:'情報屋', card_num:'07', default_position: '都市' },
  {name:'医者', card_num:'08', default_position: '病院' },
  {name:'入院患者', card_num:'09', default_position: '病院' },
  {name:'委員長', card_num:'10', default_position: '学校' },
  {name:'イレギュラー', card_num:'11', default_position: '学校' },
  {name:'異世界人', card_num:'12', default_position: '神社' },
  {name:'神格', card_num:'13', default_position: '神社' },
  {name:'アイドル', card_num:'14', default_position: '都市' },
  {name:'マスコミ', card_num:'15', default_position: '都市' },
  {name:'大物', card_num:'16', default_position: '都市' },
  {name:'ナース', card_num:'17', default_position: '病院' },
  {name:'手先', card_num:'18', default_position: '神社' },
  {name:'学者', card_num:'19', default_position: '病院' },
  {name:'幻想', card_num:'20', default_position: '神社' },
  {name:'鑑識官', card_num:'21', default_position: '都市' },
  {name:'A.I.', card_num:'22', default_position: '都市' },
  {name:'教師', card_num:'23', default_position: '学校' },
  {name:'転校生', card_num:'24', default_position: '学校' },
  {name:'軍人', card_num:'25', default_position: '病院' },
  {name:'黒猫', card_num:'26', default_position: '神社' },
  {name:'女の子', card_num:'27', default_position: '学校' },
  {name:'コピーキャット', card_num:'28', default_position: '都市' },
  {name:'教祖', card_num:'29', default_position: '神社' },
  {name:'ご神木', card_num:'30', default_position: '神社' },
  {name:'妹', card_num:'31', default_position: '神社' },

]
