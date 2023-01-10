import { PeerCursor } from "@udonarium/peer-cursor"
import { GameCharacterComponent } from "component/game-character/game-character.component";
import { pluginConfig } from "src/plugins/config";

export const hideVirtualScreenCharacter = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;

  return that.gameCharacter.isHideVirtualScreen && that.gameCharacter.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenCharacter = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.addVirtualScreen = function() {
      this.gameCharacter.isHideVirtualScreen = true;
      this.gameCharacter.hideVirtualScreenUserName = PeerCursor.myCursor.name;
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.deleteVirtualScreen = function() {
      this.gameCharacter.isHideVirtualScreen = false;
      this.gameCharacter.hideVirtualScreenUserName = '';
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.isHideVirtualScreen = function() {
      return this.gameCharacter.isHideVirtualScreen;
    }
  }
}
