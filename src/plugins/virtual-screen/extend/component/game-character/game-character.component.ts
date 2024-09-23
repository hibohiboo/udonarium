import { PeerCursor } from "@udonarium/peer-cursor"
import { GameCharacterComponent } from "component/game-character/game-character.component";
import { pluginConfig } from "src/plugins/config";
import { addVirtualScreen, deleteVirtualScreen, dispatchTabletopObjectDropEvent } from "src/plugins/virtual-screen/domain/virtualScreen";

export const hideVirtualScreenCharacter = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;

  return that.gameCharacter.isHideVirtualScreen && that.gameCharacter.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenCharacter = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.addVirtualScreen = function() {
      addVirtualScreen(this.gameCharacter)
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.deleteVirtualScreen = function() {
      deleteVirtualScreen(this.gameCharacter)
     }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.isHideVirtualScreen = function() {
      return this.gameCharacter.isHideVirtualScreen;
    }
  }
}
export const onMovedVirtualScreenGameCharacter = (that) =>{
  if(!pluginConfig.isUseVirtualScreen) return;
  const prop = 'gameCharacter';
  if(that[prop].isHideVirtualScreen) {
    that.deleteVirtualScreen();
  }
  that.ngZone.run(() => dispatchTabletopObjectDropEvent(that, prop));
}
