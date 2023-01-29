import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { configParam, pluginConfig } from "src/plugins/config";

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom && !pluginConfig.isAddCounterBoard) return;
  const zipName = configParam.firstFetchZipRoom || pluginConfig.isAddCounterBoard ? 'number_table': 'rooper';
  setTimeout(async () => {
    const res = await fetch(`./assets/rooms/${zipName}.zip`);
    const blob = await res.blob();
    FileArchiver.instance.load([new File([blob], '')]);
  }, 0);
}
