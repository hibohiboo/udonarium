import { Injectable } from '@angular/core'
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer'
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store'
import { EventSystem } from '@udonarium/core/system'
import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import { TabletopObject } from '@udonarium/tabletop-object'
import { pluginConfig } from 'src/plugins/config'
import { HandStorage } from '../class/hand-storage'

@Injectable()
export class HandStorageService {
  private handStorageCache = new TabletopCache<HandStorage>(() =>
    ObjectStore.instance.getObjects(HandStorage),
  )
  get handStorages(): HandStorage[] {
    return this.handStorageCache.objects
  }
  constructor() {
    if (!pluginConfig.isUseHandStorage) return
    this.initialize()
  }

  private initialize() {
    this.refreshCacheAll()
    const listener = EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, (event) => {
        const object = ObjectStore.instance.get(event.data.identifier)
        if (object instanceof HandStorage) {
          this.handStorageCache.refresh()
        }
      })
      .on('DELETE_GAME_OBJECT', -1000, (event) => {
        this.handStorageCache.refresh()
      })
      .on('XML_LOADED', (event) => {
        const xmlElement: Element = event.data.xmlElement
        if (xmlElement?.firstChild?.nodeName !== 'hand-storage') return
        const gameObject = ObjectSerializer.instance.parseXml(xmlElement)
        if (gameObject instanceof HandStorage) {
          SoundEffect.play(PresetSound.cardPut)
        }
      })
  }
  private refreshCacheAll() {
    this.handStorageCache.refresh()
  }
}

class TabletopCache<T extends TabletopObject> {
  private needsRefresh = true

  private _objects: T[] = []
  get objects(): T[] {
    if (this.needsRefresh) {
      this._objects = this.refreshCollector()
      this._objects = this._objects ? this._objects : []
      this.needsRefresh = false
    }
    return this._objects
  }

  constructor(readonly refreshCollector: () => T[]) {}

  refresh() {
    this.needsRefresh = true
  }
}
