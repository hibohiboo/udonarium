import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { EventSystem } from '@udonarium/core/system';
import { XmlUtil } from '@udonarium/core/system/util/xml-util';
import { AudioStorage } from '@udonarium/core/file-storage/audio-storage';
import { FileReaderUtil } from '@udonarium/core/file-storage/file-reader-util';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { MimeType } from '@udonarium/core/file-storage/mime-type';
import { ObjectSerializerEx } from '../syncronized-object/object-serializer';


type MetaData = { percent: number, currentFile: string };
type UpdateCallback = (metadata: MetaData) => void;

const MEGA_BYTE = 1024 * 1024;

export class FileArchiverEx {
  private static _instance: FileArchiverEx
  static get instance(): FileArchiverEx {
    if (!FileArchiverEx._instance) FileArchiverEx._instance = new FileArchiverEx();
    return FileArchiverEx._instance;
  }

  private maxImageSize = 2 * MEGA_BYTE;
  private maxAudioeSize = 10 * MEGA_BYTE;


  private constructor() {
    console.log('FileArchiver ready...');
  }



  async load(files: File[]): Promise<void>
  async load(files: FileList): Promise<void>
  async load(files: any): Promise<void> {
    if (!files) return;
    let loadFiles: File[] = files instanceof FileList ? toArrayOfFileList(files) : files;

    for (let file of loadFiles) {
      await this.handleImage(file);
      await this.handleAudio(file);
      await this.handleText(file);
      await this.handleZip(file);
      EventSystem.trigger('FILE_LOADED', { file: file });
    }
  }

  private async handleImage(file: File) {
    if (file.type.indexOf('image/') < 0) return;
    if (this.maxImageSize < file.size) {
      console.warn(`File size limit exceeded. -> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }
    console.log(file.name + ' type:' + file.type);
    await ImageStorage.instance.addAsync(file);
  }

  private async handleAudio(file: File) {
    if (file.type.indexOf('audio/') < 0) return;
    if (this.maxAudioeSize < file.size) {
      console.warn(`File size limit exceeded. -> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }
    console.log(file.name + ' type:' + file.type);
    await AudioStorage.instance.addAsync(file);
  }

  private async handleText(file: File): Promise<void> {
    if (file.type.indexOf('text/') < 0) return;
    console.log(file.name + ' type:' + file.type);
    try {
      let xmlElement: Element = XmlUtil.xml2element(await FileReaderUtil.readAsTextAsync(file));
      if (!xmlElement) return;

      ObjectSerializerEx.instance.parseXml(xmlElement, file.name);
      convertUrlImage(xmlElement);

    } catch (reason) {
      console.warn(reason);
    }
  }

  private async handleZip(file: File) {
    if (!(0 <= file.type.indexOf('application/') || file.type.length < 1)) return;
    let zip = new JSZip();
    try {
      zip = await zip.loadAsync(file);
    } catch (reason) {
      console.warn(reason);
      return;
    }
    let zipEntries: JSZip.JSZipObject[] = [];
    zip.forEach((relativePath, zipEntry) => zipEntries.push(zipEntry));
    for (let zipEntry of zipEntries) {
      try {
        let arraybuffer = await zipEntry.async('arraybuffer');
        console.log(zipEntry.name + ' 解凍...');
        await this.load([new File([arraybuffer], zipEntry.name, { type: MimeType.type(zipEntry.name) })]);
      } catch (reason) {
        console.warn(reason);
      }
    }
  }

  async saveAsync(files: File[], zipName: string, updateCallback?: UpdateCallback): Promise<void>
  async saveAsync(files: FileList, zipName: string, updateCallback?: UpdateCallback): Promise<void>
  async saveAsync(files: any, zipName: string, updateCallback?: UpdateCallback): Promise<void> {
    if (!files) return;
    let saveFiles: File[] = files instanceof FileList ? toArrayOfFileList(files) : files;

    let zip = new JSZip();
    for (let file of saveFiles) {
      zip.file(file.name, file);
    }

    let blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    }, updateCallback);
    saveAs(blob, zipName + '.zip');
  }
}

function toArrayOfFileList(fileList: FileList): File[] {
  let files: File[] = [];
  let length = fileList.length;
  for (let i = 0; i < length; i++) { files.push(fileList[i]); }
  return files;
}

function convertUrlImage(xmlElement: Element) {
  let urls: string[] = [];

  let imageElements = xmlElement.querySelectorAll('*[type="image"]');
  for (let i = 0; i < imageElements.length; i++) {
    let url = imageElements[i].innerHTML;
    if (!ImageStorage.instance.get(url) && 0 < MimeType.type(url).length) {
      urls.push(url);
    }
  }

  imageElements = xmlElement.querySelectorAll('*[imageIdentifier]');
  for (let i = 0; i < imageElements.length; i++) {
    let url = imageElements[i].getAttribute('imageIdentifier');
    if (!ImageStorage.instance.get(url) && 0 < MimeType.type(url).length) {
      urls.push(url);
    }
  }
  for (let url of urls) {
    ImageStorage.instance.add(url)
  }
}