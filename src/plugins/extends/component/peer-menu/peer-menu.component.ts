import { pluginConfig } from 'src/plugins/config';

export const extendsPeerMenuComponent = (that: any) => {
  // isAddReloadButton プロパティをプラグインから注入（退室ボタンの表示切り替え）
  that.isAddReloadButton = pluginConfig.isAddReloadButton;

  // reload メソッドをプラグインから注入
  // （退室ボタン：ページをリロードして接続を切断し、初期状態に戻す）
  that.reload = function() {
    window.location.reload();
  };
};
