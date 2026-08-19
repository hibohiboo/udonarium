import { pluginConfig } from 'src/plugins/config';

/** 現在「視点リセット」機能によって2Dモード（真上からのフラット視点）になっているかどうか */
let viewPoint2d = false;

/**
 * RESET_POINT_OF_VIEW イベントのハンドラ（GameTableComponentから呼ばれる）。
 * event.data === 'top' の場合はテーブルを真上から見た2D表示に、
 * それ以外の場合は初期の3D斜め視点に戻す。
 */
export const resetViewHandler = (that: any, event: any) => {
  that.isTableTransformMode = false;
  that.pointerDeviceService.isDragging = false;

  that.viewRotateX = 0;
  that.viewRotateY = 0;
  that.viewPotisonX = 0;
  that.viewPotisonY = 0;
  that.viewRotateZ = 0;
  if (event?.data !== 'rotate') {
    that.viewPotisonZ = 0;
  }
  viewPoint2d = event?.data === 'top';

  // is2d()（src/plugins/mode2d）の判定条件が変わるため、appRootのCSSクラスをここで同期する。
  // mode2d側はアプリ起動時に一度だけappRootへクラスを付与する実装のため、
  // セッション中の動的な切り替えはここで直接反映する必要がある。
  const appRoot = document.querySelector('app-root');
  if (appRoot) {
    appRoot.classList.toggle('is2d', pluginConfig.is2d || viewPoint2d);
  }

  setTimeout(() => {
    if (event?.data !== 'top' && event?.data !== 'rotate') {
      that.setTransform(100, 0, 0, 50, 0, 10);
      return;
    }
    that.setTransform(0, 0, 0, 0, 0, 0);
  }, 50);
  that.removeFocus();
};

/** 「視点リセット」機能によって2Dモードに切り替えられているかどうか */
export const getViewPoint2d = (): boolean => {
  if (!pluginConfig.isUseResetPointOfView) return false;
  return viewPoint2d;
};
