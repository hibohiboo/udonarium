import {
  SyncObject,
  SyncVar,
} from '@udonarium/core/synchronize-object/decorator'
import { Network } from '@udonarium/core/system'
import { DataElement } from '@udonarium/data-element'
import { PeerCursor } from '@udonarium/peer-cursor'
import { TabletopObject } from '@udonarium/tabletop-object'

@SyncObject('hand-storage')
export class HandStorage extends TabletopObject {
  @SyncVar() isLock = false
  @SyncVar() owner = ''

  get name(): string {
    return this.getCommonValue('name', '')
  }
  get width(): number {
    return this.getCommonValue('width', 1)
  }
  get height(): number {
    return this.getCommonValue('height', 1)
  }
  get opacity(): number {
    const element = this.getElement('opacity', this.commonDataElement)
    const num = element
      ? <number>element.currentValue / <number>element.value
      : 1
    return Number.isNaN(num) ? 1 : num
  }
  get ownerName(): string {
    const object = PeerCursor.findByUserId(this.owner)
    return object ? object.name : ''
  }

  get hasOwner(): boolean {
    return 0 < this.owner.length
  }
  // start with fly
  get ownerColor(): string {
    const object = PeerCursor.findByUserId(this.owner)
    return object ? object.color : '#ff0'
  }
  // end with fly

  static create(
    name: string,
    width: number,
    height: number,
    opacity: number,
    identifier?: string,
  ): HandStorage {
    let object: HandStorage = null

    if (identifier) {
      object = new HandStorage(identifier)
    } else {
      object = new HandStorage()
    }
    object.owner = Network.peerContext.userId

    object.createDataElements()

    object.commonDataElement.appendChild(
      DataElement.create('name', name, {}, 'name_' + object.identifier),
    )
    object.commonDataElement.appendChild(
      DataElement.create('width', width, {}, 'width_' + object.identifier),
    )
    object.commonDataElement.appendChild(
      DataElement.create('height', height, {}, 'height_' + object.identifier),
    )
    object.commonDataElement.appendChild(
      DataElement.create(
        'opacity',
        opacity,
        { type: 'numberResource', currentValue: opacity },
        'opacity_' + object.identifier,
      ),
    )
    object.initialize()

    return object
  }
}
