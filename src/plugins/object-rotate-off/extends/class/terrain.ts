import { pluginConfig } from "src/plugins/config";

export const initRotateOffTerrain = (that) => {
  if(!pluginConfig.isOffObjectRotateIndividually) return;
  that.isRotateOffIndividually = false;
}
