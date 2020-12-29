import { ImageContext, ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { Listener } from "@udonarium/core/system";
import { DataElement } from "@udonarium/data-element";
import { GameCharacter } from "@udonarium/game-character";
import { TabletopObject } from "@udonarium/tabletop-object";
import { ContextMenuAction } from "service/context-menu.service";
import { PanelOption, PanelService } from "service/panel.service";
import { PointerCoordinate } from "service/pointer-device.service";
import { RemoteControllerComponent } from "../controller/component/remote-controller/remote-controller.component";
import { ImageTag } from "../file/class/image-tag";
import config from 'src/app/plugins/config';

const addBuffRound = (character :GameCharacter,name:string,subcom:string,round:number) => {
  if(!character.buffDataElement.children){return}
  for (let dataElm of character.buffDataElement.children){
    dataElm.appendChild(DataElement.create(name, round , { 'type': 'numberResource', 'currentValue': subcom }, name + '_' + character.identifier ));
    return;
  }
}

export default {
  tabletopServiceInitializeHook(listener: Listener){
    listener.on('XML_LOADED', event => {
      //通常版データが投下されたときに、追加が必要な要素を追加
      let objects: TabletopObject[] = ObjectStore.instance.getObjects(GameCharacter);
      for (let gameObject of objects) {
        if (gameObject instanceof GameCharacter) {
          console.log('GameCharacter Load 追加データ確認');
          let gameCharacter:GameCharacter =  gameObject;
          gameCharacter.addExtendData();
        }
      }
    });
  },
  tabletopServiceMakeDefaultTabletopObjectsHook(){
    let testCharacter: GameCharacter = null;
    let testFile: ImageFile = null;
    let fileContext: ImageContext = null;

    //-------------------------
    testCharacter = new GameCharacter('testCharacter_1');

    fileContext = ImageFile.createEmpty('testCharacter_1_image').toContext();
    fileContext.url = './assets/images/mon_052.gif';
    testFile = ImageStorage.instance.add(fileContext);
    ImageTag.create(testFile.identifier).tag = 'モンスター';    //本家PR #92より

    testCharacter.location.x = 5 * 50;
    testCharacter.location.y = 9 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('モンスターA', 1, testFile.identifier);
    addBuffRound( testCharacter ,'テストバフ1' , '防+1' , 3);

    //-------------------------
    testCharacter = new GameCharacter('testCharacter_2');

    testCharacter.location.x = 8 * 50;
    testCharacter.location.y = 8 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('モンスターB', 1, testFile.identifier);

    //-------------------------
    testCharacter = new GameCharacter('testCharacter_3');

    fileContext = ImageFile.createEmpty('testCharacter_3_image').toContext();
    fileContext.url = './assets/images/mon_128.gif';
//本家PR #92より
//  fileContext.tag = 'テスト01';
    testFile = ImageStorage.instance.add(fileContext);

    ImageTag.create(testFile.identifier).tag = 'モンスター'; //本家PR #92より

    testCharacter.location.x = 4 * 50;
    testCharacter.location.y = 2 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('モンスターC', 3, testFile.identifier);

    //-------------------------
    testCharacter = new GameCharacter('testCharacter_4');

    fileContext = ImageFile.createEmpty('testCharacter_4_image').toContext();
    fileContext.url = './assets/images/mon_150.gif';
//本家PR #92より
//    fileContext.tag = 'テスト01';
    testFile = ImageStorage.instance.add(fileContext);

    ImageTag.create(testFile.identifier).tag = '';//本家PR #92より

    testCharacter.location.x = 6 * 50;
    testCharacter.location.y = 11 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('キャラクターA', 1, testFile.identifier);
    addBuffRound( testCharacter ,'テストバフ2' , '攻撃+10' , 1);

    //-------------------------
    testCharacter = new GameCharacter('testCharacter_5');

    fileContext = ImageFile.createEmpty('testCharacter_5_image').toContext();
    fileContext.url = './assets/images/mon_211.gif';
    testFile = ImageStorage.instance.add(fileContext);

    ImageTag.create(testFile.identifier).tag = ''; //本家PR #92より

    testCharacter.location.x = 12 * 50;
    testCharacter.location.y = 12 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElement('キャラクターB', 1, testFile.identifier);
    addBuffRound( testCharacter ,'テストバフ2' , '攻撃+10' , 1);

    testCharacter = new GameCharacter('testCharacter_5B');

    fileContext = ImageFile.createEmpty('testCharacter_5_image').toContext();
    fileContext.url = './assets/images/mon_211.gif';
    testFile = ImageStorage.instance.add(fileContext);

    ImageTag.create(testFile.identifier).tag = ''; //本家PR #92より

    testCharacter.location.x = 11 * 50;
    testCharacter.location.y = 9 * 50;
    testCharacter.initialize();
    testCharacter.createTestGameDataElementExtendSample('Bのサブコマ', 1, testFile.identifier);

    testCharacter.hideInventory = true;
    testCharacter.nonTalkFlag = true;
    testCharacter.overViewWidth = 350;
    testCharacter.overViewMaxHeight = 350;
    //-------------------------
    testCharacter = new GameCharacter('testCharacter_6');

    fileContext = ImageFile.createEmpty('testCharacter_6_image').toContext();
    fileContext.url = './assets/images/mon_135.gif';
    testFile = ImageStorage.instance.add(fileContext);

    ImageTag.create(testFile.identifier).tag = '';//本家PR #92より

    testCharacter.initialize();
    testCharacter.location.x = 5 * 50;
    testCharacter.location.y = 13 * 50;
    testCharacter.createTestGameDataElement('キャラクターC', 1, testFile.identifier);
    addBuffRound( testCharacter ,'テストバフ3' , '回避+5' , 1);
    return true;
  },
  gameObjectOnContextMenuHook(menuActions: ContextMenuAction[], panelService: PanelService, gameObject: GameCharacter, position: PointerCoordinate){
    if (gameObject.location.name !== 'graveyard') {
      menuActions.push(getRemoconMenuAction(panelService, gameObject, position));
    }
  },
  gameCharacterComponentAddContextMenu(panelService: PanelService, gameObject: GameCharacter, position: PointerCoordinate){
    if(!config.useLilyBuff) return [];
    return [getRemoconMenuAction(panelService, gameObject, position)];
  }
}
const getRemoconMenuAction = (panelService: PanelService, gameObject: GameCharacter, position: PointerCoordinate) => {
  return { name: 'リモコンを表示', action: () => { showRemoteController(panelService, gameObject, position) } };
}

const showRemoteController = (panelService: PanelService, gameObject: GameCharacter, coordinate: PointerCoordinate) => {
  let option: PanelOption = { left: coordinate.x - 250, top: coordinate.y - 175, width: 700, height: 600 };
  let component = panelService.open<RemoteControllerComponent>(RemoteControllerComponent, option);
  component.character = gameObject;
}
