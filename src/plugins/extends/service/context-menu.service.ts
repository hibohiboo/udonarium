import { ContextMenuService } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';
import { CONTEXT_MENU_ADD_ICON_TITLE } from 'src/plugins/context-menu-add-icon/constants';
import { IconContextMenuComponent } from 'src/plugins/context-menu-add-icon/component/icon-context-menu/icon-context-menu.component';

export const extendContextMenuService = () => {
  const proto = ContextMenuService.prototype as any;
  // 既にプラグインでオーバーライド済みかチェック
  if (proto._pluginExtended) {
    return;
  }
  proto._pluginExtended = true;

  // openをオーバーライドして、context-menu-add-iconプラグインの目印タイトルが渡された場合のみ
  // 一時的に描画コンポーネントをアイコングリッド版に差し替える
  const originalOpen = ContextMenuService.prototype.open;
  ContextMenuService.prototype.open = function (position, actions, title, parentViewContainerRef) {
    if (pluginConfig.isContextMenuIcon && title === CONTEXT_MENU_ADD_ICON_TITLE) {
      const originalComponentClass = ContextMenuService.ContextMenuComponentClass;
      ContextMenuService.ContextMenuComponentClass = IconContextMenuComponent;
      try {
        originalOpen.call(this, position, actions, '', parentViewContainerRef);
      } finally {
        ContextMenuService.ContextMenuComponentClass = originalComponentClass;
      }
      return;
    }
    originalOpen.call(this, position, actions, title, parentViewContainerRef);
  };
};
