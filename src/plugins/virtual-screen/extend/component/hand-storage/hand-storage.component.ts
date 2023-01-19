
import { PeerCursor } from "@udonarium/peer-cursor"
import { PresetSound, SoundEffect } from "@udonarium/sound-effect"
import { ContextMenuSeparator } from "service/context-menu.service"
import { pluginConfig } from "src/plugins/config"
import { addVirtualScreen, deleteVirtualScreen } from "src/plugins/virtual-screen/domain/virtualScreen"

export const virtualScreenHandStorageContextMenu = (that:any) => pluginConfig.isUseVirtualScreen ? [
  virtualScrrenToggleMenu(that),
  myHandStorageToggleMenu(that),
  ContextMenuSeparator,
] : [
  {
    name: '自分の手札置き場にする',
    action: () => {
      that.handStorage.owner = PeerCursor.myCursor.userId;
      SoundEffect.play(PresetSound.piecePut);
    },
  },
]

const myHandStorageToggleMenu = (that:any) => {
  if(!that.handStorage.isVirtualScreen) {
    return {
      name: '自分の手札置き場にする', action: () => {
        that.handStorage.owner = PeerCursor.myCursor.userId;
        SoundEffect.play(PresetSound.piecePut);
      }
    }
  }
  return  {
    name: '自分のついたてにする',
    action: () => {
      that.handStorage.isVirtualScreen = true;
      that.handStorage.virtualScreenUserName = PeerCursor.myCursor.name;
      that.handStorage.owner = PeerCursor.myCursor.userId;
      SoundEffect.play(PresetSound.piecePut);
      const topOfObjects = that.calcTopOfObjects();
      hideVirtualStorage(that, topOfObjects);
    },
  }
}

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

export const onObjectDropVirtualStorage = (that, e)=>{
  e.stopPropagation();
  e.preventDefault();
  if(!pluginConfig.isUseVirtualScreen) return;
  if(!that.handStorage.isVirtualScreen) return;
  const obj = e.detail
  const { x, y, w, h } = that.getHandStorageArea();
  const { distanceX, distanceY } = that.getDistance(x,y,obj);
  if (that.isTopOfHandStorage(x, y, w, h, distanceX, distanceY)) {
    addVirtualScreen(obj);
  }
}
