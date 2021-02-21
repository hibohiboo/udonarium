import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { Network } from "@udonarium/core/system";
import { DataElement } from "@udonarium/data-element";
import { GameCharacter } from "@udonarium/game-character";
import { ImageTag } from "../../lily/file/class/image-tag";
import config from 'src/app/plugins/config';

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

    const d1 = DataElement.create('imageIdentifier', '', { type: 'image' }, '画像1' + testCharacter.identifier);
    d1.currentValue = d1.name = 'はっ';
    const img1 = ImageStorage.instance.add('./assets/images/gon/gon2.png');
    d1.value = img1.identifier;
    testCharacter.imageDataElement.appendChild(d1);



    const d2 = DataElement.create('imageIdentifier', '', { type: 'image' }, '画像2' + testCharacter.identifier);
    d2.currentValue = d2.name = 'おこ';
    d2.value = ImageStorage.instance.add('./assets/images/gon/gon3.png').identifier;
    testCharacter.imageDataElement.appendChild(d2);

    const d3 = DataElement.create('imageIdentifier', '', { type: 'image' }, '画像3' + testCharacter.identifier);
    d3.currentValue = d3.name = '発言中';
    d3.value = ImageStorage.instance.add('./assets/images/gon/gon4.png').identifier;
    testCharacter.imageDataElement.appendChild(d3);

    const d4 = DataElement.create('imageIdentifier', '', { type: 'image' }, '画像4' + testCharacter.identifier);
    d4.currentValue = d4.name = 'ん';
    d4.value = ImageStorage.instance.add('./assets/images/gon/gon1.png').identifier;
    testCharacter.imageDataElement.appendChild(d4);

    ImageTag.create(img1.identifier).tag = '立ち絵';
    ImageTag.create(d2.value).tag = '立ち絵';
    ImageTag.create(d3.value).tag = '立ち絵';
    ImageTag.create(testFile.identifier).tag = '立ち絵';

    testCharacter.setLocation(Network.peerId)

    if (config.useSpeechStatus){
      const testCharacter2 = new GameCharacter('poni');
      const fileContext2 = ImageFile.createEmpty('poni_image').toContext();
      fileContext2.url = './assets/images/poni/bust.png';
      const testFile2 = ImageStorage.instance.add(fileContext2);
      testCharacter2.location.x = 10 * 50;
      testCharacter2.location.y = 5 * 50;
      testCharacter2.initialize();
      testCharacter2.createTestGameDataElement('ポニテ', 1, testFile2.identifier);
      const d2_0 = testCharacter2.imageDataElement.getFirstElementByName('imageIdentifier');

      const d2_1 = DataElement.create('imageIdentifier', '', { type: 'image' }, '画像1' + testCharacter2.identifier);
      d2_1.currentValue = d2_1.name = '発言中';
      d2_1.value = ImageStorage.instance.add('./assets/images/poni/face_a.png').identifier;
      testCharacter2.imageDataElement.appendChild(d2_1);

      const d2_2 = DataElement.create('imageIdentifier', '', { type: 'image' }, '画像2' + testCharacter2.identifier);
      d2_2.currentValue = d2_2.name = '発言中';
      d2_2.value = ImageStorage.instance.add('./assets/images/poni/face_n.png').identifier;
      testCharacter2.imageDataElement.appendChild(d2_2);
    }


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
