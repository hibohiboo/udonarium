import { pluginConfig } from "src/plugins/config";

let key = '';
let sheetId = ''
export const setSpreadSheetAPIKey = (config) => {
  if (!pluginConfig.isDeckFromSpreadsheet) return;
  key = config.spreadSheet.APIKey;
  sheetId = config.spreadSheet.sheetId;
}

export const getSpreadSheetAPIKey = () => key;

export const getSheetId = () => sheetId;
