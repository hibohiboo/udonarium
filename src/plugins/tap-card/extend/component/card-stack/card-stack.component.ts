import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";

export const tapCardStackContextMenu = (that) => {
  if(!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: '山札を横にする',
      action: ()=> that.cardStack.rotate = 90,
    },
    {
      name: '山札を縦にする',
      action: ()=> that.cardStack.rotate = 0,
    }
  ]
}
