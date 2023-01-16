import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";

export const tapCardContextMenu = (that) => {
  if(!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: 'カードを横にする',
      action: ()=> that.card.rotate = 90,
    },
    {
      name: 'カードを縦にする',
      action: ()=> that.card.rotate = 0,
    }
  ]
}
