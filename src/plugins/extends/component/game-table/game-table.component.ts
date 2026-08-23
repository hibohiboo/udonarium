import { init2d } from 'src/plugins/mode2d';
import { is2d } from 'src/plugins/mode2d/extends/components/game-table/game-table.components';
import { isEmptyDefaultTabletopObjects, transformDefault } from 'src/plugins/first-fetch-zip-room/extend/components/game-table/game-table.components';
import { initCommandGameBoard } from 'src/plugins/use-chat-command/game-board';
import { extendsGameTableComponentForHandStorage } from 'src/plugins/hand-storage/extend/component/game-table/game-table.component';
import { extendsGameTableComponentForBlankCard } from 'src/plugins/add-blank-card/extend/component/game-table/game-table.component';
import { resetViewHandler } from 'src/plugins/reset-point-of-view/extend/component/game-table/game-table.component';
import { EventSystem } from '@udonarium/core/system';
import { pluginConfig } from 'src/plugins/config';

export const extendsGameTableComponent = (that: any) => {
  // Angularのライフサイクルフックをプロトタイプレベルでオーバーライド
  const constructor = that.constructor;
  const originalNgOnInit = constructor.prototype.ngOnInit;
  const originalNgAfterViewInit = constructor.prototype.ngAfterViewInit;
  const originalSetTransform = constructor.prototype.setTransform;

  // originalNgOnInit中のイベント登録部分（UPDATE_GAME_OBJECT / DRAG_LOCKED_OBJECT）を
  // 呼び出し元を丸ごとスキップする分岐でも再現するための共通処理
  // （empty-default-objects/empty-default-table, first-fetch-zip-room の両方から使う）
  const registerTableGridEvents = (that: any) => {
    EventSystem.register(that)
      .on('UPDATE_GAME_OBJECT', event => {
        if (event.data.identifier !== that.currentTable.identifier && event.data.identifier !== that.tableSelecter.identifier) return;
        console.log('UPDATE_GAME_OBJECT GameTableComponent ' + that.currentTable.identifier);

        that.setGameTableGrid(that.currentTable.width, that.currentTable.height, that.currentTable.gridSize, that.currentTable.gridType, that.currentTable.gridColor);
      })
      .on('DRAG_LOCKED_OBJECT', event => {
        that.isTableTransformMode = true;
        that.pointerDeviceService.isDragging = false;
        let opacity: number = that.tableSelecter.gridShow ? 1.0 : 0.0;
        that.gridCanvas.nativeElement.style.opacity = opacity + '';
      });
  };

  // ngOnInitをオーバーライド
  constructor.prototype.ngOnInit = function() {
    // reset-point-of-viewプラグイン: RESET_POINT_OF_VIEWイベントを購読
    // （isEmptyDefaultTabletopObjectsの分岐に関わらず必要なため、分岐の前で登録する）
    EventSystem.register(this)
      .on('RESET_POINT_OF_VIEW', event => resetViewHandler(this, event));

    // 初期テーブル設定を呼び出さない場合（Zipから部屋情報を読み込む場合）
    if(isEmptyDefaultTabletopObjects){
        registerTableGridEvents(this);
        init2d(this);
        return;
    }

    // empty-default-objects / empty-default-table: makeDefaultTable() /
    // makeDefaultTabletopObjects() を個別にスキップできるようにする。
    // originalNgOnInitは2つの呼び出しをまとめて実行してしまうため、
    // どちらか一方でもスキップしたい場合はoriginalNgOnInitを呼ばず、
    // イベント登録部分だけ再現した上で個別にガードする。
    if (pluginConfig.isEmptyDefaultObjects || pluginConfig.isEmptyDefaultTable) {
      registerTableGridEvents(this);
      if (!pluginConfig.isEmptyDefaultTable) this.tabletopActionService.makeDefaultTable();
      if (!pluginConfig.isEmptyDefaultObjects) this.tabletopActionService.makeDefaultTabletopObjects();
    } else if (originalNgOnInit) {
      // 元のngOnInitを呼び出し
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
    if (pluginConfig.isOffTableRotate){
      originalSetTransform.call(this, transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
      originalSetTransform.call(this, 0, 0, 0, -rotateX,  -rotateY, -rotateZ);
    }
    // mode2dプラグイン: 2Dモードの場合はX軸回転を無効化
    else if (is2d()) {
      // 元のsetTransformが rotateX を加算するので、その分を打ち消す
      originalSetTransform.call(this, transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
      originalSetTransform.call(this, 0, 0, 0, -rotateX, 0, 0);
    } else {
      // 通常モードは元の処理を呼び出し
      originalSetTransform.call(this, transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
    }
  };

  // HandStorageプラグイン拡張を適用
  extendsGameTableComponentForHandStorage(that);
  // BlankCardプラグイン拡張を適用
  extendsGameTableComponentForBlankCard(that);
};
