
import { Network } from "@udonarium/core/system";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";
const menuKey = 'm'

export const onKeyDownKeyboardShortcutCard = (that, e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!pluginConfig.isUseKeyboardShortcut) return;

    if (e.key === menuKey) {
      that.onContextMenu(e)
    } else if (e.key === 't') {
      if(!pluginConfig.isTapCard) return;
      that.rotate = 90
      return true
    } else if (e.key === 'u') {
      if(!pluginConfig.isTapCard) return;
      that.rotate = 0
      return true
    } else if (e.key === 'c') {
      const cloneObject =that.card.clone();
      cloneObject.location.x +=that.gridSize;
      cloneObject.location.y +=that.gridSize;
      cloneObject.toTopmost();
      SoundEffect.play(PresetSound.cardPut);
      return true
    } else  if (e.key === 's') {
      SoundEffect.play(PresetSound.cardDraw);
      that.card.faceDown();
      that.owner = Network.peerContext.userId;
    }

};

export const initKeyboardShortcutCard = (that) => {
  that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}