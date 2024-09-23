import { Injectable } from '@angular/core';
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem } from '@udonarium/core/system';
import { TabletopObject } from '@udonarium/tabletop-object';
import { pluginConfig } from 'src/plugins/config';
import { CounterBoard } from '../class/counter-board';

@Injectable()
export class CounterBoardService {
  private counterBoardCache = new TabletopCache<CounterBoard>(() =>
    ObjectStore.instance.getObjects(CounterBoard),
  );
  get counterBoards(): CounterBoard[] {
    return this.counterBoardCache.objects;
  }
  constructor() {
    if (!pluginConfig.isAddCounterBoard) return;
    this.initialize();
  }

  private initialize() {
    this.refreshCacheAll();
    this.refreshCacheAll();
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, (event) => {
        const object = ObjectStore.instance.get(event.data.identifier);
        if (object instanceof CounterBoard) {
          this.counterBoardCache.refresh();
        }
      })
      .on('DELETE_GAME_OBJECT', -1000, (event) => {
        this.counterBoardCache.refresh();
      })
      .on('XML_LOADED', (event) => {
        const xmlElement: Element = event.data.xmlElement;
        if (xmlElement?.firstChild?.nodeName !== 'counter-board') return;
        const gameObject = ObjectSerializer.instance.parseXml(xmlElement);
      });
  }
  private refreshCacheAll() {
    this.counterBoardCache.refresh();
  }
}

class TabletopCache<T extends TabletopObject> {
  private needsRefresh = true;

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
