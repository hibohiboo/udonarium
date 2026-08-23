import { PanelService } from 'service/panel.service';
import { PeerMenuComponent } from 'component/peer-menu/peer-menu.component';
import { ChatWindowComponent } from 'component/chat-window/chat-window.component';
import { pluginConfig } from 'src/plugins/config';

/**
 * hide-first-peer / hide-first-chat プラグイン。
 * コア（AppComponentのngAfterViewInit）は起動時に必ず「接続情報」(PeerMenuComponent)と
 * 「チャットウィンドウ」(ChatWindowComponent) の2パネルをsetTimeout経由でまとめて開く実装に
 * なっており、そこだけを個別にフックできる場所がない。そのため、`PanelService.prototype.open`
 * を冪等ガード付きで一度だけ差し替え、対象2コンポーネントの「最初の1回」の呼び出しだけを
 * 無視する形で実現する（2回目以降＝メニューからの手動再オープンは通常通り動作させたいため、
 * 恒久的にブロックするのではなく1回限りのフラグで制御する）。
 */
export const extendPanelServiceForHideFirstOpen = () => {
  const proto = PanelService.prototype as any;
  if (proto._pluginExtendedHideFirstOpen) {
    return;
  }
  proto._pluginExtendedHideFirstOpen = true;

  const originalOpen = PanelService.prototype.open;
  let hasSkippedFirstPeer = false;
  let hasSkippedFirstChat = false;

  PanelService.prototype.open = function<T>(...args: Parameters<PanelService['open']>): T {
    const [childComponent] = args;

    if (pluginConfig.isHideFirstPeer && !hasSkippedFirstPeer && childComponent === PeerMenuComponent) {
      hasSkippedFirstPeer = true;
      return null;
    }
    if (pluginConfig.isHideFirstChat && !hasSkippedFirstChat && childComponent === ChatWindowComponent) {
      hasSkippedFirstChat = true;
      return null;
    }

    return originalOpen.apply(this, args);
  };
};
