import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { configParam, pluginConfig } from "src/plugins/config";

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom) return;
  const zipName = configParam.firstFetchZipRoom || 'rooper';
  setTimeout(async () => {
    const res = await fetch(`./assets/rooms/${zipName}.zip`);
    const blob = await res.blob();
    FileArchiver.instance.load([new File([blob], '')]);
  }, 0);
}
