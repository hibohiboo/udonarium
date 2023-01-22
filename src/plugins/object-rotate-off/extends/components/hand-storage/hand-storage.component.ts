import { pluginConfig } from "src/plugins/config";

export const initRotateOffHandStorage = (that) =>{
  if(!pluginConfig.isOffObjectRotateIndividually) return;
  that.isRotateOffIndividually = false;
}

export const getObjectRotateOff = (that)=>{
  if(!pluginConfig.isOffObjectRotateIndividually) return false;
  return that.isRotateOffIndividually;
}
import { rotateOffIndividuallyContextMenu } from "../../menu";

export const rotateOffContextMenuHandStorage = rotateOffIndividuallyContextMenu
