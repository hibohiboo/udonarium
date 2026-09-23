import { pluginConfig } from 'src/plugins/config';

/** 現在「視点リセット」機能によって2Dモード（真上からのフラット視点）になっているかどうか */
let viewPoint2d = false;

/**
 * resetViewHandlerがsetTransform()を呼び出している最中かどうかを示すフラグ。
 *
 * `table-rotate-off`（isOffTableRotate）はGameTableComponent.setTransformをオーバーライドし、
 * ドラッグ操作による意図しない回転を打ち消す実装になっているが、その打ち消し処理は
 * 「ドラッグ由来の変更か、明示的な呼び出しか」を区別せず、setTransformへのあらゆる回転変更を
 * 一律キャンセルしてしまう（src/plugins/extends/component/game-table/game-table.component.ts）。
 * そのためisOffTableRotateが有効な状態で「視点リセット」「2Dモード表示」を押すと、
 * resetViewHandlerが設定しようとした回転（rotateX=50等）が直後に打ち消され、常にフラット
 * （2D風）な見た目になってしまう不具合があった。
 * このフラグを見て、resetViewHandlerからの呼び出し中はisOffTableRotateの打ち消しを
 * 適用しないようにすることで、「テーブル回転オフ」と「視点リセット」を独立して動作させる。
 */
export let isResettingViewByButton = false;

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
    isResettingViewByButton = true;
    try {
      if (event?.data !== 'top' && event?.data !== 'rotate') {
        that.setTransform(100, 0, 0, 50, 0, 10);
        return;
      }
      that.setTransform(0, 0, 0, 0, 0, 0);
    } finally {
      isResettingViewByButton = false;
    }
  }, 50);
  that.removeFocus();
};

/** 「視点リセット」機能によって2Dモードに切り替えられているかどうか */
export const getViewPoint2d = (): boolean => {
  if (!pluginConfig.isUseResetPointOfView) return false;
  return viewPoint2d;
};
