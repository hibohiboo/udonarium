import { TabletopActionService } from 'service/tabletop-action.service';
import { getCreateBlankCardMenu } from 'src/plugins/add-blank-card/extends/servies/tabletop-action.service';
import { getCreateHandStorageMenu } from 'src/plugins/hand-storage/extend/service/tabletop-action.service';

export const extendTabletopActionService = () => {
  const proto = TabletopActionService.prototype as any
  // 既にプラグインでオーバーライド済みかチェック
  if (proto._pluginExtended) {
    return;
  }
  proto._pluginExtended = true;

  // makeDefaultContextMenuActionsをオーバーライドして拡張メニューを追加
  const originalMakeDefaultContextMenuActions = TabletopActionService.prototype.makeDefaultContextMenuActions;

  TabletopActionService.prototype.makeDefaultContextMenuActions = function(position) {
    // 元のメソッドを呼び出して基本メニューを取得
    const actions = originalMakeDefaultContextMenuActions.call(this, position);

    // hand-storage プラグインのメニューを追加
    actions.push(...getCreateHandStorageMenu(position));

    // add-blank-card プラグインのメニューを追加
    actions.push(...getCreateBlankCardMenu(position));

    return actions;
  };
};

