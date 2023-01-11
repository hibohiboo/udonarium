import { PeerCursor } from "@udonarium/peer-cursor"
import { PresetSound, SoundEffect } from "@udonarium/sound-effect"
import { ContextMenuSeparator } from "service/context-menu.service"
import { pluginConfig } from "src/plugins/config"
import { addVirtualScreen, deleteVirtualScreen } from "src/plugins/virtual-screen/domain/virtualScreen"

export const virtualScreenHandStorageContextMenu = (that:any) => pluginConfig.isUseVirtualScreen ? [
  virtualScrrenToggleMenu(that),
  ContextMenuSeparator,
] : []


const virtualScrrenToggleMenu = (that:any) => {
  if(!that.handStorage.isVirtualScreen) {
    return {
      name: '☐ ついたてモード', action: () => {
        that.handStorage.isVirtualScreen = true;
        that.handStorage.virtualScreenUserName = PeerCursor.myCursor.name;
        SoundEffect.play(PresetSound.piecePut);
        const topOfObjects = that.calcTopOfObjects();
        hideVirtualStorage(that, topOfObjects);
      }
    }
  }
  return {
    name: '☑ ついたてモード', action: () => {
      that.handStorage.isVirtualScreen = false;
      that.handStorage.virtualScreenUserName = '';
      SoundEffect.play(PresetSound.piecePut);

      const topOfObjects = that.calcTopOfObjects();
      for (const topOfObject of topOfObjects) {
        deleteVirtualScreen(topOfObject.obj);
      }
    }
  }
}

export const hideVirtualStorage = (that:any, topOfObjects: any) =>{
  if(!pluginConfig.isUseVirtualScreen) return;
  if(!that.handStorage.isVirtualScreen) return;

  for (const topOfObject of topOfObjects) {
    addVirtualScreen(topOfObject.obj);
  }
}
export const virtualScreenName = (that)=>{
  if(!pluginConfig.isUseVirtualScreen) return null;
  if(!that.isVirtualScreen) return null;
  return `${that.virtualScreenUserName}のついたて`
}

export const onObjectDropVirtualStorage = (that, obj)=>{
  if(!pluginConfig.isUseVirtualScreen) return;
  if(!that.handStorage.isVirtualScreen) return;
  addVirtualScreen(obj);
}
