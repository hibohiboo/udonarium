import { GameCharacter } from '@udonarium/game-character'
import { SyncObject, SyncVar } from '@udonarium/core/synchronize-object/decorator';
import { BuffPalette } from './buff-palette';
import { DataElement } from '@udonarium/data-element';
import { ChatPalette } from '@udonarium/chat-palette';
import config from 'src/app/plugins/config';

export default {
  remoteControllerHook(that){
    if (!config.useLilyBuff) return null;
    for (let child of that.children) {
      if (child instanceof BuffPalette){
        return child;
      }
    }
    return null;
  },
  addBuffDataElement(that){
    if (!config.useLilyBuff) return;
    if (!that.buffDataElement){
      that.rootDataElement.appendChild(DataElement.create('buff', '', {}, 'buff_' + that.identifier));
    }
  },
  createDataElementsHook(that){
    if (!config.useLilyBuff) return;
    if (!that.buffDataElement) that.rootDataElement.appendChild(DataElement.create('buff', '', {}, 'buff_' + that.identifier));//entyu
  },
  addExtendData(that){
    if (!config.useLilyBuff) return;
    that.addBuffDataElement();

    let istachie = that.detailDataElement.getElementsByName('立ち絵位置');
    if( istachie.length == 0 ){
      let testElement: DataElement = DataElement.create('立ち絵位置', '', {}, '立ち絵位置' + that.identifier);
      that.detailDataElement.appendChild(testElement);
      testElement.appendChild(DataElement.create('POS', 11, { 'type': 'numberResource', 'currentValue': '0' }, 'POS_' + that.identifier));
    }
    let isbuff = that.buffDataElement.getElementsByName('バフ/デバフ');
    if( isbuff.length == 0 ){
      let buffElement: DataElement = DataElement.create('バフ/デバフ', '', {}, 'バフ/デバフ' + that.identifier);
      that.buffDataElement.appendChild(buffElement);
    }
    if( that.remoteController == null){
      let controller: BuffPalette = new BuffPalette('RemotController_' + that.identifier);
      controller.setPalette(`コントローラ入力例：
マッスルベアー DB+2 3
クリティカルレイ A 18
セイクリッドウェポン 命+1攻+2 18`);
      controller.initialize();
      that.appendChild(controller);
    }
  },
  createTestGameDataElementExtendSampleHook(that,name: string, size: number, imageIdentifier: string) {
    that.createDataElements();

    let nameElement: DataElement = DataElement.create('name', name, {}, 'name_' + that.identifier);
    let sizeElement: DataElement = DataElement.create('size', size, {}, 'size_' + that.identifier);

    if (that.imageDataElement.getFirstElementByName('imageIdentifier')) {
      that.imageDataElement.getFirstElementByName('imageIdentifier').value = imageIdentifier;
    }

    that.commonDataElement.appendChild(nameElement);
    that.commonDataElement.appendChild(sizeElement);

    let testElement: DataElement = DataElement.create('情報', '', {}, '情報' + that.identifier);
    that.detailDataElement.appendChild(testElement);
    testElement.appendChild(DataElement.create('説明',
`このキャラクターはキャラクターBの補助用のコマを作るときのサンプルです。
まず、このキャラクターはキャラクターシートの設定で「テーブルインベントリ非表示」「発言をしない」のチェックが入っています。
このように設定したキャラクターは「非表示」で足元のサークルの色が青に変わり、テーブルインベントリやリリィ追加機能のカウンターリモコンに表示されなくなります。
戦闘非参加キャラを立ち絵やコマのためにテーブルに出したい場合に使用できます。
また、プロフ等の追加情報を表示するためのコマ等、発言が不要な場合、「発言をしない」のチェックを入れることでチャットタブ等のリストに表示されなくなります。
部位数が10あるモンスターの駒を出したけど頭だけ喋ればいい、等の場合に使います。このチェックをONにするとコマの上のキャラ名が白地に黒文字に変わります。
次に、ポップアップのサイズ設定です。リリィではキャラクターシートからポップアップの横幅、最大縦幅を変更可能な様に拡張しています。
これで遊ぶ仲間が許してくれれば、数千文字のプロフィールを書いても大丈夫です。\n
なお、ポップアップする項目の設定は インベントリ＞設定＞表示項目 で行います。
リリィでは説明のため初期の項目に情報をに追加しているので、情報の子項目のこの文章である「説明」と「持ち物」が表示されています。
定義されていても持っていない項目は表示されないのでこのコマからはHPや能力値を削っています。
ゲームごとに使いやすいように使ってください。
`, { 'type': 'note' }, '説明' + that.identifier));
    testElement.appendChild(DataElement.create('持ち物',
`こういった文章も見やすくなります。
アイテム1：3個　効果〇〇
アイテム2：3個　効果パーティ内一人のHPをXXする
アイテム3：3個　効果敵一人の魔法を△する
アイテム4：3個　効果A
アイテム5：3個　効果B`,
 { 'type': 'note' }, '持ち物' + that.identifier));

    let domParser: DOMParser = new DOMParser();
    let gameCharacterXMLDocument: Document = domParser.parseFromString(that.rootDataElement.toXml(), 'application/xml');

    let palette: ChatPalette = new ChatPalette('ChatPalette_' + that.identifier);
    palette.setPalette(`チャットパレット入力例：
2d6+1 ダイスロール
１ｄ２０＋{敏捷}＋｛格闘｝　{name}の格闘！
//敏捷=10+{敏捷A}
//敏捷A=10
//格闘＝１`);
    palette.initialize();
    that.appendChild(palette);
    this.addExtendData(that);
    return true;
  }
}
