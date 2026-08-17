import { ContextMenuAction } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';
import { CONTEXT_MENU_ADD_ICON_TITLE } from '../../../constants';

/**
 * ゲームテーブル背景の右クリックメニューを、通常のテキストメニューではなく
 * アイコングリッドメニューとして開く。
 * 実際にどのコンポーネントで描画するかは ContextMenuService 側の拡張
 * （src/plugins/extends/service/context-menu.service.ts）が判定する。
 * ここでは目印タイトルを使ってメニューを開くだけ。
 *
 * @returns true の場合、呼び出し元は通常の contextMenuService.open() 呼び出しを行わない
 */
export const contextMenuAddIcon = (that: any, menuPosition: { x: number, y: number }, menuActions: ContextMenuAction[]): boolean => {
  if (!pluginConfig.isContextMenuIcon) return false;
  that.contextMenuService.open(menuPosition, menuActions, CONTEXT_MENU_ADD_ICON_TITLE);
  return true;
};
