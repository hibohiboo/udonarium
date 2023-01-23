import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";


export const rotateOffContextMenu = (that:any) => pluginConfig.isOffObjectRotateIndividually ? [
  ContextMenuSeparator,
  getOffMenu(that)
] : []


const getOffMenu = (that:any) => {
if(!that.terrain.isRotateOffIndividually) {
  return {
    name: '回転させない', action: () => {
      that.terrain.isRotateOffIndividually = true;
      SoundEffect.play(PresetSound.piecePut);
    }
  }
}
return {
  name: '回転オン', action: () => {
    that.terrain.isRotateOffIndividually = false;
    SoundEffect.play(PresetSound.piecePut);
  }
}
}


export const getObjectRotateOffTerrain = (that) => {
  if(!pluginConfig.isOffObjectRotateIndividually) return false;
  return that.terrain.isRotateOffIndividually;
}

export const extendCloneRotateOffTerrain = (original, clone) => {
  if(!pluginConfig.isOffObjectRotateIndividually) return clone;
  clone.isRotateOffIndividually = original.isRotateOffIndividually;
  return clone;
}
