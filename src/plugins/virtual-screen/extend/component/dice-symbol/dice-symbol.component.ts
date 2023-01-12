import { PeerCursor } from "@udonarium/peer-cursor"
import { DiceSymbolComponent } from "component/dice-symbol/dice-symbol.component";
import { pluginConfig } from "src/plugins/config";
import { addVirtualScreen, deleteVirtualScreen, dispatchTabletopObjectDropEvent } from "src/plugins/virtual-screen/domain/virtualScreen";

export const hideVirtualScreenDiceSymbol = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;


  return that.diceSymbol.isHideVirtualScreen && that.diceSymbol.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenDiceSymbol = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    DiceSymbolComponent.prototype.addVirtualScreen = function() {
      addVirtualScreen(this.diceSymbol);
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    DiceSymbolComponent.prototype.deleteVirtualScreen = function() {
      deleteVirtualScreen(this.diceSymbol);
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    DiceSymbolComponent.prototype.isHideVirtualScreen = function() {
      return this.diceSymbol.isHideVirtualScreen;
    }
  }
}
export const onMovedVirtualScreenDiceSymbol = (that) =>{
  if(!pluginConfig.isUseVirtualScreen) return;
  const prop = 'diceSymbol';
  if(that[prop].isHideVirtualScreen) {
    that.deleteVirtualScreen();
  }
  that.ngZone.run(() => dispatchTabletopObjectDropEvent(that, prop));
}
