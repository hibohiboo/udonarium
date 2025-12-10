import { init2d } from 'src/plugins/mode2d';
import { is2d } from 'src/plugins/mode2d/extends/components/game-table/game-table.components';
import { transformDefault } from 'src/plugins/first-fetch-zip-room/extend/components/game-table/game-table.components';
import { initCommandGameBoard } from 'src/plugins/use-chat-command/game-board';
import { extendsGameTableComponentForHandStorage } from 'src/plugins/hand-storage/extend/component/game-table/game-table.component';

export const extendsGameTableComponent = (that: any) => {
  // Angularのライフサイクルフックをプロトタイプレベルでオーバーライド
  const constructor = that.constructor;
  const originalNgOnInit = constructor.prototype.ngOnInit;
  const originalNgAfterViewInit = constructor.prototype.ngAfterViewInit;
  const originalSetTransform = constructor.prototype.setTransform;

  // ngOnInitをオーバーライド
  constructor.prototype.ngOnInit = function() {
    // 元のngOnInitを呼び出し
    if (originalNgOnInit) {
      originalNgOnInit.call(this);
    }

    // mode2dプラグイン初期化
    init2d(this);
  };

  // ngAfterViewInitをオーバーライド
  constructor.prototype.ngAfterViewInit = function() {
    // 元のngAfterViewInitを呼び出し
    if (originalNgAfterViewInit) {
      originalNgAfterViewInit.call(this);
    }

    // use-chat-commandプラグイン初期化
    this.ngZone.runOutsideAngular(() => {
      initCommandGameBoard(this);
    });

    // first-fetch-zip-roomプラグイン: デフォルトトランスフォーム適用
    transformDefault(this);
  };

  // setTransformをオーバーライド（mode2dプラグイン対応）
  constructor.prototype.setTransform = function(transformX: number, transformY: number, transformZ: number, rotateX: number, rotateY: number, rotateZ: number) {
    // mode2dプラグイン: 2Dモードの場合はX軸回転を無効化
    if (is2d()) {
      // 元のsetTransformが rotateX を加算するので、その分を打ち消す
      const adjustedRotateX = -rotateX;
      originalSetTransform.call(this, transformX, transformY, transformZ, adjustedRotateX, rotateY, rotateZ);
      originalSetTransform.call(this, 0, 0, 0, rotateX, 0, 0);
    } else {
      // 通常モードは元の処理を呼び出し
      originalSetTransform.call(this, transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
    }
  };

  // HandStorageプラグイン拡張を適用
  extendsGameTableComponentForHandStorage(that);
};
