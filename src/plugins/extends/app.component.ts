import { isSettingsRoute } from "../settings/extend/app.component";
import { is2d } from "../mode2d/extends/app/app.component";
import { pluginConfig } from "../config";
import { PanelService } from "service/panel.service";
import { ModalService } from "service/modal.service";
import { fetchZipRoom } from "../first-fetch-zip-room/extend/app.component";
import * as counterBoard from 'src/plugins/add-counter-board/extend/app.component';
import { ContextMenuService } from "service/context-menu.service";
import { openHelpEvent, openHelp, useHelp } from "../keyboard-help/app/app.component";

export const outerApp = {
  panelService: null,
};

const afterViewInitExtend = (that: any) => {
  outerApp.panelService = that.panelService;
};

export const extendsAppComponent = (that: any) => {
  // isSettingsRoute プロパティをプラグインから注入
  Object.defineProperty(that, 'isSettingsRoute', {
    get: function() {
      return  isSettingsRoute();
    },
    enumerable: true,
    configurable: true
  });

  // is2d プロパティをプラグインから注入
  Object.defineProperty(that, 'is2d', {
    get: function() {
      return is2d();
    },
    enumerable: true,
    configurable: true
  });

  // useHelp プロパティをプラグインから注入
  Object.defineProperty(that, 'useHelp', {
    get: function() {
      return useHelp;
    },
    enumerable: true,
    configurable: true
  });

  // openHelp メソッドをプラグインから注入
  that.openHelp = function() {
    openHelp(this.modalService);
  };

  // onKeydown メソッドをプラグインから注入
  that.onKeydown = function(e: KeyboardEvent) {
    openHelpEvent(this.modalService, e);
  };

  // Angularのライフサイクルフックは、クラスのプロトタイプメソッドとして定義されている
  // プロトタイプレベルで元のngAfterViewInitを保存
  const constructor = that.constructor;
  const originalNgAfterViewInit = constructor.prototype.ngAfterViewInit;

  // プロトタイプレベルでngAfterViewInitをオーバーライド
  constructor.prototype.ngAfterViewInit = function() {

    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      // @HostBinding('class.is2d')相当の処理：ホスト要素（app-root）にis2dクラスを追加
      if (is2d()) {
        appRoot.classList.add('is2d');
      } else {
        appRoot.classList.remove('is2d');
      }
      if(pluginConfig.isOffObjectRotateAll){
         appRoot.classList.add('object-rotate-off');
      }
    }

    // @HostListener('document:keydown', ['$event'])相当の処理
    const keydownHandler = (e: KeyboardEvent) => {
      this.onKeydown(e);
    };
    document.addEventListener('keydown', keydownHandler);

    // コンポーネント破棄時にイベントリスナーを削除するため保存
    this._keydownHandler = keydownHandler;

    if (isSettingsRoute()) {
      // 設定画面の場合は何もしない
      return;
    }
    if (pluginConfig.isTutorial){
        PanelService.defaultParentViewContainerRef = ModalService.defaultParentViewContainerRef = ContextMenuService.defaultParentViewContainerRef = this.modalLayerViewContainerRef;
        return;
    }

    // 通常のルートの場合は元のngAfterViewInitを実行
    originalNgAfterViewInit.call(this);


    setTimeout(() => {
      afterViewInitExtend(this);
      fetchZipRoom();
      counterBoard.afterViewInit(this);
    }, 0);
  };

  // ngOnDestroyもオーバーライドしてイベントリスナーをクリーンアップ
  const originalNgOnDestroy = constructor.prototype.ngOnDestroy;
  constructor.prototype.ngOnDestroy = function() {
    // イベントリスナーを削除
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
    }

    // 元のngOnDestroyを実行
    if (originalNgOnDestroy) {
      originalNgOnDestroy.call(this);
    }
  };
}
