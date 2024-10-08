import { BlobReader, BlobWriter, ZipReader, ZipWriter } from '@zip.js/zip.js';
import { saveAs } from 'file-saver';

import { EventSystem } from '../system';
import { XmlUtil } from '../system/util/xml-util';
import { AudioStorage } from './audio-storage';
import { FileReaderUtil } from './file-reader-util';
import { ImageStorage } from './image-storage';
import { MimeType } from './mime-type';

type MetaData = { percent: number, currentFile: string };
type UpdateCallback = (metadata: MetaData) => void;

const MEGA_BYTE = 1024 * 1024;

export class FileArchiver {
  private static _instance: FileArchiver
  static get instance(): FileArchiver {
    if (!FileArchiver._instance) FileArchiver._instance = new FileArchiver();
    return FileArchiver._instance;
  }

  private maxImageSize = 2 * MEGA_BYTE;
  private maxAudioeSize = 10 * MEGA_BYTE;

  private callbackOnDragEnter;
  private callbackOnDragOver;
  private callbackOnDrop;

  private constructor() {
    console.log('FileArchiver ready...');
  }

  initialize() {
    this.destroy();
    this.addEventListeners();
  }

  private destroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.removeEventListeners();
    this.callbackOnDragEnter = (e) => this.onDragEnter(e);
    this.callbackOnDragOver = (e) => this.onDragOver(e);
    this.callbackOnDrop = (e) => this.onDrop(e);
    document.body.addEventListener('dragenter', this.callbackOnDragEnter, false);
    document.body.addEventListener('dragover', this.callbackOnDragOver, false);
    document.body.addEventListener('drop', this.callbackOnDrop, false);
  }

  private removeEventListeners() {
    document.body.removeEventListener('dragenter', this.callbackOnDragEnter, false);
    document.body.removeEventListener('dragover', this.callbackOnDragOver, false);
    document.body.removeEventListener('drop', this.callbackOnDrop, false);
    this.callbackOnDragEnter = null;
    this.callbackOnDragOver = null;
    this.callbackOnDrop = null;
  }

  private onDragEnter(event: DragEvent) {
    event.preventDefault();
  };

  private onDragOver(event: DragEvent) {
    event.preventDefault();
  };

  private onDrop(event: DragEvent) {
    event.preventDefault();

    console.log('onDrop', event.dataTransfer);
    let files = event.dataTransfer.files
    this.load(files);
  };

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
      if (xmlElement) EventSystem.trigger('XML_LOADED', { xmlElement: xmlElement });
    } catch (reason) {
      console.warn(reason);
    }
  }

  private async handleZip(file: File) {
    if (!(0 <= file.type.indexOf('application/') || file.type.length < 1)) return;

    let zipReader = new ZipReader(new BlobReader(file));
    let entries = await zipReader.getEntries();

    for (let entry of entries) {
      try {
        let blob = await entry.getData(new BlobWriter());
        console.log(entry.filename + ' 解凍...');
        await this.load([new File([blob], entry.filename, { type: MimeType.type(entry.filename) })]);
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

    let zipWriter = new ZipWriter(new BlobWriter('application/zip'), { bufferedWrite: true });

    let sumProgress = 0;
    let sumTotal = 0;
    await Promise.all(Array.from(saveFiles).map(async file => {
      let prevProgress = 0;
      sumTotal += file.size;
      zipWriter.add(file.name, new BlobReader(file), {
        async onprogress(progress, total) {
          sumProgress += progress - prevProgress;
          prevProgress = progress;
          let percent = sumProgress * 100 / sumTotal;
          updateCallback({ percent: percent, currentFile: file.name });
        }
      });
    }));

    saveAs(await zipWriter.close(), zipName + '.zip');
  }
}

function toArrayOfFileList(fileList: FileList): File[] {
  let files: File[] = [];
  let length = fileList.length;
  for (let i = 0; i < length; i++) { files.push(fileList[i]); }
  return files;
}
