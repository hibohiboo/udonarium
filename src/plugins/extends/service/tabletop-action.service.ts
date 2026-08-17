import { TabletopActionService } from 'service/tabletop-action.service';
import { getCreateBlankCardMenu } from 'src/plugins/add-blank-card/extends/servies/tabletop-action.service';
import { pluginConfig } from 'src/plugins/config';
import { createDefaultCubeTerrain } from 'src/plugins/default-terrain-cube/extend/service/tabletop-action.service';
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

  // createTerrainをオーバーライドして、設定が有効な場合はCube地形を作成する
  const originalCreateTerrain = TabletopActionService.prototype.createTerrain;

  TabletopActionService.prototype.createTerrain = function(position) {
    if (pluginConfig.isChangeDefaultTerrain) {
      const cubeTerrain = createDefaultCubeTerrain(position);
      if (cubeTerrain) return cubeTerrain;
    }
    return originalCreateTerrain.call(this, position);
  };
};

