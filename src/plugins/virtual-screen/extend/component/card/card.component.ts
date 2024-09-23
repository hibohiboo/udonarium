import { PeerCursor } from "@udonarium/peer-cursor"
import { CardComponent } from "component/card/card.component";
import { pluginConfig } from "src/plugins/config";
import { addVirtualScreen, deleteVirtualScreen } from "src/plugins/virtual-screen/domain/virtualScreen";

export const hideVirtualScreenCard = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;


  return that.card.isHideVirtualScreen && that.card.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenCard = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.addVirtualScreen = function() {
      addVirtualScreen(this.card);
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.deleteVirtualScreen = function() {
      deleteVirtualScreen(this.card);
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.isHideVirtualScreen = function() {
      return this.card.isHideVirtualScreen;
    }
  }
}
export const onMovedVirtualScreen = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return;
  if(!that.card.isHideVirtualScreen) return;
  that.deleteVirtualScreen();
}
