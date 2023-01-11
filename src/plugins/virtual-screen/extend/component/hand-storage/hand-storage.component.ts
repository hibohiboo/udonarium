import { PeerCursor } from "@udonarium/peer-cursor"
import { PresetSound, SoundEffect } from "@udonarium/sound-effect"
import { ContextMenuSeparator } from "service/context-menu.service"
import { pluginConfig } from "src/plugins/config"

export const virtualScreenHandStorageContextMenu = (that:any) => pluginConfig.isUseVirtualScreen ? [

  getMenu(that),
  ContextMenuSeparator,
] : []


const getMenu = (that:any) => {
if(!that.isVirtualScreen) {
  return {
    name: '☐ ついたてモード', action: () => {
      that.isVirtualScreen = true;
      that.virtualScreenUserName = PeerCursor.myCursor.name;
      SoundEffect.play(PresetSound.piecePut);
    }
  }
}
return {
  name: '☑ ついたてモード', action: () => {
    that.isVirtualScreen = false;
    that.virtualScreenUserName = '';
    SoundEffect.play(PresetSound.piecePut);
  }
}
}
export const virtualScreenName = (that)=>{
  if(!pluginConfig.isUseVirtualScreen) return null;
  if(!that.isVirtualScreen) return null;
  return `${that.virtualScreenUserName}のついたて`
}
