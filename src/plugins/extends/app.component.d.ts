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
    /**
     * 「視点リセット」「2Dモードに切り替える」メニュー項目を表示するかどうか（プラグインから注入）
     */
    useResetPointOfView: boolean;
    /**
     * テーブルの視点を初期の3D斜め視点に戻すメソッド（プラグインから注入）
     */
    resetPointOfView: () => void;
    /**
     * テーブルを真上から見た2D表示に切り替えるメソッド（プラグインから注入）
     */
    switchToTopView: () => void;
    /**
     * 「ミュートにする」メニュー項目を表示するかどうか（現在ミュートされていない状態。プラグインから注入）
     */
    useMute: boolean;
    /**
     * 「ミュート解除」メニュー項目を表示するかどうか（現在ミュート中の状態。プラグインから注入）
     */
    useMuteOff: boolean;
    /**
     * 操作音のミュート状態を切り替えるメソッド（プラグインから注入）
     */
    toggleMute: () => void;
  }
}
