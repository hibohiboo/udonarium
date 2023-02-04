import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";
import { extendCloneRotateOffHandStorage } from "src/plugins/object-rotate-off/extends/components/hand-storage/hand-storage.component";
import { keyboardShortCutRotateOffFactory } from "src/plugins/object-rotate-off/extends/domain/object-rotate-off";

const keyboardShortCutRotateOff = keyboardShortCutRotateOffFactory('handStorage')

export const onKeyDownKeyboardShortcutHandStorage = (that, e: KeyboardEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if (!pluginConfig.isUseKeyboardShortcut) return;

  if (e.key === 'c') {
    const cloneObject = that.handStorage.clone()
    cloneObject.location.x += that.gridSize
    cloneObject.location.y += that.gridSize
    cloneObject.isLock = false
    extendCloneRotateOffHandStorage(that.handStorage, cloneObject);
    if (that.handStorage.parent) that.handStorage.parent.appendChild(cloneObject)
    SoundEffect.play(PresetSound.cardPut)
    return true
  } else if (e.key === 'q') {
    that.showDetail(that.handStorage)
    return true
  } else if (e.key === 'd') {
    that.handStorage.destroy()
    SoundEffect.play(PresetSound.sweep)
    return true
  } else if (e.key === 'f') {
    if (that.isLock) {
      that.isLock = false
      SoundEffect.play(PresetSound.unlock)
    } else {
      that.isLock = true
      SoundEffect.play(PresetSound.lock)
    }
    return true
  } else if (e.key === 'a') {
    keyboardShortCutRotateOff(that);
    return;
  }

};

export const initKeyboardShortcutHandStorage = (that) => {
that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}
