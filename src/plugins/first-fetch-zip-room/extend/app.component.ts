import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { pluginConfig } from "src/plugins/config";

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom) return;
  setTimeout(async () => {
    const res = await fetch('./assets/rooms/rooper.zip');
    const blob = await res.blob();
    FileArchiver.instance.load([new File([blob], '')]);
  }, 0);
}
