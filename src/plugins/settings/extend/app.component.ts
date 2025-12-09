/**
 * 設定画面のクエリパラメータ判定
 * ?mode=settings が指定されている場合に設定画面を表示
 */
export function isSettingsRoute(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'settings';
}
