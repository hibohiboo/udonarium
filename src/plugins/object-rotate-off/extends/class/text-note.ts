import { SyncVar } from "@udonarium/core/synchronize-object/decorator";
import { pluginConfig } from "src/plugins/config";

export const initRotateOffTextNote = (that) => {
  if(!pluginConfig.isOffObjectRotateIndividually) return;
  SyncVar()(that, 'isRotateOffIndividually');
  that.isRotateOffIndividually = false;
}
