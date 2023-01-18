
import { EventSystem, Network } from "@udonarium/core/system";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";
const menuKey = 'm'

export const onKeyDownKeyboardShortcutCardStack = (that, e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!pluginConfig.isUseKeyboardShortcut) return;

    if (e.key === menuKey) {
      that.onContextMenu(e)
      return true
    }
    if (e.key === 't') {
      if(!pluginConfig.isTapCard) return;
      that.rotate = 90
      return true
    }
    if (e.key === 'u') {
      if(!pluginConfig.isTapCard) return;
      that.rotate = 0
      return true
    }
    if (e.key === 'r') {
      that.cardStack.faceDownAll();
      SoundEffect.play(PresetSound.cardDraw);
      return true
    }
    if (e.key === 'U') {
      that.cardStack.uprightAll();
      SoundEffect.play(PresetSound.cardDraw);
      return true
    }
    if (e.key === 'S') {
      that.cardStack.shuffle();
      SoundEffect.play(PresetSound.cardShuffle);
      EventSystem.call('SHUFFLE_CARD_STACK', { identifier: that.cardStack.identifier });
      return true
    }

};

export const initKeyboardShortcutCard = (that) => {
  that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}
