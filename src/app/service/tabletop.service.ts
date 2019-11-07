import { Injectable, NgZone } from "@angular/core";
import { Card } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";
import {
  ImageContext,
  ImageFile
} from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { ObjectSerializer } from "@udonarium/core/synchronize-object/object-serializer";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { EventSystem } from "@udonarium/core/system";
import { DiceSymbol, DiceType } from "@udonarium/dice-symbol";
import { GameCharacter } from "@udonarium/game-character";
import { GameTable } from "@udonarium/game-table";
import { GameTableMask } from "@udonarium/game-table-mask";
import { PeerCursor } from "@udonarium/peer-cursor";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { TableSelecter } from "@udonarium/table-selecter";
import { TabletopObject } from "@udonarium/tabletop-object";
import { Terrain } from "@udonarium/terrain";
import { TextNote } from "@udonarium/text-note";

import { ContextMenuAction, ContextMenuType } from "./context-menu.service";
import {
  PointerCoordinate,
  PointerDeviceService
} from "./pointer-device.service";

import { RooperCard } from '@udonarium/rooper-card';

type ObjectIdentifier = string;
type LocationName = string;

@Injectable()
export class TabletopService {
  dragAreaElement: HTMLElement = document.body;

  private batchTask: Map<any, Function> = new Map();
  private batchTaskTimer: NodeJS.Timer = null;

  private _emptyTable: GameTable = new GameTable("");
  get tableSelecter(): TableSelecter {
    return ObjectStore.instance.get<TableSelecter>("tableSelecter");
  }
  get currentTable(): GameTable {
    let table = this.tableSelecter.viewTable;
    return table ? table : this._emptyTable;
  }

  private locationMap: Map<ObjectIdentifier, LocationName> = new Map();
  private parentMap: Map<ObjectIdentifier, ObjectIdentifier> = new Map();
  private characterCache = new TabletopCache<GameCharacter>(() =>
    ObjectStore.instance
      .getObjects(GameCharacter)
      .filter(obj => obj.isVisibleOnTable)
  );
  private cardCache = new TabletopCache<Card>(() =>
    ObjectStore.instance.getObjects(Card).filter(obj => obj.isVisibleOnTable)
  );
  private cardStackCache = new TabletopCache<CardStack>(() =>
    ObjectStore.instance
      .getObjects(CardStack)
      .filter(obj => obj.isVisibleOnTable)
  );
  private tableMaskCache = new TabletopCache<GameTableMask>(() => {
    let viewTable = this.tableSelecter.viewTable;
    return viewTable ? viewTable.masks : [];
  });
  private terrainCache = new TabletopCache<Terrain>(() => {
    let viewTable = this.tableSelecter.viewTable;
    return viewTable ? viewTable.terrains : [];
  });
  private textNoteCache = new TabletopCache<TextNote>(() =>
    ObjectStore.instance.getObjects(TextNote)
  );
  private diceSymbolCache = new TabletopCache<DiceSymbol>(() =>
    ObjectStore.instance.getObjects(DiceSymbol)
  );

  private rooperCardCache = new TabletopCache<RooperCard>(() =>
    ObjectStore.instance.getObjects(RooperCard).filter(obj => obj.isVisibleOnTable)
  );

  get characters(): GameCharacter[] {
    return this.characterCache.objects;
  }
  get cards(): Card[] {
    return this.cardCache.objects;
  }
  get rooperCards(): RooperCard[] {
    return this.rooperCardCache.objects;
  }
  get cardStacks(): CardStack[] {
    return this.cardStackCache.objects;
  }
  get tableMasks(): GameTableMask[] {
    return this.tableMaskCache.objects;
  }
  get terrains(): Terrain[] {
    return this.terrainCache.objects;
  }
  get textNotes(): TextNote[] {
    return this.textNoteCache.objects;
  }
  get diceSymbols(): DiceSymbol[] {
    return this.diceSymbolCache.objects;
  }
  get peerCursors(): PeerCursor[] {
    return ObjectStore.instance.getObjects<PeerCursor>(PeerCursor);
  }

  constructor(
    public ngZone: NgZone,
    public pointerDeviceService: PointerDeviceService
  ) {
    this.initialize();
  }

