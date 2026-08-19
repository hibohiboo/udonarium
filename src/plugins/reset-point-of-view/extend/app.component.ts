import { EventSystem } from '@udonarium/core/system';
import { getViewPoint2d } from './component/game-table/game-table.component';

/** メニュー「視点リセット」クリック時：テーブルの視点を初期の3D斜め視点に戻す */
export const resetPointOfView = () => {
  EventSystem.trigger('RESET_POINT_OF_VIEW', null);
};

/** メニュー「2Dモードに切り替える」クリック時：テーブルを真上から見た2D表示に切り替える */
export const switchToTopView = () => {
  EventSystem.trigger('RESET_POINT_OF_VIEW', 'top');
};

export const isViewPoint2dMode = (): boolean => getViewPoint2d();
