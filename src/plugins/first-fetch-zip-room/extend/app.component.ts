import { configParam, pluginConfig } from 'src/plugins/config';
import { FileArchiverEx } from '../class/core/file-storage/file-archiver';

const getZipName = () => {
  if(configParam.firstFetchZipRoom) return configParam.firstFetchZipRoom;
  if(pluginConfig.isAddCounterBoard) return 'number_table';
  const params = new URL(document.URL).searchParams;
  if (params.has('room')) return params.get('room');
  return 'rooper';
};

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom) return;
  const zipName = getZipName();
  fetchZip(`${`./assets/rooms/${zipName}`}.zip`);
};
export const fetchZip = (url: string) => {
  setTimeout(async () => {
    const res = await fetch(`${url}`, { mode: 'cors' });
    const blob = await res.blob();
    FileArchiverEx.instance.load([new File([blob], '')]);
  }, 0);
};