  private initialize() {
    this.refreshCacheAll();
    EventSystem.register(this)
      .on("UPDATE_GAME_OBJECT", -1000, event => {
        if (
          event.data.identifier === this.currentTable.identifier ||
          event.data.identifier === this.tableSelecter.identifier
        ) {
          this.refreshCache(GameTableMask.aliasName);
          this.refreshCache(Terrain.aliasName);
          return;
        }

        let object = ObjectStore.instance.get(event.data.identifier);
        if (!object || !(object instanceof TabletopObject)) {
          this.refreshCache(event.data.aliasName);
        } else if (this.shouldRefreshCache(object)) {
          this.refreshCache(event.data.aliasName);
          this.updateMap(object);
        }
      })
      .on("DELETE_GAME_OBJECT", -1000, event => {
        let garbage = ObjectStore.instance.get(event.data.identifier);
        if (garbage == null || garbage.aliasName.length < 1) {
          this.refreshCacheAll();
        } else {
          this.refreshCache(garbage.aliasName);
        }
      })
      .on("XML_LOADED", event => {
        let xmlElement: Element = event.data.xmlElement;
        // todo:立体地形の上にドロップした時の挙動
        let gameObject = ObjectSerializer.instance.parseXml(xmlElement);
        if (gameObject instanceof TabletopObject) {
          let pointer = this.calcTabletopLocalCoordinate();
          gameObject.location.x = pointer.x - 25;
          gameObject.location.y = pointer.y - 25;
          gameObject.posZ = pointer.z;
          this.placeToTabletop(gameObject);
          SoundEffect.play(PresetSound.piecePut);
        }
      });
  }

  addBatch(task: Function, key: any = {}) {
    this.batchTask.set(key, task);
    if (this.batchTaskTimer != null) return;
    this.execBatch();
    this.batchTaskTimer = setInterval(() => {
      if (0 < this.batchTask.size) {
        this.execBatch();
      } else {
        clearInterval(this.batchTaskTimer);
        this.batchTaskTimer = null;
      }
    }, 66);
  }

  removeBatch(key: any = {}) {
    this.batchTask.delete(key);
  }

  private execBatch() {
    this.batchTask.forEach(task => task());
    this.batchTask.clear();
  }

  private findCache(aliasName: string): TabletopCache<any> {
    switch (aliasName) {
      case GameCharacter.aliasName:
        return this.characterCache;
      case Card.aliasName:
        return this.cardCache;
      case RooperCard.aliasName:
          return this.rooperCardCache;
      case CardStack.aliasName:
        return this.cardStackCache;
      case GameTableMask.aliasName:
        return this.tableMaskCache;
      case Terrain.aliasName:
        return this.terrainCache;
      case TextNote.aliasName:
        return this.textNoteCache;
      case DiceSymbol.aliasName:
        return this.diceSymbolCache;
      default:
        return null;
    }
  }

  private refreshCache(aliasName: string) {
    let cache = this.findCache(aliasName);
    if (cache) cache.refresh();
  }

  private refreshCacheAll() {
    this.characterCache.refresh();
    this.cardCache.refresh();
    this.rooperCardCache.refresh();
    this.cardStackCache.refresh();
    this.tableMaskCache.refresh();
    this.terrainCache.refresh();
    this.textNoteCache.refresh();
    this.diceSymbolCache.refresh();

    this.clearMap();
  }

  private shouldRefreshCache(object: TabletopObject) {
    return (
      this.locationMap.get(object.identifier) !== object.location.name ||
      this.parentMap.get(object.identifier) !== object.parentId
    );
  }

  private updateMap(object: TabletopObject) {
    this.locationMap.set(object.identifier, object.location.name);
    this.parentMap.set(object.identifier, object.parentId);
  }

  private clearMap() {
    this.locationMap.clear();
    this.parentMap.clear();
  }

  private placeToTabletop(gameObject: TabletopObject) {
    switch (gameObject.aliasName) {
      case GameTableMask.aliasName:
        if (gameObject instanceof GameTableMask) gameObject.isLock = false;
      case Terrain.aliasName:
        if (gameObject instanceof Terrain) gameObject.isLocked = false;
        if (!this.tableSelecter || !this.tableSelecter.viewTable) return;
        this.tableSelecter.viewTable.appendChild(gameObject);
        break;
      default:
        gameObject.setLocation("table");
        break;
    }
  }

