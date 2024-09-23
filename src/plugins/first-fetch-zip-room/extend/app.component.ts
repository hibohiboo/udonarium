import { pluginConfig } from 'src/plugins/config';
import { FileArchiverEx } from '../class/core/file-storage/file-archiver';
import { getStorageAccountFilePath } from 'src/plugins/constants';

const getZipName = () => {
  const params = new URL(document.URL).searchParams;
  return params.get('room');
};

export const fetchZipRoom = () => {
  if (!pluginConfig.isFirstFetchZipRoom) return;
  const zipName = getZipName();
  fetchZip(`${getStorageAccountFilePath(`rooms/${zipName}`)}.zip`);
};
export const fetchZip = (url: string) => {
  setTimeout(async () => {
    const res = await fetch(`${url}`, { mode: 'cors' });
    const blob = await res.blob();
    FileArchiverEx.instance.load([new File([blob], '')]);
  }, 0);
};
