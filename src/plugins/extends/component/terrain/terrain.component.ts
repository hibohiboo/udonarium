import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

export const extendsTerrainComponent = (that: any) => {
  // Angularのライフサイクルフックをプロトタイプレベルでオーバーライド
  const constructor = that.constructor;

  // 既にプラグインでオーバーライド済みかチェック
  if (constructor.prototype._pluginExtended) {
    return;
  }
  constructor.prototype._pluginExtended = true;

  if (pluginConfig.isOffObjectRotateIndividually) {
    // ngOnChangesをオーバーライドして回転オフクラスを更新
    const originalNgOnChanges = constructor.prototype.ngOnChanges;
    constructor.prototype.ngOnChanges = function() {
      if (originalNgOnChanges) { originalNgOnChanges.call(this); }
      if (this._updateRotateOffClass) { this._updateRotateOffClass(); }
    };
  }

  const originalNgAfterViewInit = constructor.prototype.ngAfterViewInit;

  constructor.prototype.ngAfterViewInit = function() {
    // 元のngAfterViewInitを実行
    if (originalNgAfterViewInit) {
      originalNgAfterViewInit.call(this);
    }

    if (pluginConfig.isOffObjectRotateIndividually) {
      // @HostBinding('class.object-rotate-off')相当の処理：回転オフクラスを設定
      const updateRotateOffClass = () => {
        if (!this.elementRef?.nativeElement) { return; }
        if (this.terrain?.isRotateOffIndividually) {
          this.elementRef.nativeElement.classList.add('object-rotate-off');
        } else {
          this.elementRef.nativeElement.classList.remove('object-rotate-off');
        }
      };
      updateRotateOffClass();
      this._updateRotateOffClass = updateRotateOffClass;
    }
  };

  // makeSelectionContextMenuメソッドをオーバーライドして拡張メニューを追加
  const originalMakeSelectionContextMenu = constructor.prototype.makeSelectionContextMenu;
  if (originalMakeSelectionContextMenu) {
    constructor.prototype.makeSelectionContextMenu = function() {
      // 元のメソッドを呼び出して基本メニューを取得
      const actions = originalMakeSelectionContextMenu.call(this);

      // 選択されている場合、拡張メニューを追加できる（現時点では追加なし）

      return actions;
    };
  }

  // makeContextMenuメソッドをオーバーライドして拡張メニューを追加
  const originalMakeContextMenu = constructor.prototype.makeContextMenu;
  constructor.prototype.makeContextMenu = function() {
    // 元のメソッドを呼び出して基本メニューを取得
    const actions = originalMakeContextMenu.call(this);

    // 回転オフメニューは最後に追加
    if (pluginConfig.isOffObjectRotateIndividually) {
      const terrain = this.terrain;
      const isRotateOff = terrain.isRotateOffIndividually;
      actions.push(ContextMenuSeparator);
      actions.push({
        name: isRotateOff ? '回転を有効にする' : '回転を無効にする',
        action: () => {
          terrain.isRotateOffIndividually = !isRotateOff;
          // クラスを更新
          if (this._updateRotateOffClass) {
            this._updateRotateOffClass();
          }
        }
      });
    }

    return actions;
  };
};
