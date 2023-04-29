
import { PeerCursor } from "@udonarium/peer-cursor"
import { PresetSound, SoundEffect } from "@udonarium/sound-effect"
import { ContextMenuSeparator } from "service/context-menu.service"
import { setAutoSelfViewCard } from "src/plugins/auto-self-view-mode/extend/component/hand-storage.component"
import { pluginConfig } from "src/plugins/config"
import { addVirtualScreen, deleteVirtualScreen } from "src/plugins/virtual-screen/domain/virtualScreen"

export const virtualScreenHandStorageContextMenu = (that:any) => pluginConfig.isUseVirtualScreen ? [
  virtualScrrenToggleMenu(that),
  myHandStorageToggleMenu(that),
  ContextMenuSeparator,
] : [  handStorageToggleMenu(that) ]

const myHandStorageToggleMenu = (that:any) => {
  if(!that.handStorage.isVirtualScreen) {
    return handStorageToggleMenu(that)
  }
  if (!that.handStorage.owner) {
    return  {
      name: '自分のついたてにする',
      action: () => {
        that.handStorage.isVirtualScreen = true;
        that.handStorage.virtualScreenUserName = PeerCursor.myCursor.name;
        that.handStorage.owner = PeerCursor.myCursor.userId;
        SoundEffect.play(PresetSound.piecePut);
        const topOfObjects = that.calcTopOfObjects();
        hideVirtualStorage(that, topOfObjects);
        if(pluginConfig.isHandCardSelfHandStorage) {
          that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
            card.handOwner = PeerCursor.myCursor.userId;
          })
        }
      },
    }
  }
  return  {
    name: '共用のボードにしてついたてを外す',
    action: () => {
      that.handStorage.isVirtualScreen = false;
      that.handStorage.virtualScreenUserName = '';
      that.handStorage.owner = '';
      SoundEffect.play(PresetSound.piecePut);
      const topOfObjects = that.calcTopOfObjects();
      for (const topOfObject of topOfObjects) {
        deleteVirtualScreen(topOfObject.obj);
      }
      if(pluginConfig.isHandCardSelfHandStorage) {
        that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
          card.handOwner = '';
        })
      }
    },
  }
}

const handStorageToggleMenu = (that: any)=> {

  if (!that.handStorage.owner) {
    return {
      name: '自分の個人ボードにする', action: () => {
        that.handStorage.owner = PeerCursor.myCursor.userId;
        if(pluginConfig.isHandCardSelfHandStorage) {
          that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
            card.handOwner = PeerCursor.myCursor.userId;
          })
        }
        SoundEffect.play(PresetSound.piecePut);
      }
    }
  }
  return {
    name: '共用のボードにする', action: () => {
      that.handStorage.owner = '';
      if(pluginConfig.isHandCardSelfHandStorage) {
        that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
          card.handOwner = '';
        })
      }
      SoundEffect.play(PresetSound.piecePut);
    }
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
    setAutoSelfViewCard(obj);
  }
}
