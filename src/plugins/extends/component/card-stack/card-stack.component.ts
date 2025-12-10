import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';
import { addTabIndex } from 'src/plugins/keyboard-shortcut/extend/component/addTabIndex';
import { onKeyDownKeyboardShortcutCardStack } from 'src/plugins/keyboard-shortcut/extend/component/card-stack/card-stack.component';
import {  onKeyDownKeyboardShortcutCard } from 'src/plugins/keyboard-shortcut/extend/component/card/card.component';
import { initRotateOffCardStack } from 'src/plugins/object-rotate-off/extends/class/card-stack';
import { tapCardStackContextMenu, tapCardStackEnter, tapCardStackSelectedContextMenu } from 'src/plugins/tap-card/extend/component/card-stack/card-stack.component';
import { tapCardContextMenu, tapCardEnter, tapCardSelectedContextMenu } from 'src/plugins/tap-card/extend/component/card/card.component';

export const extendsCardStackComponent = (that: any) => {
  // keyboard-shortcut プラグインの初期化
  addTabIndex(that);

  // CardStackにisRotateOffIndividuallyプロパティを初期化
  if (pluginConfig.isOffObjectRotateIndividually && that.cardStack) {
    const cardStack = that.cardStack;
    if (cardStack.isRotateOffIndividually === undefined) {
      // 初回のみ初期化（既存のデータには影響しない）
      initRotateOffCardStack(cardStack);
    }
  }

  // Angularのライフサイクルフックをプロトタイプレベルでオーバーライド
  const constructor = that.constructor;

  // ngOnChangesをオーバーライドして回転オフクラスを更新
  const originalNgOnChanges = constructor.prototype.ngOnChanges;
  constructor.prototype.ngOnChanges = function() {
    if (originalNgOnChanges) {
      originalNgOnChanges.call(this);
    }
    // 回転オフクラスを更新
    if (this._updateRotateOffClass) {
      this._updateRotateOffClass();
    }
  };

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

    // @HostBinding('class.object-rotate-off')相当の処理：回転オフクラスを設定
    const updateRotateOffClass = () => {
      if (this.elementRef && this.elementRef.nativeElement) {
        const isRotateOff = pluginConfig.isOffObjectRotateIndividually && this.cardStack?.isRotateOffIndividually;
        if (isRotateOff) {
          this.elementRef.nativeElement.classList.add('object-rotate-off');
        } else {
          this.elementRef.nativeElement.classList.remove('object-rotate-off');
        }
      }
    };
    updateRotateOffClass();
    this._updateRotateOffClass = updateRotateOffClass;

    // @HostListener("keydown", ["$event"]) 相当の処理
    const keydownHandler = (e: KeyboardEvent) => {
      onKeyDownKeyboardShortcutCardStack(this, e);
    };
    this.elementRef.nativeElement.addEventListener('keydown', keydownHandler);

    // @HostListener("pointerenter", ["$event"]) 相当の処理
    const pointerenterHandler = (e: MouseEvent) => {
      tapCardStackEnter(this, e);
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

  // makeSelectionContextMenuメソッドをオーバーライドして拡張メニューを追加
  const originalMakeSelectionContextMenu = constructor.prototype.makeSelectionContextMenu;
  constructor.prototype.makeSelectionContextMenu = function() {
    // 元のメソッドを呼び出して基本メニューを取得
    const actions = originalMakeSelectionContextMenu.call(this);

    // 選択されている場合、拡張メニューを追加
    if (this.isSelected && actions.length > 0) {
      // 最後のセパレータの前に拡張メニューを挿入するため、
      // '選択した山札'のsubActionsを探して拡張
      const selectionMenu = actions.find((action: any) => action.name === '選択した山札');
      if (selectionMenu && selectionMenu.subActions) {
        // 拡張メニューをsubActionsの最後に追加
        selectionMenu.subActions.push(...makeSelectionContextMenuExtend(this));
      }
    }

    return actions;
  };

  // makeContextMenuメソッドをオーバーライドして拡張メニューを追加
  const originalMakeContextMenu = constructor.prototype.makeContextMenu;
  constructor.prototype.makeContextMenu = function() {
    // 元のメソッドを呼び出して基本メニューを取得
    const actions = originalMakeContextMenu.call(this);

    // 拡張メニューを適切な位置に挿入
    // 'すべて正位置にする'の後に挿入
    const uprightIndex = actions.findIndex((action: any) => action.name === 'すべて正位置にする');
    if (uprightIndex !== -1) {
      actions.splice(uprightIndex + 1, 0, ...makeContextMenuExtend(this));
    }

      // オブジェクト回転オフ(個別設定可能)が有効な場合、メニューを最後に追加
    if (pluginConfig.isOffObjectRotateIndividually) {
      const cardStack = this.cardStack;
      const isRotateOff = cardStack.isRotateOffIndividually;
      actions.push(ContextMenuSeparator);
      actions.push({
        name: isRotateOff ? '回転を有効にする' : '回転を無効にする',
        action: () => {
          cardStack.isRotateOffIndividually = !isRotateOff;
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

// makeSelectionContextMenu に追加するアクション
const makeSelectionContextMenuExtend = (that: any) => {
  return tapCardStackSelectedContextMenu(that);
};

// makeContextMenu に追加するアクション
const makeContextMenuExtend = (that: any) => {
  const actions = tapCardStackContextMenu(that);



  return actions;
};
