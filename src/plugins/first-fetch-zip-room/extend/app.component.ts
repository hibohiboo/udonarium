import { FileArchiver } from "@udonarium/core/file-storage/file-archiver";

export const fetchZipRoom = () => {
  setTimeout(async () => {
    const res = await fetch('./assets/rooms/rooper.zip');
    const blob = await res.blob();
    FileArchiver.instance.load([new File([blob], '')]);
  }, 0);
}
