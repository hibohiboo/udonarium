import { SyncVar } from "@udonarium/core/synchronize-object/decorator";
import { pluginConfig } from "src/plugins/config";

export const addSyncHideVirtualScreen = (that:any)=>{
  if(!pluginConfig.isUseVirtualScreen) return;
  SyncVar()(that, 'isHideVirtualScreen');
  that.isHideVirtualScreen = false;
  SyncVar()(that, 'hideVirtualScreenUserName');
  that.hideVirtualScreenUserName = '';
}
