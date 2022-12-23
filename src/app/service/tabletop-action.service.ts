import { Injectable } from '@angular/core';
import { Card } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { ImageContext, ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { EventSystem } from '@udonarium/core/system';
import { Cutin } from '@udonarium/cutin';
import { Device } from '@udonarium/device/device';
import { DiceSymbol, DiceType } from '@udonarium/dice-symbol';
import { GameCharacter } from '@udonarium/game-character';
import { GameTable } from '@udonarium/game-table';
import { GameTableMask } from '@udonarium/game-table-mask';
import { Board, RooperCard, rooperCharacterList } from '@udonarium/rooper-card';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { TableSelecter } from '@udonarium/table-selecter';
import { Terrain } from '@udonarium/terrain';
import { TextNote } from '@udonarium/text-note';

import { ContextMenuAction } from './context-menu.service';
import { PointerCoordinate } from './pointer-device.service';

@Injectable({
  providedIn: 'root'
})
export class TabletopActionService {

  constructor() { }
  private getCreateRooperMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: "惨劇RoopeR",
      action: null,
      subActions: this.getCreateRooperSubMenu(position)
    };
  }
  private getCreateRooperSubMenu(position: PointerCoordinate) : ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];

    subMenus.push({
      name: "キャラクター追加",
      action: null,
      subActions: this.getCreateRooperSubSubMenu(position)
    });
    subMenus.push({
      name: "手札追加",
      action: null,
      subActions: this.createRooperHandsMenu(position)
    });

    subMenus.push({
      name: "拡張カード追加",
      action: null,
      subActions: this.createRooperExtraMenu(position)
    });
    subMenus.push({
      name: "トークン追加",
      action: null,
      subActions: this.createRooperTokenMenu(position)
    });
    subMenus.push({
      name: "手札追加(レイ)",
      action: null,
      subActions: this.createRooperHandsMenuRei(position)
    });
    return subMenus;
  }
  private createRooperHandsMenu(position):ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];
    subMenus.push({
      name: '脚本家手札',
      action: ()=>{
        this.createRooperScripterHands(position, '脚本家手札','a_writer_cards', 'hand_s');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '主人公A手札',
      action: ()=>{
        this.createRooperProtagonistHands(position, '主人公A手札','a_heroA_cards', 'hand_a');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '主人公B手札',
      action: ()=>{
        this.createRooperProtagonistHands(position, '主人公B手札','a_heroB_cards', 'hand_b');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '主人公C手札',
      action: ()=>{
        this.createRooperProtagonistHands(position, '主人公C手札','a_heroC_cards', 'hand_c');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    return subMenus;
  }
  private createRooperHandsMenuRei(position):ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];
    subMenus.push({
      name: '脚本家手札',
      action: ()=>{
        this.createRooperScripterHandsRei(position, '脚本家手札','a_writer_cards', 'hand_s');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '主人公A手札',
      action: ()=>{
        this.createRooperProtagonistHandsRei(position, '主人公A手札','a_heroA_cards', 'hand_a');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '主人公B手札',
      action: ()=>{
        this.createRooperProtagonistHandsRei(position, '主人公B手札','a_heroB_cards', 'hand_b');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '主人公C手札',
      action: ()=>{
        this.createRooperProtagonistHandsRei(position, '主人公C手札','a_heroC_cards', 'hand_c');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    return subMenus;
  }
  private createRooperTokenMenu(position):ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_tokens = `${prefix_path_rooper}/tokens`;

    const createCard = (position, title, path)=>{
      const back = `${prefix_path_tokens}/${path}.png`;
      if (!ImageStorage.instance.get(back)) {
        ImageStorage.instance.add(back);
      }
      const front = `${prefix_path_tokens}/${path}.png`;
      if (!ImageStorage.instance.get(front)) {
        ImageStorage.instance.add(front);
      }
      const card = Card.create(title, front, back, 1);
      card.location.x = position.x - 25;
      card.location.y = position.y - 25;
    }

    subMenus.push({
      name: '暗躍カウンター',
      action: ()=>{
        createCard(position, '暗躍カウンター','chip_03');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '事件カウンター',
      action: ()=>{
        createCard(position, '事件カウンター','chip_08');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '刑事カウンター',
      action: ()=>{
        createCard(position, '刑事カウンター','guard');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '大物カウンター',
      action: ()=>{
        createCard(position, '大物カウンター','turf');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: '従者カウンター',
      action: ()=>{
        createCard(position, '従者カウンター','loyalty');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    return subMenus;
  }

  private createRooperExtraMenu(position:PointerCoordinate) :ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_extra = `${prefix_path_rooper}/extra`;
    const back = `${prefix_path_extra}/extra_back.png`;
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back);
    }
    const createCard = (position, title,id)=>{
      const front = `${prefix_path_extra}/${id}.png`;
      if (!ImageStorage.instance.get(front)) {
        ImageStorage.instance.add(front);
      }
      const card = Card.create(title, front, back);
      card.location.x = position.x - 25;
      card.location.y = position.y - 25;
    }

    subMenus.push({
      name: 'ExtraA',
      action: ()=>{
        createCard(position, 'ExtraA','extra_a');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: 'ExtraB',
      action: ()=>{
        createCard(position, 'ExtraB','extra_b');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: 'ExtraC',
      action: ()=>{
        createCard(position, 'ExtraC','extra_c');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    subMenus.push({
      name: 'ExtraD',
      action: ()=>{
        createCard(position, 'ExtraD','extra_d');
        SoundEffect.play(PresetSound.cardPut);
      }
    });
    return subMenus;
  }

  private createRooperScripterHands(
    position: PointerCoordinate,
    title: string,
    prefix:string,
    identifier: string,
  ): CardStack {
    return this.createRooperHands(position, title,prefix, identifier,
    ['不安+1', '不安+1', '不安-1', '不安禁止', '友好禁止', '暗躍+1',
   '暗躍+2', '移動↑↓', '移動←→', '移動斜め']);
  }
  private createRooperScripterHandsRei(
    position: PointerCoordinate,
    title: string,
    prefix:string,
    identifier: string,
  ): CardStack {
    return this.createRooperHands(position, title,prefix, identifier,
    ['不安+1', '不安+1', '不安-1', '不安禁止', '友好禁止', '暗躍+1',
   '暗躍+2', '移動↑↓', '移動←→', '移動斜め','友好+1','絶望+1']);
  }
  private createRooperProtagonistHands(
    position: PointerCoordinate,
    title: string,
    prefix:string,
    identifier: string,
  ): CardStack {
    return this.createRooperHands(position, title,prefix, identifier,
      ['不安+1', '不安-1', '友好+1', '友好+2', '暗躍禁止',
      '移動↑↓', '移動←→', '移動禁止']);
  }
  private createRooperProtagonistHandsRei(
    position: PointerCoordinate,
    title: string,
    prefix:string,
    identifier: string,
  ): CardStack {
    return this.createRooperHands(position, title,prefix, identifier,
      ['不安+1', '不安-1', '友好+1', '友好+2', '暗躍禁止',
      '移動↑↓', '移動←→', '移動禁止','不安+2','希望+1']);
  }
  private createRooperHands(
    position: PointerCoordinate,
    title: string,
    prefix:string,
    identifier: string,
    items: string[]
  ): CardStack {
    const cardStack = CardStack.create(title, identifier);
    cardStack.location.x = position.x - 25;
    cardStack.location.y = position.y - 25;
    cardStack.posZ = position.z;

    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_action_cards = `${prefix_path_rooper}/action_cards`;

    const back = `${prefix_path_action_cards}/${prefix}_0b.png`;
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back);
    }

    items.forEach((name, index) => {
      const id = ('0' + (index - -1)).slice(-2);
      const url =  `${prefix_path_action_cards}/${prefix}_${id}.png`;
      if (!ImageStorage.instance.get(url)) {
        ImageStorage.instance.add(url);
      }
      const card = Card.create(name, url, back, undefined, `${identifier}-${index}`);
      cardStack.putOnBottom(card);
    });
    return cardStack;
  }

  getCreateRooperSubSubMenu(position: PointerCoordinate) : ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_characters = `${prefix_path_rooper}/chara_cards`;
    const action = (name:string, card_num:string, default_position: Board)=>{
      const card_back = `${prefix_path_characters}/character_${card_num}_0.png`;
      if (!ImageStorage.instance.get(card_back)) {
        ImageStorage.instance.add(card_back);
      }
      const card_front = `${prefix_path_characters}/character_${card_num}_1.png`;
      if (!ImageStorage.instance.get(card_front)) {
        ImageStorage.instance.add(card_front);
      }
      const testCard = RooperCard.create(name, card_front, card_back, undefined, undefined, default_position);
      testCard.location.x= position.x - 25;
      testCard.location.y = position.y - 25;

      SoundEffect.play(PresetSound.cardPut);
    };
    if(Device.isMobile()){

      const character1 = rooperCharacterList.filter(character=>Number(character.card_num)<10);
      const character2 = rooperCharacterList.filter(character=>10 <= Number(character.card_num) && Number(character.card_num) < 23);
      const character3 = rooperCharacterList.filter(character=>23 <= Number(character.card_num));

      subMenus.push({
        name: "キャラクター追加1",
        action: null,
        subActions: (()=>{const menues: ContextMenuAction[] = [];character1.forEach(({name,card_num,default_position})=>{menues.push({name,action: () => {action(name, card_num,default_position);}});}); return menues})()
      });
      subMenus.push({
        name: "キャラクター追加2",
        action: null,
        subActions: (()=>{const menues: ContextMenuAction[] = [];character2.forEach(({name,card_num,default_position})=>{menues.push({name,action: () => {action(name, card_num,default_position);}});}); return menues})()
      });
      subMenus.push({
        name: "キャラクター追加3",
        action: null,
        subActions: (()=>{const menues: ContextMenuAction[] = [];character3.forEach(({name,card_num,default_position})=>{menues.push({name,action: () => {action(name, card_num,default_position);}});}); return menues})()
      });
      return subMenus;
    }
    const characters = rooperCharacterList;

    subMenus.push({
      name: "キャラクター一覧",
      action: () => {
        const cardStack = CardStack.create("キャラクター一覧");
        cardStack.location.x = position.x - 25;
        cardStack.location.y = position.y - 25;
        cardStack.posZ = position.z;
        characters.forEach(({name,card_num,default_position})=>{
          const card_back = `${prefix_path_characters}/character_${card_num}_0.png`;
          if (!ImageStorage.instance.get(card_back)) {
            ImageStorage.instance.add(card_back);
          }
          const card_front = `${prefix_path_characters}/character_${card_num}_1.png`;
          if (!ImageStorage.instance.get(card_front)) {
            ImageStorage.instance.add(card_front);
          }
          const testCard = RooperCard.create(name, card_front, card_back, 3, undefined, default_position);
          cardStack.putOnBottom(testCard);
        });

        SoundEffect.play(PresetSound.cardPut);
      }
    });
    characters.forEach(({name,card_num, default_position})=>{
      subMenus.push({
        name,
        action: () => {
          action(name, card_num, default_position);
        }
      });
    });

    return subMenus;
  }



  createGameCharacter(position: PointerCoordinate): GameCharacter {
    let character = GameCharacter.create('新しいキャラクター', 1, '');
    character.location.x = position.x - 25;
    character.location.y = position.y - 25;
    character.posZ = position.z;
    return character;
  }

  createGameTableMask(position: PointerCoordinate): GameTableMask {
    let viewTable = this.getViewTable();
    if (!viewTable) return;

    let tableMask = GameTableMask.create('マップマスク', 5, 5, 100);
    tableMask.location.x = position.x - 25;
    tableMask.location.y = position.y - 25;
    tableMask.posZ = position.z;

    viewTable.appendChild(tableMask);
    return tableMask;
  }

  createTerrain(position: PointerCoordinate): Terrain {
    let url: string = './assets/images/tex.jpg';
    let image: ImageFile = ImageStorage.instance.get(url)
    if (!image) image = ImageStorage.instance.add(url);

    let viewTable = this.getViewTable();
    if (!viewTable) return;

    let terrain = Terrain.create('地形', 2, 2, 2, image.identifier, image.identifier);
    terrain.location.x = position.x - 50;
    terrain.location.y = position.y - 50;
    terrain.posZ = position.z;

    viewTable.appendChild(terrain);
    return terrain;
  }

  createTextNote(position: PointerCoordinate): TextNote {
    let textNote = TextNote.create('共有メモ', 'テキストを入力してください', 5, 4, 3);
    textNote.location.x = position.x;
    textNote.location.y = position.y;
    textNote.posZ = position.z;
    return textNote;
  }

  createDiceSymbol(position: PointerCoordinate, name: string, diceType: DiceType, imagePathPrefix: string): DiceSymbol {
    let diceSymbol = DiceSymbol.create(name, diceType, 1);
    let image: ImageFile = null;

    diceSymbol.faces.forEach(face => {
      let url: string = `./assets/images/dice/${imagePathPrefix}/${imagePathPrefix}[${face}].png`;
      image = ImageStorage.instance.get(url);
      if (!image) { image = ImageStorage.instance.add(url); }
      diceSymbol.imageDataElement.getFirstElementByName(face).value = image.identifier;
    });

    diceSymbol.location.x = position.x - 25;
    diceSymbol.location.y = position.y - 25;
    diceSymbol.posZ = position.z;
    return diceSymbol;
  }

  createTrump(position: PointerCoordinate): CardStack {
    let cardStack = CardStack.create('トランプ山札');
    cardStack.location.x = position.x - 25;
    cardStack.location.y = position.y - 25;
    cardStack.posZ = position.z;

    let back: string = './assets/images/trump/z02.gif';
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back);
    }

    let suits: string[] = ['c', 'd', 'h', 's'];
    let trumps: string[] = [];

    for (let suit of suits) {
      for (let i = 1; i <= 13; i++) {
        trumps.push(suit + (('00' + i).slice(-2)));
      }
    }

    trumps.push('x01');
    trumps.push('x02');

    for (let trump of trumps) {
      let url: string = './assets/images/trump/' + trump + '.gif';
      if (!ImageStorage.instance.get(url)) {
        ImageStorage.instance.add(url);
      }
      let card = Card.create('カード', url, back);
      cardStack.putOnBottom(card);
    }
    return cardStack;
  }

  makeDefaultTable() {
    let gameTable = new GameTable('gameTable');
    let testBgFile: ImageFile = null;
    let bgFileContext = ImageFile.createEmpty('testTableBackgroundImage_image').toContext();
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_board = `${prefix_path_rooper}/board`;
    bgFileContext.url = `${prefix_path_board}/board.png`;
    testBgFile = ImageStorage.instance.add(bgFileContext);
    gameTable.name = "最初のテーブル";
    gameTable.imageIdentifier = testBgFile.identifier;
    gameTable.width = 32;
    gameTable.height = 20;
    gameTable.initialize();

    TableSelecter.instance.viewTableIdentifier = gameTable.identifier;
  }

  makeDefaultTabletopObjects() {
    let testCharacter: GameCharacter = null;
    let testFile: ImageFile = null;
    let fileContext: ImageContext = null;

    // キャラクター追加
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_characters = `${prefix_path_rooper}/chara_cards`;

    const tick = 50;
    const board_left_edge_x = 5.5 * tick;
    const board_top_y = 0;
    const bord_chip_margin = 2.5 * tick;
    const card_width = 3.5 * tick;
    const board_right_edge_x = board_left_edge_x + 13.5 * tick;
    const board_under_y = 10 * tick;
    [
      // {name:'巫女', card_num:'04', x: (board_right_edge_x), y:(board_top_y + bord_chip_margin)},
    ].forEach(({name,card_num,x,y})=>{
      const card_back = `${prefix_path_characters}/character_${card_num}_0.png`;
      if (!ImageStorage.instance.get(card_back)) {
        ImageStorage.instance.add(card_back);
      }
      const card_front = `${prefix_path_characters}/character_${card_num}_1.png`;
      if (!ImageStorage.instance.get(card_front)) {
        ImageStorage.instance.add(card_front);
      }
      const testCard = RooperCard.create(name, card_front, card_back, 3, `sample_rooper_card_${card_num}`, '神社');
      testCard.location.x = x;
      testCard.location.y = y;
    });

    // 手札初期表示
    this.createRooperScripterHands({x:800,y:300, z: 0}, '脚本家手札','a_writer_cards', 'sample_hand_s').faceDownAll();
    this.createRooperProtagonistHands({x:600,y:500, z: 0}, '主人公A手札','a_heroA_cards', 'sample_hand_a').faceDownAll();
    this.createRooperProtagonistHands({x:800,y:500, z: 0}, '主人公B手札','a_heroB_cards', 'sample_hand_b').faceDownAll();
    this.createRooperProtagonistHands({x:1000,y:500, z: 0}, '主人公C手札','a_heroC_cards', 'sample_hand_c').faceDownAll();
    // リーダーカート表示
    const createExtra = (position, title, path, size=2)=>{
      const img = `${prefix_path_rooper}/extra/${path}.png`;
      if (!ImageStorage.instance.get(img)) {
        ImageStorage.instance.add(img);
      }
      const card = Card.create(title, img, img, size, `sample_${path}`);
      card.location.x = position.x;
      card.location.y = position.y;
    }
    createExtra({x:600, y:600, z: 0}, 'リーダーカード', 'leader');
    createExtra({x:400, y:-150, z: 0}, 'ExtraA', 'extra_a');
    createExtra({x:410, y:-150, z: 0}, 'ExtraB', 'extra_b');
    createExtra({x:420, y:-150, z: 0}, 'ExtraC', 'extra_c');
    createExtra({x:430, y:-150, z: 0}, 'ExtraD', 'extra_d');

    // カウンター初期表示

    const prefix_path_tokens = `${prefix_path_rooper}/tokens`;
    const createToken = (position, title, path)=>{
      const back = `${prefix_path_tokens}/${path}.png`;
      if (!ImageStorage.instance.get(back)) {
        ImageStorage.instance.add(back);
      }
      const front = `${prefix_path_tokens}/${path}.png`;
      if (!ImageStorage.instance.get(front)) {
        ImageStorage.instance.add(front);
      }
      const card = Card.create(title, front, back, 1, `sample_${path}_${position.x}_${position.y}`);
      card.location.x = position.x - 25;
      card.location.y = position.y - 25;
    }
    createToken({x:30,y:280, z: 0}, '現在日数', 'chip_07');
    createToken({x:100,y:280, z: 0}, '事件カウンター', 'chip_08');
    createToken({x:100,y:340, z: 0}, '事件カウンター', 'chip_08');
    createToken({x:100,y:400, z: 0}, '事件カウンター', 'chip_08');
    createToken({x:100,y:470, z: 0}, '事件カウンター', 'chip_08');
    createToken({x:165,y:470, z: 0}, 'ループカウンター', 'chip_09');
    createToken({x:230,y:280, z: 0}, 'Exカウンター', 'chip_10');
    createExtra({x:10, y:550, z: 0}, '日記', 'diary', 1);
    createExtra({x:125, y:750, z: 0}, '時計', 'clock', 1);
    createExtra({x:175, y:750, z: 0}, 'app', 'icon', 1);
    createToken({x:300,y:-50, z: 0}, '暗躍カウンター', 'chip_03');
    createToken({x:310,y:-50, z: 0}, '暗躍カウンター', 'chip_03');
    createToken({x:320,y:-50, z: 0}, '暗躍カウンター', 'chip_03');
    createToken({x:330,y:-50, z: 0}, '暗躍カウンター', 'chip_03');
    createToken({x:340,y:-50, z: 0}, '暗躍カウンター', 'chip_03');
    createToken({x:350,y:-50, z: 0}, '暗躍カウンター', 'chip_06');
    createToken({x:360,y:-50, z: 0}, '暗躍カウンター', 'chip_06');
    createToken({x:370,y:-50, z: 0}, '暗躍カウンター', 'chip_06');
    createToken({x:280,y:-50, z: 0}, '大物トークン', 'turf');
    createToken({x:290,y:-50, z: 0}, '刑事トークン', 'guard');
    let textNote = TextNote.create(
      "公開シート",
      `ループ回数: 4回 / 1ループ日数: 5日
相談: 不可
[事件予定]
1日目: 不安拡大
2日目: 殺人事件
3日目: 自殺
4日目: 行方不明
5日目:
`,
      5,
      6,
      3,
      'sample_open_sheet'
    );
    textNote.location.x = 100;
    textNote.location.y = 150;
    textNote.posZ = 0;

    const prefix_path_turns = `${prefix_path_rooper}/turn`;
    [
      {title:'ターン開始'},
      {title:'脚本家行動'},
      {title:'主人公行動 A'},
      {title:'主人公行動 B'},
      {title:'主人公行動 C'},
      {title:'行動解決'},
      {title:'脚本家能力'},
      {title:'主人公能力'},
      {title:'事件'},
      {title:'リーダー交代'},
      {title:'ターン終了'},
    ].forEach(({title,}, index)=>{
      const card_num:number = index + 1;
      const card_front = `${prefix_path_turns}/turn_${card_num}.png`;
      if (!ImageStorage.instance.get(card_front)) {
        ImageStorage.instance.add(card_front);
      }
      Cutin.create(title, card_front, '', 433, 270, 0, `sampleCutin_${card_front}`);
    });

  }

  makeDefaultContextMenuActions(position: PointerCoordinate): ContextMenuAction[] {
    return [
      this.getCreateRooperMenu(position),
      this.getCreateCharacterMenu(position),
      this.getCreateTableMaskMenu(position),
      this.getCreateTerrainMenu(position),
      this.getCreateTextNoteMenu(position),
      this.getCreateTrumpMenu(position),
      this.getCreateDiceSymbolMenu(position),
    ];
  }

  private getCreateCharacterMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: 'キャラクターを作成', action: () => {
        let character = this.createGameCharacter(position);
        EventSystem.trigger('SELECT_TABLETOP_OBJECT', { identifier: character.identifier, className: character.aliasName });
        SoundEffect.play(PresetSound.piecePut);
      }
    }
  }

  private getCreateTableMaskMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: 'マップマスクを作成', action: () => {
        this.createGameTableMask(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateTerrainMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '地形を作成', action: () => {
        this.createTerrain(position);
        SoundEffect.play(PresetSound.blockPut);
      }
    }
  }

  private getCreateTextNoteMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: '共有メモを作成', action: () => {
        this.createTextNote(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateTrumpMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: 'トランプの山札を作成', action: () => {
        this.createTrump(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    }
  }

  private getCreateDiceSymbolMenu(position: PointerCoordinate): ContextMenuAction {
    let dices: { menuName: string, diceName: string, type: DiceType, imagePathPrefix: string }[] = [
      { menuName: 'D4', diceName: 'D4', type: DiceType.D4, imagePathPrefix: '4_dice' },
      { menuName: 'D6', diceName: 'D6', type: DiceType.D6, imagePathPrefix: '6_dice' },
      { menuName: 'D8', diceName: 'D8', type: DiceType.D8, imagePathPrefix: '8_dice' },
      { menuName: 'D10', diceName: 'D10', type: DiceType.D10, imagePathPrefix: '10_dice' },
      { menuName: 'D10 (00-90)', diceName: 'D10', type: DiceType.D10_10TIMES, imagePathPrefix: '100_dice' },
      { menuName: 'D12', diceName: 'D12', type: DiceType.D12, imagePathPrefix: '12_dice' },
      { menuName: 'D20', diceName: 'D20', type: DiceType.D20, imagePathPrefix: '20_dice' },
    ];
    let subMenus: ContextMenuAction[] = [];

    dices.forEach(item => {
      subMenus.push({
        name: item.menuName, action: () => {
          this.createDiceSymbol(position, item.diceName, item.type, item.imagePathPrefix);
          SoundEffect.play(PresetSound.dicePut);
        }
      });
    });
    return { name: 'ダイスを作成', action: null, subActions: subMenus };
  }

  private getViewTable(): GameTable {
    return TableSelecter.instance.viewTable;
  }
}
