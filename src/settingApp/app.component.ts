import { Component, OnInit } from "@angular/core";
import { labelsAllInOne, lablsMinimum, settings } from "src/plugins/config";

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
    } else if (setting.label === 'ボード（ついたて）' && setting.checked) {
      this.settings.find(s=>s.label === 'ボード').checked = true;
    } else if (setting.label === 'ボード' && !setting.checked) {
      this.settings.find(s=>s.label === 'ボード（ついたて）').checked = false;
      this.settings.find(s=>s.label === 'ボードを自分のものだけ触れるようにする').checked = false;
      this.settings.find(s=>s.label === '手札を回収する').checked = false;
    } else if (setting.label === 'ボードを自分のものだけ触れるようにする' && setting.checked){
      this.settings.find(s=>s.label === 'ボード').checked = true;
    } else if (setting.label === '視点リセット' && setting.checked) {
      this.settings.find(s=>s.label === '2Dモード').checked = false;
    } else if (setting.label === '2Dモード' && setting.checked) {
      this.settings.find(s=>s.label === '視点リセット').checked = false;
    } else if (setting.label === 'Zipから部屋情報読込' && setting.checked ) {
      this.settings.find(s=>s.label === 'サンプルのキャラクターコマを非表示').checked = true;
    } else if (setting.label === '手札を回収する' && setting.checked ) {
      this.settings.find(s=>s.label === 'ボード').checked = true;
    } else if (setting.label === 'コンテキストメニューにアイコンを付ける' && setting.checked ) {
      this.settings.find(s=>s.label === 'ボード').checked = true;
      this.settings.find(s=>s.label === 'デフォルトの地形をCubeに変更').checked = true;

    }


   }
   useAllInOne(){
    this.settings = this.settings.map(s=>({...s,checked: labelsAllInOne.includes(s.label)}))
   }
   useMinimum(){
    this.settings = this.settings.map(s=>({...s,checked: lablsMinimum.includes(s.label)}))
   }
}
