import { PeerCursor } from "@udonarium/peer-cursor"
import { CardStackComponent } from "component/card-stack/card-stack.component";
import { pluginConfig } from "src/plugins/config";

export const hideVirtualScreenCardStack = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;

  return that.cardStack.isHideVirtualScreen && that.cardStack.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenCardStack = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    CardStackComponent.prototype.addVirtualScreen = function() {
      this.cardStack.isHideVirtualScreen = true;
      this.cardStack.hideVirtualScreenUserName = PeerCursor.myCursor.name;
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    CardStackComponent.prototype.deleteVirtualScreen = function() {
      this.cardStack.isHideVirtualScreen = false;
      this.cardStack.hideVirtualScreenUserName = '';
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    CardStackComponent.prototype.isHideVirtualScreen = function() {
      return this.cardStack.isHideVirtualScreen;
    }
  }
}
