import { AppComponent as OriginalAppComponent } from 'src/app/app.component';

declare module 'src/app/app.component' {
  interface AppComponent {
    /**
     * 設定ルートかどうかを判定するプロパティ（プラグインから注入）
     */
    isSettingsRoute: boolean;
    /**
     * キーボードヘルプ（ヘルプメニュー項目）を表示するかどうか（プラグインから注入）
     * src/plugins/keyboard-help/app/app.component.ts の useHelp（isUseKeyboardShortcutと連動）
     */
    useHelp: boolean;
    /**
     * ヘルプモーダルを開くメソッド（プラグインから注入）
     */
    openHelp: () => void;
  }
}
