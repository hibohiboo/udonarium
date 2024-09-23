import { PeerCursor } from "@udonarium/peer-cursor"
import { CardStackComponent } from "component/card-stack/card-stack.component";
import { pluginConfig } from "src/plugins/config";
import { addVirtualScreen, deleteVirtualScreen } from "src/plugins/virtual-screen/domain/virtualScreen";

export const hideVirtualScreenCardStack = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;

  return that.cardStack.isHideVirtualScreen && that.cardStack.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenCardStack = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    CardStackComponent.prototype.addVirtualScreen = function() {
      addVirtualScreen(this.cardStack)
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    CardStackComponent.prototype.deleteVirtualScreen = function() {
    deleteVirtualScreen(this.cardStack);
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    CardStackComponent.prototype.isHideVirtualScreen = function() {
      return this.cardStack.isHideVirtualScreen;
    }
  }
}
export const onMovedVirtualScreen = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return;
  if(!that.cardStack.isHideVirtualScreen) return;
  that.deleteVirtualScreen();
}
