import { ImageFile, ImageState } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { XmlUtil } from "@udonarium/core/system/util/xml-util";
import { ImageTagList } from "./class/image-tag-list";
import { MimeType } from '@udonarium/core/file-storage/mime-type';
import { GameObject } from "@udonarium/core/synchronize-object/game-object";
import * as Beautify from 'vkbeautify';

const searchImageFiles = (xml: string): ImageFile[] => {
  const xmlElement: Element = XmlUtil.xml2element(xml);
  if (!xmlElement) return [];

  const images: { [identifier: string]: ImageFile } = {};
  let imageElements = xmlElement.ownerDocument.querySelectorAll('*[type="image"]');

  for (let i = 0; i < imageElements.length; i++) {
    const identifier = imageElements[i].innerHTML;
    images[identifier] = ImageStorage.instance.get(identifier);
  }

  imageElements = xmlElement.ownerDocument.querySelectorAll('*[imageIdentifier], *[backgroundImageIdentifier]');

  for (let i = 0; i < imageElements.length; i++) {
    const identifier = imageElements[i].getAttribute('imageIdentifier');
    if (identifier) images[identifier] = ImageStorage.instance.get(identifier);

    const backgroundImageIdentifier = imageElements[i].getAttribute('backgroundImageIdentifier');
    if (backgroundImageIdentifier) images[backgroundImageIdentifier] = ImageStorage.instance.get(backgroundImageIdentifier);
  }

  const files: ImageFile[] = [];
  for (let identifier in images) {
    if (images[identifier]) {
      files.push(images[identifier]);
    }
  }
  return files;
}
const convertToXml = (gameObject: GameObject): string => {
  let xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
  return xmlDeclaration + '\n' + Beautify.xml(gameObject.toXml(), 2);
}
const createFiles = (files:File[], images: ImageFile[])=>{
  for (const image of images) {
    if (image.state === ImageState.COMPLETE) {
      files.push(new File([image.blob], image.identifier + '.' + MimeType.extension(image.blob.type), { type: image.blob.type }));
    }
  }

  let imageTagXml = convertToXml(ImageTagList.create(images));
  files.push(new File([imageTagXml], 'imagetag.xml', { type: 'text/plain' }));
  return files;
}

export default {
  saveDataSaveRoomHook(files: File[], roomXml:string, chatXml: string) {
    let images: ImageFile[] = [];
    images = images.concat(searchImageFiles(roomXml));
    images = images.concat(searchImageFiles(chatXml));

    return createFiles(files, images);
  },
  saveDataSaveGameObjectHook(files: File[], xml: string){
    let images: ImageFile[] = [];
    images = images.concat(this.searchImageFiles(xml));
    return createFiles(files, images);
  }
}
