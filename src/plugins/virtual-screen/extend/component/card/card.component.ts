import { PeerCursor } from "@udonarium/peer-cursor"
import { CardComponent } from "component/card/card.component";
import { pluginConfig } from "src/plugins/config";

export const hideVirtualScreenCard = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;

  if (!that.addVirtualScreen) {
    console.log('add card get')
    // @ts-ignore
    CardComponent.prototype.addVirtualScreen = (that: any) => {
      that.card.isHideVirtualScreen = true;
      that.card.hideVirtualScreenUserName = PeerCursor.myCursor.name;
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.deleteVirtualScreen = (that: any) => {
      that.card.isHideVirtualScreen = false;
      that.card.hideVirtualScreenUserName = '';
    }
  }

  return that.card.isHideVirtualScreen && that.card.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenCard = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.addVirtualScreen = function() {
      this.card.isHideVirtualScreen = true;
      this.card.hideVirtualScreenUserName = PeerCursor.myCursor.name;
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.deleteVirtualScreen = function() {
      this.card.isHideVirtualScreen = false;
      this.card.hideVirtualScreenUserName = '';
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    CardComponent.prototype.isHideVirtualScreen = function() {
      return this.card.isHideVirtualScreen;
    }
  }
}
