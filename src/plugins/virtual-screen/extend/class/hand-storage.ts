import { SyncVar } from "@udonarium/core/synchronize-object/decorator";
import { PeerCursor } from "@udonarium/peer-cursor";
import { pluginConfig } from "src/plugins/config";

export const addSyncHideVirtualScreenHandStorage = (that:any)=>{
  if(!pluginConfig.isUseVirtualScreen) return;
  SyncVar()(that, 'isVirtualScreen');
  that.isVirtualScreen = false;
  SyncVar()(that, 'virtualScreenUserName');
  that.virtualScreenUserName = '';
}