import { Component, OnInit } from "@angular/core";
import { labelsAllInOne, settings } from "src/plugins/config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  public settings = settings
  public plSettings = [
    ...this.settings
  ]
  ngOnInit() { }
  get settingLink() {
    return './?' + this.settings.filter(s => s.checked).map(s => s.param).join('&')
  }

  get plSettingLink() {
    return './?' + this.plSettings.filter(s => s.checked).map(s => s.param).join('&')
  }

   changeSetting(setting) {
    setting.checked = !setting.checked;

    if(setting.label === 'オブジェクト回転オフ(個別設定可能)' && setting.checked){
      this.settings.find(s=>s.label === 'オブジェクト回転オフ').checked = false;
    } else if (setting.label === 'オブジェクト回転オフ' && setting.checked) {
      this.settings.find(s=>s.label === 'オブジェクト回転オフ(個別設定可能)').checked = false;
    } else if (setting.label === '手札置き場（ついたて）' && setting.checked) {
      this.settings.find(s=>s.label === '手札置き場').checked = true;
    } else if (setting.label === '手札置き場' && !setting.checked) {
      this.settings.find(s=>s.label === '手札置き場（ついたて）').checked = false;
      this.settings.find(s=>s.label === '手札置き場を自分のものだけ触れるようにする').checked = false;
    } else if (setting.label === '手札置き場を自分のものだけ触れるようにする' && setting.checked){
      this.settings.find(s=>s.label === '手札置き場').checked = true;
    } else if (setting.label === '視点リセット' && setting.checked) {
      this.settings.find(s=>s.label === '2Dモード').checked = false;
    } else if (setting.label === '2Dモード' && setting.checked) {
      this.settings.find(s=>s.label === '視点リセット').checked = false;
    }
   }
   useAllInOne(){
    this.settings = this.settings.map(s=>({...s,checked: labelsAllInOne.includes(s.label)}))
   }
   useMinimum(){
    this.settings = this.settings.map(s=>({...s,checked:[
        '2Dモード','ボード回転オフ','メニュー最小化','オブジェクト回転オフ'
      , 'メニューから削除: テーブル設定'
      , 'メニューから削除: 画像'
      , 'メニューから削除: 音楽'
      , 'メニューから削除: インベントリ'
      , 'メニューから削除: ZIP読込'
      , 'メニューから削除: 保存'
      , '初期表示に接続情報を表示しない',
      , '初期表示にチャットウィンドウを表示しない'
    ].includes(s.label)}))
   }
}
