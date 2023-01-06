import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  public settings = [
      { label: '2Dモード', param: '2d', checked: false }
    , { label: 'ボード回転オフ', param: 'rotate-off', checked: false }
    , { label: 'メニュー最小化', param: 'mini-menu', checked: false }
    , { label: 'メニュー横並び', param: 'horizon-menu', checked: false }
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


}
