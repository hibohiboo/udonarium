/**
 * 設定画面のルーティング判定
 */
export function isSettingsRoute(): boolean {
  return window.location.pathname.startsWith('/settings');
}
