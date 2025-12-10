/**
 * TabIndexを付与。これをしないとオンマウスでフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
 */
export const addTabIndex = (that) => {
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
};
