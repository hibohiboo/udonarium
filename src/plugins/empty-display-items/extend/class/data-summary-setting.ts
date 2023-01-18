import { pluginConfig } from "src/plugins/config";

export const initEmptyDisplayItems = (that) => {
  if(!pluginConfig.isEmptyDisplayItems) return;
  that.dataTag = '';
}
