import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config"
import { getDeckMenu } from "src/plugins/deck-from-spreadsheet/deck-from-spreadsheet";

export const onContextMenuDeckFromSpreadSheet = async (that, position) => {
  if (!pluginConfig.isDeckFromSpreadsheet) return [];
  const menu = await getDeckMenu(position);
  if(!menu) return [];

  return [ContextMenuSeparator, menu];
}
