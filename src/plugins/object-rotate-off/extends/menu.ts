import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";

// TODO: ダイス、カード、デッキはcomponentsフォルダに作成せず、直接 import している。 どちらかに統一したい。

export const rotateOffIndividuallyContextMenu = (that:any) => pluginConfig.isOffObjectRotateIndividually ? [
    ContextMenuSeparator,
    getOffMenu(that)
  ] : []


const getOffMenu = (that:any) => {
  if(!that.isRotateOffIndividually) {
    return {
      name: '回転させない', action: () => {
        that.isRotateOffIndividually = true;
        SoundEffect.play(PresetSound.piecePut);
      }
    }
  }
  return {
    name: '回転オン', action: () => {
      that.isRotateOffIndividually = false;
      SoundEffect.play(PresetSound.piecePut);
    }
  }
}
