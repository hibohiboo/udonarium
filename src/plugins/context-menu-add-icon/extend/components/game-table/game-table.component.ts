import { pluginConfig } from "src/plugins/config";
import { ContextMenuAddIcons } from "src/plugins/context-menu-add-icon/constants";

export const contextMenuAddIcon = (that, menuPosition, menuActions)=> {
  if(!pluginConfig.isContextMenuIcon) return false;
  that.contextMenuService.open(menuPosition, menuActions, ContextMenuAddIcons);
  return true;
}