  calcTabletopLocalCoordinate(
    x: number = this.pointerDeviceService.pointers[0].x,
    y: number = this.pointerDeviceService.pointers[0].y,
    target: HTMLElement = this.pointerDeviceService.targetElement
  ): PointerCoordinate {
    let coordinate: PointerCoordinate = { x: x, y: y, z: 0 };
    if (target.contains(this.dragAreaElement)) {
      coordinate = PointerDeviceService.convertToLocal(
        coordinate,
        this.dragAreaElement
      );
      coordinate.z = 0;
    } else {
      coordinate = PointerDeviceService.convertLocalToLocal(
        coordinate,
        target,
        this.dragAreaElement
      );
    }
    return {
      x: coordinate.x,
      y: coordinate.y,
      z: 0 < coordinate.z ? coordinate.z : 0
    };
  }

  createGameCharacter(position: PointerCoordinate): GameCharacter {
    let character = GameCharacter.create("新しいキャラクター", 1, "");
    character.location.x = position.x - 25;
    character.location.y = position.y - 25;
    character.posZ = position.z;
    return character;
  }

  createGameTableMask(position: PointerCoordinate): GameTableMask {
    let viewTable = this.tableSelecter.viewTable;
    if (!viewTable) return;

    let tableMask = GameTableMask.create("マップマスク", 5, 5, 100);
    tableMask.location.x = position.x - 25;
    tableMask.location.y = position.y - 25;
    tableMask.posZ = position.z;

    viewTable.appendChild(tableMask);
    return tableMask;
  }

  createTerrain(position: PointerCoordinate): Terrain {
    let url: string = "./assets/images/tex.jpg";
    let image: ImageFile = ImageStorage.instance.get(url);
    if (!image) image = ImageStorage.instance.add(url);

    let viewTable = this.tableSelecter.viewTable;
    if (!viewTable) return;

    let terrain = Terrain.create(
      "地形",
      2,
      2,
      2,
      image.identifier,
      image.identifier
    );
    terrain.location.x = position.x - 50;
    terrain.location.y = position.y - 50;
    terrain.posZ = position.z;

    viewTable.appendChild(terrain);
    return terrain;
  }

  createTextNote(position: PointerCoordinate): TextNote {
    let textNote = TextNote.create(
      "共有メモ",
      "テキストを入力してください",
      5,
      4,
      3
    );
    textNote.location.x = position.x;
    textNote.location.y = position.y;
    textNote.posZ = position.z;
    return textNote;
  }

  createDiceSymbol(
    position: PointerCoordinate,
    name: string,
    diceType: DiceType,
    imagePathPrefix: string
  ): DiceSymbol {
    let diceSymbol = DiceSymbol.create(name, diceType, 1);
    let image: ImageFile = null;

    diceSymbol.faces.forEach(face => {
      let url: string = `./assets/images/dice/${imagePathPrefix}/${imagePathPrefix}[${face}].png`;
      image = ImageStorage.instance.get(url);
      if (!image) {
        image = ImageStorage.instance.add(url);
      }
      diceSymbol.imageDataElement.getFirstElementByName(face).value =
        image.identifier;
    });

    diceSymbol.location.x = position.x - 25;
    diceSymbol.location.y = position.y - 25;
    diceSymbol.posZ = position.z;
    return diceSymbol;
  }

