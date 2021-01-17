import { Injectable } from '@angular/core';
import { Card } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { ChatTab } from '@udonarium/chat-tab';
import { ChatTabList } from '@udonarium/chat-tab-list';
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { DiceSymbol } from '@udonarium/dice-symbol';
import { GameCharacter } from '@udonarium/game-character';
import { GameTable } from '@udonarium/game-table';
import { GameTableMask } from '@udonarium/game-table-mask';
import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { TableSelecter } from '@udonarium/table-selecter';
import { TabletopObject } from '@udonarium/tabletop-object';
import { Terrain } from '@udonarium/terrain';
import { TextNote } from '@udonarium/text-note';
import { ContextMenuAction, ContextMenuType } from './context-menu.service';
import { Cutin } from '@udonarium/cutin';
import { CutinView } from '@udonarium/cutin-view';
import {
  PointerCoordinate,
  PointerDeviceService
} from "./pointer-device.service";
import { RooperCard, rooperCharacterList, Board } from '@udonarium/rooper-card';
import { Device } from '@udonarium/device/device';

import { CoordinateService } from './coordinate.service';

type ObjectIdentifier = string;
type LocationName = string;

let first = true; // rooper-card が継承しているからか、2回initが走ってしまう。対症療法だが。。 2020.10.05

@Injectable()
export class TabletopService {
  private _emptyTable: GameTable = new GameTable('');
  dragAreaElement: HTMLElement = document.body;

  get tableSelecter(): TableSelecter { return ObjectStore.instance.get<TableSelecter>('tableSelecter'); }
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
  private cutinCache = new TabletopCache<Cutin>(() =>
    ObjectStore.instance.getObjects(Cutin)
  );
  private cutinViewCache  = new TabletopCache<CutinView>(()=>
    ObjectStore.instance.getObjects(CutinView)
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
  get cutins(): Cutin[] {
    return this.cutinCache.objects;
  }
  get cutinViews(): CutinView[] {
    return this.cutinViewCache.objects;
  }
  get diceSymbols(): DiceSymbol[] {
    return this.diceSymbolCache.objects;
  }
  get peerCursors(): PeerCursor[] {
    return ObjectStore.instance.getObjects<PeerCursor>(PeerCursor);
  }

  constructor(
    private coordinateService: CoordinateService
  ) {
    // rooperのカードのせいか、2回initが呼ばれる。2回呼ばれないとrooperのカードが動作しない。。。 2020.10.05
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
      .on('XML_LOADED', event => {
        let xmlElement: Element = event.data.xmlElement;
        // todo:立体地形の上にドロップした時の挙動
        let gameObject = ObjectSerializer.instance.parseXml(xmlElement);
        if (gameObject instanceof TabletopObject) {
          let pointer = this.coordinateService.calcTabletopLocalCoordinate();
          gameObject.location.x = pointer.x - 25;
          gameObject.location.y = pointer.y - 25;
          gameObject.posZ = pointer.z;
          this.placeToTabletop(gameObject);
          SoundEffect.play(PresetSound.piecePut);
        } else if (gameObject instanceof ChatTab) {
          ChatTabList.instance.addChatTab(gameObject);
        }
      });

      // rooperのカードが二重に登録するのを防止する対症療法 2020.10.05
      if(first){
        first = false;
        EventSystem.register(this).on("XML_LOADED", event => {
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
          } else if (gameObject instanceof ChatTab) {
            ChatTabList.instance.addChatTab(gameObject);
          }
        });
      }

      // 初期使用画像の登録
      const prefix_path_rooper = './assets/images/tragedy_commons_5th';
      const prefix_path_extra = `${prefix_path_rooper}/extra`;
      const prexix_chibi = `${prefix_path_rooper}/protagonists_mastermind`;
      const addImage = (prefix_path, path)=>{
        const back = `${prefix_path}/${path}.png`;
        if (!ImageStorage.instance.get(back)) {
          ImageStorage.instance.add(back);
        }
      }
      addImage(prefix_path_extra, 'clock');
      addImage(prefix_path_extra, 'icon');
      addImage(prefix_path_extra, 'diary');
      addImage(prexix_chibi, 'chibi_A1');
      addImage(prexix_chibi, 'chibi_A2');
      addImage(prexix_chibi, 'chibi_B1');
      addImage(prexix_chibi, 'chibi_B2');
      addImage(prexix_chibi, 'chibi_C1');
      addImage(prexix_chibi, 'chibi_C2');
      addImage(prexix_chibi, 'chibi_W');
      addImage(prexix_chibi, 'hero_A');
      addImage(prexix_chibi, 'hero_B');
      addImage(prexix_chibi, 'hero_C');
      addImage(prexix_chibi, 'writer_1');
      addImage(prexix_chibi, 'writer_2');
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
      case Cutin.aliasName:
        return this.cutinCache;
      case CutinView.aliasName:
        return this.cutinViewCache;
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
    this.cutinCache.refresh();
    this.cutinViewCache.refresh();
    this.diceSymbolCache.refresh();

    this.clearMap();
  }

  private shouldRefreshCache(object: TabletopObject): boolean {
    return this.locationMap.get(object.identifier) !== object.location.name || this.parentMap.get(object.identifier) !== object.parentId;
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
