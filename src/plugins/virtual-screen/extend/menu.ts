import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";

// いったん、メニューに追加はなしで手札置き場を通してのみ、ついたて機能を有効化する。
export const virtualScreenContextMenu = (that:any) =>
pluginConfig.isUseVirtualScreen ? [
    ContextMenuSeparator,
    getMenu(that)
  ] : []


const getMenu = (that:any) => {
  if(!that.isHideVirtualScreen()) {
    return {
      name: 'ついたてに隠す', action: () => {
        that.addVirtualScreen(that);
      }
    }
  }
  return {
    name: 'ついたてから出す', action: () => {
      that.deleteVirtualScreen(that);
    }
  }
}

