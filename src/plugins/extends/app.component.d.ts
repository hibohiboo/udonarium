import { AppComponent as OriginalAppComponent } from 'src/app/app.component';

declare module 'src/app/app.component' {
  interface AppComponent {
    /**
     * 設定ルートかどうかを判定するプロパティ（プラグインから注入）
     */
    isSettingsRoute: boolean;
  }
}
