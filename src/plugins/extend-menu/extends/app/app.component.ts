import { pluginConfig } from "src/plugins/config";

export const minimizableMenu = pluginConfig.isMinimizableMenu
export const horizonMenu = pluginConfig.isHorizonMenu;
export const hideMenu = {
    table: pluginConfig.isHideMenuTable
  , image: pluginConfig.isHideMenuImage
  , music: pluginConfig.isHideMenuMusic
  , inventory: pluginConfig.isHideMenuInventory
  , zipUpload: pluginConfig.isHideMenuZipUpload
  , save: pluginConfig.isHideMenuSave
}
export const menuCount = 2 + Object.values(hideMenu).filter(v=>!v).length