  createTrump(position: PointerCoordinate): CardStack {
    let cardStack = CardStack.create("トランプ山札");
    cardStack.location.x = position.x - 25;
    cardStack.location.y = position.y - 25;
    cardStack.posZ = position.z;

    let back: string = "./assets/images/trump/z02.gif";
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back);
    }

    let names: string[] = ["c", "d", "h", "s"];

    for (let name of names) {
      for (let i = 1; i <= 13; i++) {
        let trump: string = name + ("00" + i).slice(-2);
        let url: string = "./assets/images/trump/" + trump + ".gif";
        if (!ImageStorage.instance.get(url)) {
          ImageStorage.instance.add(url);
        }
        let card = Card.create("カード", url, back);
        cardStack.putOnBottom(card);
      }
    }

    for (let i = 1; i <= 2; i++) {
      let trump: string = "x" + ("00" + i).slice(-2);
      let url: string = "./assets/images/trump/" + trump + ".gif";
      if (!ImageStorage.instance.get(url)) {
        ImageStorage.instance.add(url);
      }
      let card = Card.create("カード", url, back);
      cardStack.putOnBottom(card);
    }
    return cardStack;
  }

  makeDefaultTable() {
    let tableSelecter = new TableSelecter("tableSelecter");
    tableSelecter.initialize();

    let gameTable = new GameTable("gameTable");
    let testBgFile: ImageFile = null;
    let bgFileContext = ImageFile.createEmpty(
      "testTableBackgroundImage_image"
    ).toContext();
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_board = `${prefix_path_rooper}/board`;
    bgFileContext.url = `${prefix_path_board}/board.png`;
    testBgFile = ImageStorage.instance.add(bgFileContext);
    //let testDistanceFile: ImageFile = null;
    //let distanceFileContext = ImageFile.createEmpty('testTableDistanceviewImage_image').toContext();
    //distanceFileContext.url = './assets/images/BG00a1_80.jpg';
    //testDistanceFile = ImageStorage.instance.add(distanceFileContext);
    gameTable.name = "最初のテーブル";
    gameTable.imageIdentifier = testBgFile.identifier;
    //gameTable.backgroundImageIdentifier = testDistanceFile.identifier;
    gameTable.width = 32;
    gameTable.height = 20;
    gameTable.initialize();

    tableSelecter.viewTableIdentifier = gameTable.identifier;
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
      // {name:'男子学生', card_num:'01', x: (board_right_edge_x), y:(board_under_y + bord_chip_margin)},
      // {name:'女子学生', card_num:'02', x: (board_right_edge_x + card_width), y:(board_under_y + bord_chip_margin)},
      // {name:'お嬢様', card_num:'03', x: (board_right_edge_x + card_width*2), y:(board_under_y + bord_chip_margin)},
      {name:'巫女', card_num:'04', x: (board_right_edge_x), y:(board_top_y + bord_chip_margin)},
      // {name:'刑事', card_num:'05', x: (board_left_edge_x), y:(board_under_y + bord_chip_margin)},
      // {name:'サラリーマン', card_num:'06', x: (board_left_edge_x + card_width * 1), y:(board_under_y + bord_chip_margin)},
      // {name:'情報屋', card_num:'07', x: (board_left_edge_x + card_width * 2), y:(board_under_y + bord_chip_margin)},
      // {name:'医者', card_num:'08', x: (board_left_edge_x + card_width), y:(board_top_y + bord_chip_margin)},
      // {name:'患者', card_num:'09', x: (board_left_edge_x), y:(board_top_y + bord_chip_margin)},
    ].forEach(({name,card_num,x,y})=>{
      const card_back = `${prefix_path_characters}/character_${card_num}_0.png`;
      if (!ImageStorage.instance.get(card_back)) {
        ImageStorage.instance.add(card_back);
      }
      const card_front = `${prefix_path_characters}/character_${card_num}_1.png`;
      if (!ImageStorage.instance.get(card_front)) {
        ImageStorage.instance.add(card_front);
      }
      const testCard = RooperCard.create(name, card_front, card_back, 3, `sample_rooper_card_${card_num}`);  
      testCard.location.x = x;
      testCard.location.y = y;
    });

    // 手札初期表示
    this.createRooperScripterHands({x:800,y:300, z: 0}, '脚本家手札','a_writer_cards', 'sample_hand_s');
    this.createRooperProtagonistHands({x:600,y:500, z: 0}, '主人公A手札','a_heroA_cards', 'sample_hand_a');
    this.createRooperProtagonistHands({x:800,y:500, z: 0}, '主人公B手札','a_heroB_cards', 'sample_hand_b');
    this.createRooperProtagonistHands({x:1000,y:500, z: 0}, '主人公C手札','a_heroC_cards', 'sample_hand_c');
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
    return;
    // 初期表示なしにカスタマイズ
    testCharacter = new GameCharacter("testCharacter_1");
    fileContext = ImageFile.createEmpty("testCharacter_1_image").toContext();
    fileContext.url = "./assets/images/mon_052.gif";
    testFile = ImageStorage.instance.add(fileContext);
    testCharacter.location.x = 5 * 50;
    testCharacter.location.y = 9 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement(
      "モンスターA",
      1,
      testFile.identifier
    );

    testCharacter = new GameCharacter("testCharacter_2");
    testCharacter.location.x = 8 * 50;
    testCharacter.location.y = 8 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement(
      "モンスターB",
      1,
      testFile.identifier
    );

    testCharacter = new GameCharacter("testCharacter_3");
    fileContext = ImageFile.createEmpty("testCharacter_3_image").toContext();
    fileContext.url = "./assets/images/mon_128.gif";
    testFile = ImageStorage.instance.add(fileContext);
    testCharacter.location.x = 4 * 50;
    testCharacter.location.y = 2 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement(
      "モンスターC",
      3,
      testFile.identifier
    );

    testCharacter = new GameCharacter("testCharacter_4");
    fileContext = ImageFile.createEmpty("testCharacter_4_image").toContext();
    fileContext.url = "./assets/images/mon_150.gif";
    testFile = ImageStorage.instance.add(fileContext);
    testCharacter.location.x = 6 * 50;
    testCharacter.location.y = 11 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement(
      "キャラクターA",
      1,
      testFile.identifier
    );

    testCharacter = new GameCharacter("testCharacter_5");
    fileContext = ImageFile.createEmpty("testCharacter_5_image").toContext();
    fileContext.url = "./assets/images/mon_211.gif";
    testFile = ImageStorage.instance.add(fileContext);
    testCharacter.location.x = 12 * 50;
    testCharacter.location.y = 12 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement(
      "キャラクターB",
      1,
      testFile.identifier
    );

    testCharacter = new GameCharacter("testCharacter_6");
    fileContext = ImageFile.createEmpty("testCharacter_6_image").toContext();
    fileContext.url = "./assets/images/mon_135.gif";
    testFile = ImageStorage.instance.add(fileContext);
    testCharacter.initialize();
    testCharacter.location.x = 5 * 50;
    testCharacter.location.y = 13 * 50;
    testCharacter.createTestGameDataElement(
      "キャラクターC",
      1,
      testFile.identifier
    );
  }

  getContextMenuActionsForCreateObject(
    position: PointerCoordinate
  ): ContextMenuAction[] {
    return [
      // this.getCreateRooperMenu(position),
      ...this.getCreateRooperSubMenu(position),
      {
        name: "separator",
        action: null,
        type: ContextMenuType.SEPARATOR
      },
      {
        name: "udonarium",
        action: null,
        subActions:[
          this.getCreateCharacterMenu(position),
          this.getCreateTableMaskMenu(position),
          this.getCreateTerrainMenu(position),
          this.getCreateTextNoteMenu(position),
          this.getCreateTrumpMenu(position),
          this.getCreateDiceSymbolMenu(position),
        ]
      }
    ];
  }

  private getCreateCharacterMenu(
    position: PointerCoordinate
  ): ContextMenuAction {
    return {
      name: "キャラクターを作成",
      action: () => {
        let character = this.createGameCharacter(position);
        EventSystem.trigger("SELECT_TABLETOP_OBJECT", {
          identifier: character.identifier,
          className: character.aliasName
        });
        SoundEffect.play(PresetSound.piecePut);
      }
    };
  }

  private getCreateTableMaskMenu(
    position: PointerCoordinate
  ): ContextMenuAction {
    return {
      name: "マップマスクを作成",
      action: () => {
        this.createGameTableMask(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    };
  }

  private getCreateTerrainMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: "地形を作成",
      action: () => {
        this.createTerrain(position);
        SoundEffect.play(PresetSound.blockPut);
      }
    };
  }

  private getCreateTextNoteMenu(
    position: PointerCoordinate
  ): ContextMenuAction {
    return {
      name: "共有メモを作成",
      action: () => {
        this.createTextNote(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    };
  }

  private getCreateTrumpMenu(position: PointerCoordinate): ContextMenuAction {
    return {
      name: "トランプの山札を作成",
      action: () => {
        this.createTrump(position);
        SoundEffect.play(PresetSound.cardPut);
      }
    };
  }
  private getCreateDiceSymbolMenu(
    position: PointerCoordinate
  ): ContextMenuAction {
    let dices: {
      menuName: string;
      diceName: string;
      type: DiceType;
      imagePathPrefix: string;
    }[] = [
      {
        menuName: "D4",
        diceName: "D4",
        type: DiceType.D4,
        imagePathPrefix: "4_dice"
      },
      {
        menuName: "D6",
        diceName: "D6",
        type: DiceType.D6,
        imagePathPrefix: "6_dice"
      },
      {
        menuName: "D8",
        diceName: "D8",
        type: DiceType.D8,
        imagePathPrefix: "8_dice"
      },
      {
        menuName: "D10",
        diceName: "D10",
        type: DiceType.D10,
        imagePathPrefix: "10_dice"
      },
      {
        menuName: "D10 (00-90)",
        diceName: "D10",
        type: DiceType.D10_10TIMES,
        imagePathPrefix: "100_dice"
      },
      {
        menuName: "D12",
        diceName: "D12",
        type: DiceType.D12,
        imagePathPrefix: "12_dice"
      },
      {
        menuName: "D20",
        diceName: "D20",
        type: DiceType.D20,
        imagePathPrefix: "20_dice"
      }
    ];
    let subMenus: ContextMenuAction[] = [];

    dices.forEach(item => {
      subMenus.push({
        name: item.menuName,
        action: () => {
          this.createDiceSymbol(
            position,
            item.diceName,
            item.type,
            item.imagePathPrefix
          );
          SoundEffect.play(PresetSound.dicePut);
        }
      });
    });
    return { name: "ダイスを作成", action: null, subActions: subMenus };
  }
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
      const card = Card.create(name, url, back);
      cardStack.putOnBottom(card);
    });
    return cardStack;
  }

  private getCreateRooperSubSubMenu(position: PointerCoordinate) : ContextMenuAction[] {
    const subMenus: ContextMenuAction[] = [];
    const prefix_path_rooper = './assets/images/tragedy_commons_5th';
    const prefix_path_characters = `${prefix_path_rooper}/chara_cards`;
    const characters = [
      {name:'男子学生', card_num:'01', },
      {name:'女子学生', card_num:'02', },
      {name:'お嬢様', card_num:'03', },
      {name:'巫女', card_num:'04', },
      {name:'刑事', card_num:'05', },
      {name:'サラリーマン', card_num:'06',},
      {name:'情報屋', card_num:'07', },
      {name:'医者', card_num:'08', },
      {name:'患者', card_num:'09', },
      {name:'委員長', card_num:'10', },
      {name:'イレギュラー', card_num:'11', },
      {name:'異世界人', card_num:'12', },
      {name:'神格', card_num:'13', },
      {name:'アイドル', card_num:'14', },
      {name:'マスコミ', card_num:'15', },
      {name:'大物', card_num:'16', },
      {name:'ナース', card_num:'17', },
      {name:'手先', card_num:'18', },
      {name:'学者', card_num:'19', },
      {name:'幻想', card_num:'20', },
      {name:'鑑識官', card_num:'21', },
      {name:'A.I.', card_num:'22', },
      {name:'先生', card_num:'23', },
      {name:'転校生', card_num:'24', },
      {name:'軍人', card_num:'25', },
      {name:'黒猫', card_num:'26', },
      {name:'女の子', card_num:'27', },
    ];

    subMenus.push({
      name: "キャラクター一覧",
      action: () => {
        const cardStack = CardStack.create("キャラクター一覧");
        cardStack.location.x = position.x - 25;
        cardStack.location.y = position.y - 25;
        cardStack.posZ = position.z;
        characters.forEach(({name,card_num,})=>{
          const card_back = `${prefix_path_characters}/character_${card_num}_0.png`;
          if (!ImageStorage.instance.get(card_back)) {
            ImageStorage.instance.add(card_back);
          }
          const card_front = `${prefix_path_characters}/character_${card_num}_1.png`;
          if (!ImageStorage.instance.get(card_front)) {
            ImageStorage.instance.add(card_front);
          }
          const testCard = RooperCard.create(name, card_front, card_back, 3);  
          cardStack.putOnBottom(testCard);
        });

        SoundEffect.play(PresetSound.cardPut);
      }
    });
    characters.forEach(({name,card_num,})=>{
      subMenus.push({
        name,
        action: () => {
          const card_back = `${prefix_path_characters}/character_${card_num}_0.png`;
          if (!ImageStorage.instance.get(card_back)) {
            ImageStorage.instance.add(card_back);
          }
          const card_front = `${prefix_path_characters}/character_${card_num}_1.png`;
          if (!ImageStorage.instance.get(card_front)) {
            ImageStorage.instance.add(card_front);
          }
          const testCard = RooperCard.create(name, card_front, card_back);
          testCard.location.x= position.x - 25;
          testCard.location.y = position.y - 25;
  
          SoundEffect.play(PresetSound.cardPut);
        }
      });
    });

    return subMenus;
  }
}

class TabletopCache<T extends TabletopObject> {
  private needsRefresh: boolean = true;

  private _objects: T[] = [];
  get objects(): T[] {
    if (this.needsRefresh) {
      this._objects = this.refreshCollector();
      this._objects = this._objects ? this._objects : [];
      this.needsRefresh = false;
    }
    return this._objects;
  }

  constructor(readonly refreshCollector: () => T[]) {}

  refresh() {
    this.needsRefresh = true;
  }
}
