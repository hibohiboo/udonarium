import { ViewContainerRef } from '@angular/core';
import { TooltipDirective } from 'directive/tooltip.directive';
import { ContextMenuService } from 'service/context-menu.service';
import { BlankCard } from '../../class/blank-card';
import { BlankCardStack } from '../../class/blank-card-stack';
import { BlankCardOverviewPanelComponent } from '../../component/blank-card-overview-panel/blank-card-overview-panel.component';

export const extendTooltipDirectiveForBlankCard = () => {
  const proto = TooltipDirective.prototype as any;

  // 既にプラグインでオーバーライド済みかチェック
  if (proto._blankCardTooltipExtended) {
    return;
  }
  proto._blankCardTooltipExtended = true;

  // openメソッドをオーバーライド
  const originalOpen = proto.open;

  proto.open = function() {
    const tabletopObject = this.tabletopObject;

    // BlankCardまたはBlankCardStackの場合は専用のOverviewPanelを使用
    if (tabletopObject instanceof BlankCard || tabletopObject instanceof BlankCardStack) {
      // 元のcloseAllロジックを実行
      this.closeAll();
      if (this.pointerDeviceService.isDragging || this.pointerDeviceService.isTablePickGesture) return;

      let parentViewContainerRef: ViewContainerRef = ContextMenuService.defaultParentViewContainerRef;

      const injector = parentViewContainerRef.injector;
      this.tooltipComponentRef = parentViewContainerRef.createComponent(BlankCardOverviewPanelComponent, { index: parentViewContainerRef.length, injector: injector });

      this.tooltipComponentRef.instance.tabletopObject = this.tabletopObject;
      this.tooltipComponentRef.instance.left = this.pointerDeviceService.pointerX;
      this.tooltipComponentRef.instance.top = this.pointerDeviceService.pointerY;

      // 元のopenメソッドから残りのロジックをコピー
      this.addEventListeners(this.tooltipComponentRef.location.nativeElement);
      this.ngZone.runOutsideAngular(() => {
        document.body.addEventListener('touchstart', this.callbackOnMouseDown, true);
        document.body.addEventListener('mousedown', this.callbackOnMouseDown, true);
        document.addEventListener('pickstart', this.callbackOnPick, true);
        document.addEventListener('pickobject', this.callbackOnPick, true);
        document.addEventListener('pickregion', this.callbackOnPick, true);
      });

      const EventSystem = require('@udonarium/core/system').EventSystem;
      EventSystem.register(this)
        .on(`UPDATE_GAME_OBJECT/identifier/${this.tabletopObject.identifier}`, event => {
          if (this.pointerDeviceService.isDragging) this.ngZone.run(() => this.closeAll());
        })
        .on('UPDATE_SELECTION', event => {
          if (this.pointerDeviceService.isDragging) this.ngZone.run(() => this.closeAll());
        })
        .on('DELETE_GAME_OBJECT', event => {
          if (this.tabletopObject && this.tabletopObject.identifier === event.data.identifier) this.closeAll();
        });

      this.tooltipComponentRef.onDestroy(() => {
        this.removeEventListeners(this.tooltipComponentRef.location.nativeElement);
        document.body.removeEventListener('touchstart', this.callbackOnMouseDown, true);
        document.body.removeEventListener('mousedown', this.callbackOnMouseDown, true);
        document.removeEventListener('pickstart', this.callbackOnPick, true);
        document.removeEventListener('pickobject', this.callbackOnPick, true);
        document.removeEventListener('pickregion', this.callbackOnPick, true);
        this.clearTimer();
        this.tooltipComponentRef = null;
        EventSystem.unregister(this);
      });

      const TooltipDirectiveClass = TooltipDirective as any;
      TooltipDirectiveClass.activeTooltips.push(this.tooltipComponentRef);

      const onChanges = this.tooltipComponentRef.instance;
      if (onChanges?.ngOnChanges != null) {
        queueMicrotask(() => {
          if (this.tooltipComponentRef.instance) onChanges?.ngOnChanges({});
        });
      }
    } else {
      // 通常のカードの場合は元のメソッドを呼び出す
      originalOpen.call(this);
    }
  };
};
