export const extendsGameTableComponentForBlankCard = (that: any) => {
  const constructor = that.constructor;

  // blankCards getter をプロトタイプに追加
  if (!Object.getOwnPropertyDescriptor(constructor.prototype, 'blankCards')) {
    Object.defineProperty(constructor.prototype, 'blankCards', {
      get: function() {
        return this.tabletopService ? this.tabletopService.blankCards : [];
      },
      enumerable: true,
      configurable: true
    });
  }

  // blankCardStacks getter をプロトタイプに追加
  if (!Object.getOwnPropertyDescriptor(constructor.prototype, 'blankCardStacks')) {
    Object.defineProperty(constructor.prototype, 'blankCardStacks', {
      get: function() {
        return this.tabletopService ? this.tabletopService.blankCardStacks : [];
      },
      enumerable: true,
      configurable: true
    });
  }
};
