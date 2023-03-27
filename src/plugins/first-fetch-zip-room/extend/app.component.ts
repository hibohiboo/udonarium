import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";
import { configParam, pluginConfig } from "src/plugins/config";
import { FileArchiverEx } from "../class/core/file-storage/file-archiver";

const getZipName = ()=>{
  if(configParam.firstFetchZipRoom) return configParam.firstFetchZipRoom;
  if(pluginConfig.isAddCounterBoard) return 'number_table';
  return 'rooper';
}

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom && !pluginConfig.isAddCounterBoard) return;
  const zipName = getZipName()
  setTimeout(async () => {
    const res = await fetch(`./assets/rooms/${zipName}.zip`);
    const blob = await res.blob();
    FileArchiverEx.instance.load([new File([blob], '')]);
  }, 0);
}
