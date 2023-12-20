import { pluginConfig } from "src/plugins/config";
import { FileArchiverEx } from "../class/core/file-storage/file-archiver";

const getZipName = ()=> {
  const params = new URL(document.URL).searchParams;
  return params.get('room');
}

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom) return;
  const zipName = getZipName()
  setTimeout(async () => {
    const res = await fetch(`./assets/rooms/${zipName}.zip`);
    const blob = await res.blob();
    FileArchiverEx.instance.load([new File([blob], '')]);
  }, 0);
}
