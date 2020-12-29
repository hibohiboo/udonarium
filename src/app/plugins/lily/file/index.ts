import { ImageFile, ImageState } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { XmlUtil } from "@udonarium/core/system/util/xml-util";
import { ImageTagList } from "./class/image-tag-list";
import { MimeType } from '@udonarium/core/file-storage/mime-type';
import { GameObject } from "@udonarium/core/synchronize-object/game-object";
import * as Beautify from 'vkbeautify';
import { ImageTag } from "./class/image-tag";
import { TableSelecter } from "@udonarium/table-selecter";
import { GameTable } from "@udonarium/game-table";
import { CardStack } from "@udonarium/card-stack";
import { Card } from "@udonarium/card";
import { Terrain } from "@udonarium/terrain";
import { PointerCoordinate } from "service/pointer-device.service";

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
    images = images.concat(searchImageFiles(xml));
    return createFiles(files, images);
  },
  tableTopServiceCreateTerrainHook(viewTable: GameTable, position: PointerCoordinate){
    let url: string = './assets/images/tex.jpg';
    let image: ImageFile = ImageStorage.instance.get(url)

    if (!image) {
      image = ImageStorage.instance.add(url);
      ImageTag.create(image.identifier).tag = 'default 地形';
    }
    if (!viewTable) return;

    let terrain = Terrain.create('地形', 2, 2, 2, image.identifier, image.identifier);
    terrain.location.x = position.x - 50;
    terrain.location.y = position.y - 50;
    terrain.posZ = position.z;

    viewTable.appendChild(terrain);
    return terrain;
  },
  tabletopServiceMakeDefaultTable(){
    let tableSelecter = new TableSelecter('tableSelecter');
    tableSelecter.initialize();

    let gameTable = new GameTable('gameTable');
    let testBgFile: ImageFile = null;
    let bgFileContext = ImageFile.createEmpty('testTableBackgroundImage_image').toContext();
    bgFileContext.url = './assets/images/BG10a_80.jpg';
    testBgFile = ImageStorage.instance.add(bgFileContext);

    //本家PR #92より
    ImageTag.create(testBgFile.identifier).tag = '背景';

    gameTable.name = '最初のテーブル';
    gameTable.imageIdentifier = testBgFile.identifier;

    gameTable.width = 20;
    gameTable.height = 15;
    gameTable.initialize();

    tableSelecter.viewTableIdentifier = gameTable.identifier;
    return true;
  },
  tableTopServiceCreateTrump(position: PointerCoordinate){
    let cardStack = CardStack.create('トランプ山札');
    cardStack.location.x = position.x - 25;
    cardStack.location.y = position.y - 25;
    cardStack.posZ = position.z;

    let back: string = './assets/images/trump/z02.gif';

    if (!ImageStorage.instance.get(back)) {
      const image = ImageStorage.instance.add(back);
      ImageTag.create(image.identifier).tag = 'default トランプ';
    }
    let names: string[] = ['c', 'd', 'h', 's'];

    for (let name of names) {
      for (let i = 1; i <= 13; i++) {
        let trump: string = name + (('00' + i).slice(-2));
        let url: string = './assets/images/trump/' + trump + '.gif';
        if (!ImageStorage.instance.get(url)) {
          //本家PR #92より
          const image = ImageStorage.instance.add(url);
          ImageTag.create(image.identifier).tag = 'default トランプ';
        }
        let card = Card.create('カード', url, back);
        cardStack.putOnBottom(card);
      }
    }

    for (let i = 1; i <= 2; i++) {
      let trump: string = 'x' + (('00' + i).slice(-2));
      let url: string = './assets/images/trump/' + trump + '.gif';
      if (!ImageStorage.instance.get(url)) {
        const image = ImageStorage.instance.add(url);
        ImageTag.create(image.identifier).tag = 'default トランプ';
      }
      let card = Card.create('カード', url, back);
      cardStack.putOnBottom(card);
    }
    return cardStack;
  }
}
