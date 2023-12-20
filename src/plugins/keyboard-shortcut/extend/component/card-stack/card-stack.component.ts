
import { EventSystem, Network } from "@udonarium/core/system";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { cardShuffleNormalPosition } from "src/plugins/card-shuffle-normal-position/extend/component/card-stack/card-stack.component";
import { pluginConfig } from "src/plugins/config";

export const onKeyDownKeyboardShortcutCardStack = (that, e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!pluginConfig.isUseKeyboardShortcut) return;

    if (e.key === 'm') {
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
      cardShuffleNormalPosition(that);
      SoundEffect.play(PresetSound.cardShuffle);
      EventSystem.call('SHUFFLE_CARD_STACK', { identifier: that.cardStack.identifier });
      return true
    } else if (e.key === 'q') {
      that.showDetail(that.cardStack)
      return true
    } else if (e.key === 'd') {
      that.cardStack.destroy()
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === 'c') {
      let cloneObject = that.cardStack.clone();
      cloneObject.location.x += that.gridSize;
      cloneObject.location.y += that.gridSize;
      cloneObject.owner = '';
      cloneObject.toTopmost();
      SoundEffect.play(PresetSound.cardPut);
      return true
    }
};

export const initKeyboardShortcutCardStack = (that) => {
  that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}
