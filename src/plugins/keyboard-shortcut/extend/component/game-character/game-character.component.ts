
import { Network } from "@udonarium/core/system";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";
const menuKey = 'm'

export const onKeyDownKeyboardShortcutGameCharacter = (that, e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!pluginConfig.isUseKeyboardShortcut) return;

    if (e.key === 'c') {
      const cloneObject = that.gameCharacter.clone()
      cloneObject.location.x += that.gridSize
      cloneObject.location.y += that.gridSize
      cloneObject.update()
      SoundEffect.play(PresetSound.piecePut)
      return true
    } else if (e.key === 'd') {
      that.gameCharacter.setLocation('graveyard')
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === 'q') {
      that.showDetail(that.gameCharacter)
      return true
    } else if (e.key === 'N') {
      that.gameCharacter.setLocation('common')
      SoundEffect.play(PresetSound.piecePut)
      return true
    } else if (e.key === 'v') {
      that.showChatPalette(that.gameCharacter)
      return true
    } else if (e.key === 'Z') {
      that.gameCharacter.setLocation(Network.peerId)
      SoundEffect.play(PresetSound.piecePut)
      return true
    }
    return false

};

export const initKeyboardShortcutGameCharacter = (that) => {
  that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}
