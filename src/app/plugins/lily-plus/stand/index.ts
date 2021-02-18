import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { Network } from "@udonarium/core/system";
import { DataElement } from "@udonarium/data-element";
import { GameCharacter } from "@udonarium/game-character";
import { ImageTag } from "../../lily/file/class/image-tag";

export default {
  chatInputChatMessageFactoryHook(that) {
    const text = that.text.replace('＠', '@')
    const matched = /@.+$/.exec(text);
    if (!matched) {
      that.tachieNum = 0;
      return text.replace('@', '') || ' ';
    }
    const object = ObjectStore.instance.get(that.sendFrom);
    if (!(object instanceof GameCharacter)) {
      return text;
    }
    const [matchedText] = matched
    const target = matchedText.replace('@', '')
    const images = object.imageDataElement.getElementsByType('image');
    for (let i = 0, len = images.length; i < len; i++) {
      if (images[i].currentValue === target) {
        object.selectedTachieNum = i;
        return text.replace(matchedText, '');
      }
    }
    return that.text
  },

  tabletopServiceMakeDefaultTabletopObjectsHook() {
    let testCharacter = new GameCharacter('gon1');
    let fileContext = ImageFile.createEmpty('gon1_image').toContext();
    fileContext.url = './assets/images/gon/gon1.png';
    let testFile = ImageStorage.instance.add(fileContext);
    testCharacter.location.x = 10 * 50;
    testCharacter.location.y = 5 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('ごんぎつね', 1, testFile.identifier);
    const d0 = testCharacter.imageDataElement.getFirstElementByName('imageIdentifier');
    // d0.currentValue = 'ふつう';
    // d0.name を入れると、画像が表示されなくなる。

    const d1 = DataElement.create('imageIdentifier', '', { type: 'image' });
    d1.currentValue = d1.name = 'はっ';
    const img1 = ImageStorage.instance.add('./assets/images/gon/gon2.png');
    d1.value = img1.identifier;
    testCharacter.imageDataElement.appendChild(d1);



    const d2 = DataElement.create('imageIdentifier', '', { type: 'image' });
    d2.currentValue = d2.name = 'おこ';
    d2.value = ImageStorage.instance.add('./assets/images/gon/gon3.png').identifier;
    testCharacter.imageDataElement.appendChild(d2);

    const d3 = DataElement.create('imageIdentifier', '', { type: 'image' });
    d3.currentValue = d3.name = 'あ';
    d3.value = ImageStorage.instance.add('./assets/images/gon/gon4.png').identifier;
    testCharacter.imageDataElement.appendChild(d3);

    const d4 = DataElement.create('imageIdentifier', '', { type: 'image' });
    d4.currentValue = d4.name = 'ん';
    d4.value = ImageStorage.instance.add('./assets/images/gon/gon1.png').identifier;
    testCharacter.imageDataElement.appendChild(d4);

    ImageTag.create(img1.identifier).tag = '立ち絵';
    ImageTag.create(d2.value).tag = '立ち絵';
    ImageTag.create(d3.value).tag = '立ち絵';
    ImageTag.create(testFile.identifier).tag = '立ち絵';

    testCharacter.setLocation(Network.peerId)


    fileContext = ImageFile.createEmpty('testCharacter_1_image').toContext();
    fileContext.url = './assets/images/mon_052.gif';
    testFile = ImageStorage.instance.add(fileContext);

    fileContext = ImageFile.createEmpty('testCharacter_3_image').toContext();
    fileContext.url = './assets/images/mon_128.gif';
    testFile = ImageStorage.instance.add(fileContext);

    fileContext = ImageFile.createEmpty('testCharacter_4_image').toContext();
    fileContext.url = './assets/images/mon_150.gif';
    testFile = ImageStorage.instance.add(fileContext);

    fileContext = ImageFile.createEmpty('testCharacter_5_image').toContext();
    fileContext.url = './assets/images/mon_211.gif';
    testFile = ImageStorage.instance.add(fileContext);

    fileContext = ImageFile.createEmpty('testCharacter_6_image').toContext();
    fileContext.url = './assets/images/mon_135.gif';
    testFile = ImageStorage.instance.add(fileContext);

    fileContext = ImageFile.createEmpty('testCharacter_7_image').toContext();
    fileContext.url = './assets/images/pawn/pawnBlack.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_8_image').toContext();
    fileContext.url = './assets/images/pawn/pawnBlue.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_9_image').toContext();
    fileContext.url = './assets/images/pawn/pawnGreen.png';
    testCharacter = new GameCharacter('testCharacter_9');
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';
    testCharacter.location.x = 10 * 50;
    testCharacter.location.y = 2 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('キャラクター', 1, testFile.identifier);

    fileContext = ImageFile.createEmpty('testCharacter_10_image').toContext();
    fileContext.url = './assets/images/pawn/pawnLightBlue.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_11_image').toContext();
    fileContext.url = './assets/images/pawn/pawnOrange.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_12_image').toContext();
    fileContext.url = './assets/images/pawn/pawnPink.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_13_image').toContext();
    fileContext.url = './assets/images/pawn/pawnPurple.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_14_image').toContext();
    fileContext.url = './assets/images/pawn/pawnRed.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_15_image').toContext();
    fileContext.url = './assets/images/pawn/pawnWhite.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';

    fileContext = ImageFile.createEmpty('testCharacter_16_image').toContext();
    fileContext.url = './assets/images/pawn/pawnYellow.png';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'ポーン';



    let url: string = './assets/images/tex.jpg';
    let image: ImageFile = ImageStorage.instance.get(url)
    if (!image) image = ImageStorage.instance.add(url);
    ImageTag.create(image.identifier).tag = '地形';

    return true
  }
}
