import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  public settings = [
      { label: '2Dモード', param: '2d', checked: false }
    , { label: 'ボード回転オフ', param: 'rotate-off', checked: false }
    , { label: 'オブジェクト回転オフ', param: 'object-rotate-off', checked: false }
    , { label: 'オブジェクト回転オフ(個別設定可能)', param: 'object-rotate-off-individually', checked: false }
    , { label: 'メニュー最小化', param: 'mini-menu', checked: false }
    , { label: 'メニュー横並び', param: 'horizon-menu', checked: false }
    , { label: 'メニューから削除: テーブル設定', param: 'hide-menu-table', checked: false }
    , { label: 'メニューから削除: 画像', param: 'hide-menu-image', checked: false }
    , { label: 'メニューから削除: 音楽', param: 'hide-menu-music', checked: false }
    , { label: 'メニューから削除: インベントリ', param: 'hide-menu-inventory', checked: false }
    , { label: 'メニューから削除: ZIP読込', param: 'hide-menu-zip', checked: false }
    , { label: 'メニューから削除: 保存', param: 'hide-menu-save', checked: false }
    , { label: 'ヘルプ表示', param: 'help', checked: false }
  ]
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
    }
   }
   useAllInOne(){
    this.settings = this.settings.map(s=>({...s,checked:['2Dモード','オブジェクト回転オフ(個別設定可能)','メニュー最小化','メニュー横並び','ヘルプ表示'].includes(s.label)}))
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
    ].includes(s.label)}))
   }
}
