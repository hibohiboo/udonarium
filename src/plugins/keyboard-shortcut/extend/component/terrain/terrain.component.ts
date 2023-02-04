
import { Network } from "@udonarium/core/system";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";
import { extendCloneRotateOffTerrain } from "src/plugins/object-rotate-off/extends/components/terrain/terrain.component";
import { keyboardShortCutRotateOffFactory } from "src/plugins/object-rotate-off/extends/domain/object-rotate-off";
const menuKey = 'm'

const keyboardShortCutRotateOff = keyboardShortCutRotateOffFactory('terrain')


export const onKeyDownKeyboardShortcutTerrain = (that, e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!pluginConfig.isUseKeyboardShortcut) return;

    if (e.key === 'c') {
      const cloneObject = that.terrain.clone()
      cloneObject.location.x += that.gridSize
      cloneObject.location.y += that.gridSize
      cloneObject.isLocked = false
      extendCloneRotateOffTerrain(that.terrain, cloneObject);
      if (that.terrain.parent) that.terrain.parent.appendChild(cloneObject)
      SoundEffect.play(PresetSound.blockPut)
      return true
    } else if (e.key === 'q') {
      that.showDetail(that.terrain)
      return true
    } else if (e.key === 'd') {
      that.terrain.destroy()
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === 'f') {
      if (that.isLocked) {
        that.isLocked = false
        SoundEffect.play(PresetSound.unlock)
      } else {
        that.isLocked = true
        SoundEffect.play(PresetSound.lock)
      }
      return true
    } else if (e.key === 'a') {
      keyboardShortCutRotateOff(that);
      return;
    }

};

export const initKeyboardShortcutTerrain = (that) => {
  that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}
