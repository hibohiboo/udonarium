export const extendsGameTableComponentForHandStorage = (that: any) => {
  const constructor = that.constructor;

  // getterをプロトタイプに追加
  if (!Object.getOwnPropertyDescriptor(constructor.prototype, 'handStorages')) {
    Object.defineProperty(constructor.prototype, 'handStorages', {
      get: function() {
        return this.handStorageService ? this.handStorageService.handStorages : [];
      },
      enumerable: true,
      configurable: true
    });
  }
};
