
import { Network } from "@udonarium/core/system";
import { PeerCursor } from "@udonarium/peer-cursor";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";
import { extendCloneRotateOffCard } from "src/plugins/object-rotate-off/extends/components/card/card.component";
import { keyboardShortCutRotateOffFactory } from "src/plugins/object-rotate-off/extends/domain/object-rotate-off";
const menuKey = 'm'

const keyboardShortCutRotateOff = keyboardShortCutRotateOffFactory('card')

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
      extendCloneRotateOffCard(that.card, cloneObject)
      cloneObject.toTopmost();
      SoundEffect.play(PresetSound.cardPut);
      return true
    } else  if (e.key === 's') {
      SoundEffect.play(PresetSound.cardDraw);
      that.card.faceDown();
      that.owner = Network.peer.userId;
    } else if (e.key === 'q') {
      that.showDetail(that.card)
      return true
    } else if (e.key === 'r') {
      that.card.faceDown();
      SoundEffect.play(PresetSound.cardDraw);
      return true
    } else if (e.key === 'd') {
      that.card.destroy()
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === 'h') {
      if(!pluginConfig.canReturnHandToIndividualBoard) return;
      SoundEffect.play(PresetSound.cardDraw);
      if (that.card.handOwner) {
        that.card.handOwner = '';
        return;
      }
      that.card.handOwner = PeerCursor.myCursor.userId;
    } else if (e.key === 'a') {
      keyboardShortCutRotateOff(that);
      return;
    }
};

export const initKeyboardShortcutCard = (that) => {
  that.tabIndex = "0"; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
}
