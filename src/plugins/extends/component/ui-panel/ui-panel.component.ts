import { pluginConfig } from "src/plugins/config";

export const extendsUIPanelComponent = (that: any) => {

  Object.defineProperty(that, 'isAbleMinimizeButton', {
    get: function() {
      return  pluginConfig.isMinimizableMenu;
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(that, 'isMinimized', {
    value: false,
    writable: true,
    enumerable: true,
    configurable: true
  });



  that.toggleMinimize = function() {
    const panel = this.draggablePanel.nativeElement;
    const cntent = this.scrollablePanel.nativeElement;
    panel.style.transition = 'width 0.1s ease-in-out, height 0.1s ease-in-out';
    cntent.style.overflowY = 'hidden';
    setTimeout(() => {
      panel.style.transition = null;
      cntent.style.overflowY = null;
    }, 100);

    if (!this.isMinimized && !this.isFullScreen) {
      const saveWidth = panel.offsetWidth;
      const saveHeight = panel.offsetHeight;
      if (this.isHorizontal) {
        this._horizontalWidth = saveWidth;
        this.horizontalHeight = saveHeight;
      } else {
        this.verticalWidth = saveWidth;
        this.verticalHeight = saveHeight;
      }
    }
    this.isMinimized = !this.isMinimized;
    this.isFullScreen = false;
  };
}
