import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  public settings = [
      { label: '2Dモード', param: '2d', checked: false }
    , { label: 'ボード回転オフ', param: 'rotate-off', checked: false }
  ]
  ngOnInit() { }
  get settingLink() {
    return './?' + this.settings.filter(s => s.checked).map(s => s.param).join('&')
  }

}
