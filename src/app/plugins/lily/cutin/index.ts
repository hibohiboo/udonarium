import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { CutIn } from "./class/cut-in";
import { CutInLauncher } from "./class/cut-in-launcher";
import { CutInListComponent } from "./component/cut-in-list/cut-in-list.component";
import type { GameObject } from "@udonarium/core/synchronize-object/game-object";
import type { PanelOption, PanelService } from "service/panel.service";
import type { PointerDeviceService } from "service/pointer-device.service";
import type { Listener } from "@udonarium/core/system/event/listener";
import { CutInWindowComponent } from "./component/cut-in-window/cut-in-window.component";

export default {
  panelOpenHook(option: PanelOption, childPanelService: PanelService){
    if (option.isCutIn){
      childPanelService.isCutIn = option.isCutIn;  //この方式でよいか検討のこと
    }
    if (option.cutInIdentifier){
        childPanelService.cutInIdentifier = option.cutInIdentifier;  //この方式でよいか検討のこと
    }
  },
  roomInnerXmlObjectsHook(objests: GameObject[]){
    return objests.concat(ObjectStore.instance.getObjects(CutIn));
  },
  jukeboxLauncher(){
    return ObjectStore.instance.get<CutInLauncher>('CutInLauncher');
  },
  jukeboxPlayBGMHook(cutInLauncher: CutInLauncher){
    //タグなしのBGM付きカットインはジュークボックスと同時に鳴らさないようにする
    //BGM駆動のためのインスタンスを別にしているため現状この処理で止める
    cutInLauncher.stopBlankTagCutIn();
  },
  jukeboxOpenCutInListHook(pointerDeviceService: PointerDeviceService, panelService: PanelService){
    let coordinate = pointerDeviceService.pointers[0];
    let option: PanelOption = { left: coordinate.x+25, top: coordinate.y+25, width: 650, height: 700 };
    panelService.open<CutInListComponent>(CutInListComponent, option);
  },
  appComponentConstructorHook(listener: Listener){
    let cutInLauncher = new CutInLauncher('CutInLauncher');
    cutInLauncher.initialize();

    const appComponent = listener.key;

    listener.on('START_CUT_IN', event => {
      this.startCutIn( event.data.cutIn, appComponent.panelService );
    })
    .on('STOP_CUT_IN', event => {
      if( ! event.data.cutIn ) return;
      console.log('カットインイベント_ストップ'  + event.data.cutIn.name );
    })

  },
  startCutIn( cutIn : CutIn, panelService: PanelService ){
    if( ! cutIn ) return;
    console.log( 'カットインイベント_スタート' + cutIn.name );
    let option: PanelOption = { width: 200, height: 100, left: 300 ,top: 100};
    option.title = 'カットイン : ' + cutIn.name ;

    console.log( '画面領域 w:' + window.innerWidth + ' h:'+ window.innerHeight );

    let cutin_w = cutIn.width;
    let cutin_h = cutIn.height;

    console.log( '画像サイズ w:' + cutin_w + ' h:'+ cutin_h );

    let margin_w = window.innerWidth - cutin_w ;
    let margin_h = window.innerHeight - cutin_h - 25 ;

    if( margin_w < 0 )margin_w = 0 ;
    if( margin_h < 0 )margin_h = 0 ;

    let margin_x = margin_w * cutIn.x_pos / 100;
    let margin_y = margin_h * cutIn.y_pos / 100;

    option.width = cutin_w ;
    option.height = cutin_h + 25 ;
    option.left = margin_x ;
    option.top = margin_y;
    option.isCutIn = true;
    option.cutInIdentifier = cutIn.identifier;
    console.log('paanelService', panelService)
    let component = panelService.open(CutInWindowComponent, option);
    component.cutIn = cutIn;
    component.startCutIn();
  }
}
