import { initKeyboardShortcutCard, onKeyDownKeyboardShortcutCard } from 'src/plugins/keyboard-shortcut/extend/component/card/card.component';
import { tapCardContextMenu, tapCardEnter, tapCardSelectedContextMenu } from 'src/plugins/tap-card/extend/component/card/card.component';

export const extendsCardComponent = (that: any) => {
  // keyboard-shortcut プラグインの初期化
  initKeyboardShortcutCard(that);

  // tabIndex プロパティをプラグインから注入
  // @HostBinding('tabIndex')相当の処理
  Object.defineProperty(that, 'tabIndex', {
    get: function() {
      return this._tabIndex || '0';
    },
    set: function(value: string) {
      this._tabIndex = value;
      // DOM要素のtabindex属性を更新
      if (this.elementRef && this.elementRef.nativeElement) {
        this.elementRef.nativeElement.setAttribute('tabindex', value);
      }
    },
    enumerable: true,
    configurable: true
  });

  // Angularのライフサイクルフックをプロトタイプレベルでオーバーライド
  const constructor = that.constructor;
  const originalNgAfterViewInit = constructor.prototype.ngAfterViewInit;

  constructor.prototype.ngAfterViewInit = function() {
    // 元のngAfterViewInitを実行
    if (originalNgAfterViewInit) {
      originalNgAfterViewInit.call(this);
    }

    // @HostBinding('tabIndex')相当の処理：DOM要素のtabindex属性を設定
    if (this.elementRef && this.elementRef.nativeElement) {
      this.elementRef.nativeElement.setAttribute('tabindex', this.tabIndex || '0');
    }

    // @HostListener("keydown", ["$event"]) 相当の処理
    const keydownHandler = (e: KeyboardEvent) => {
      onKeyDownKeyboardShortcutCard(this, e);
    };
    this.elementRef.nativeElement.addEventListener('keydown', keydownHandler);

    // @HostListener("pointerenter", ["$event"]) 相当の処理
    const pointerenterHandler = (e: MouseEvent) => {
      tapCardEnter(this, e);
    };
    this.elementRef.nativeElement.addEventListener('pointerenter', pointerenterHandler);

    // イベントリスナーを破棄時に削除するため保存
    this._keydownHandler = keydownHandler;
    this._pointerenterHandler = pointerenterHandler;
  };

  // ngOnDestroyもオーバーライドしてイベントリスナーをクリーンアップ
  const originalNgOnDestroy = constructor.prototype.ngOnDestroy;
  constructor.prototype.ngOnDestroy = function() {
    // イベントリスナーを削除
    if (this._keydownHandler) {
      this.elementRef.nativeElement.removeEventListener('keydown', this._keydownHandler);
    }
    if (this._pointerenterHandler) {
      this.elementRef.nativeElement.removeEventListener('pointerenter', this._pointerenterHandler);
    }

    // 元のngOnDestroyを実行
    if (originalNgOnDestroy) {
      originalNgOnDestroy.call(this);
    }
  };
};

// makeSelectionContextMenu に追加するアクション
export const makeSelectionContextMenuExtend = (that: any) => {
  return tapCardSelectedContextMenu(that);
};

// makeContextMenu に追加するアクション
export const makeContextMenuExtend = (that: any) => {
  return tapCardContextMenu(that);
};
