import { pluginConfig } from "src/plugins/config";

export const isEmptyDefaultTabletopObjects = pluginConfig.isFirstFetchZipRoom
export const viewPositonZDefault = ()=>{
  if(pluginConfig.isHollow) return -1000;
  return undefined;
}
