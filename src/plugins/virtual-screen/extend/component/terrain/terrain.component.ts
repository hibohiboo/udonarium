import { PeerCursor } from "@udonarium/peer-cursor"
import { TerrainComponent } from "component/terrain/terrain.component";
import { pluginConfig } from "src/plugins/config";
import { addVirtualScreen, deleteVirtualScreen, dispatchTabletopObjectDropEvent } from "src/plugins/virtual-screen/domain/virtualScreen";

export const hideVirtualScreenTerrain = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;


  return that.terrain.isHideVirtualScreen && that.terrain.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenTerrain = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    TerrainComponent.prototype.addVirtualScreen = function() {
      addVirtualScreen(this.terrain);
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    TerrainComponent.prototype.deleteVirtualScreen = function() {
      deleteVirtualScreen(this.terrain);
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    TerrainComponent.prototype.isHideVirtualScreen = function() {
      return this.terrain.isHideVirtualScreen;
    }
  }
}
export const onMovedVirtualScreenTerrain = (that) =>{
  if(!pluginConfig.isUseVirtualScreen) return;
  const prop = 'terrain';
  if(that[prop].isHideVirtualScreen) {
    that.deleteVirtualScreen();
  }
  that.ngZone.run(() => dispatchTabletopObjectDropEvent(that, prop));
}
