import { PeerCursor } from "@udonarium/peer-cursor"
import { GameCharacterComponent } from "component/game-character/game-character.component";
import { pluginConfig } from "src/plugins/config";

export const hideVirtualScreen = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;

  if (!that.addVirtualScreen) {
    console.log('addVirtualScreen')
    // @ts-ignore
    GameCharacterComponent.prototype.addVirtualScreen = (that: any) => {
      that.gameCharacter.isHideVirtualScreen = true;
      that.gameCharacter.hideVirtualScreenUserName = PeerCursor.myCursor.name;
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    GameCharacterComponent.prototype.deleteVirtualScreen = (that: any) => {
      that.gameCharacter.isHideVirtualScreen = false;
      that.gameCharacter.hideVirtualScreenUserName = '';
    }
  }

  return that.gameCharacter.isHideVirtualScreen && that.gameCharacter.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

