import { Listener } from '@udonarium/core/system'
import { PresetSound, SoundEffect } from '@udonarium/sound-effect'

export default {
  diceSymbolComponentInitHook: (that, listener: Listener) => {
    listener.on('DICE_ALL_OPEN', -1000, (event) => {
      if (that.owner && !that.isLock) {
        that.owner = ''
        SoundEffect.play(PresetSound.unlock)
      }
    })
  },
}
