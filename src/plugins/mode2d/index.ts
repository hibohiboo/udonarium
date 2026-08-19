import { pluginConfig } from '../config';
import { isViewPoint2dMode } from '../reset-point-of-view/extend/app.component';

// ?2d クエリパラメータに加え、reset-point-of-view プラグインの「2Dモードに切り替える」で
// 実行時に2D表示へ切り替えられている場合も2Dモードとして扱う
export const is2d = () => pluginConfig.is2d || isViewPoint2dMode();
export const init2d = (that: any) => {
  if (!is2d()) return;
  that.viewRotateX = 0;
  that.viewRotateZ = 0;
};
