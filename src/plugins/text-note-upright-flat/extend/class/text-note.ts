import { SyncVar } from "@udonarium/core/synchronize-object/decorator";
import { pluginConfig } from "src/plugins/config";

export const addSyncIsUpright = (that:any) => {
  if(!pluginConfig.isTextNoteSelectableUprightFlat) return;
  SyncVar()(that, 'isUpright');
  that.isUpright = true;
}
