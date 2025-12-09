import { AppComponent as OriginalAppComponent } from './app.component';

declare module './app.component' {
  interface AppComponent {
    /**
     * 設定ルートかどうかを判定するプロパティ（プラグインから注入）
     */
    isSettingsRoute: boolean;
  }
}
