import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";


export const rotateOffContextMenuCard = (that:any) => pluginConfig.isOffObjectRotateIndividually ? [
  ContextMenuSeparator,
  getOffMenu(that)
] : []


const getOffMenu = (that:any) => {
if(!that.card.isRotateOffIndividually) {
  return {
    name: '回転させない', action: () => {
      that.card.isRotateOffIndividually = true;
      SoundEffect.play(PresetSound.piecePut);
    }
  }
}
return {
  name: '回転オン', action: () => {
    that.card.isRotateOffIndividually = false;
    SoundEffect.play(PresetSound.piecePut);
  }
}
}


export const getObjectRotateOffCard = (that) => {
  if(!pluginConfig.isOffObjectRotateIndividually) return false;
  return that.card.isRotateOffIndividually;
}

export const extendCloneRotateOffCard = (original, clone) => {
  if(!pluginConfig.isOffObjectRotateIndividually) return clone;
  clone.isRotateOffIndividually = original.isRotateOffIndividually;
  return clone;
}
