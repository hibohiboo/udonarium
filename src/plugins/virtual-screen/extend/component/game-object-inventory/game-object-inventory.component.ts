import { PeerCursor } from "@udonarium/peer-cursor"
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { GameCharacterComponent } from "component/game-character/game-character.component";
import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";

interface HiddenTabletopObject {
  isHideVirtualScreen: boolean;
  hideVirtualScreenUserName: string;
}
[]

export const filterVirtualScreen = (objects: any) => {
  if(!pluginConfig.isUseVirtualScreen) return objects;
  const list = objects as HiddenTabletopObject[];
  return list.filter(item=>{
    if(!item.isHideVirtualScreen) return true;
    if(item.hideVirtualScreenUserName === PeerCursor.myCursor.name) return true;
    return false;
  })
}

export const virtualScreenTableTopObjectContextMenu = (that:any) => pluginConfig.isUseVirtualScreen ? [
  ContextMenuSeparator,
  getMenu(that)
] : []


const getMenu = (that:any) => {
if(!that.isHideVirtualScreen) {
  return {
    name: 'ついたてに隠す', action: () => {
      that.isHideVirtualScreen = true;
      that.hideVirtualScreenUserName = PeerCursor.myCursor.name;
      SoundEffect.play(PresetSound.piecePut);

    }
  }
}
return {
  name: 'ついたてから出す', action: () => {
    that.isHideVirtualScreen = false;
    that.hideVirtualScreenUserName = '';
    SoundEffect.play(PresetSound.piecePut);
  }
}
}
