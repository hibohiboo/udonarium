import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import { HandStorage } from './class/hand-storage'

export default {
  // thatはGameTableComponent
  onContextMenuHook(position) {
    return {
      name: '手札置き場を作成',
      action: () => {
        createHandStorage(position)
        SoundEffect.play(PresetSound.blockPut)
      },
    }
  },
}

const createHandStorage = (position) => {
  // const viewTable = that.tableSelecter.viewTable;
  // if (!viewTable) return;
  // const position = that.pointerDeviceService.pointers[0]
  const handStorage = HandStorage.create('手札置き場', 5, 5, 100)
  handStorage.location.x = position.x - 25
  handStorage.location.y = position.y - 100
  handStorage.posZ = 0
  // viewTable.appendChild(handStorage);
  return handStorage
}
