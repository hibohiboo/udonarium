import { HandStorageService } from '../../service/hand-storage.service';
import { HandStorage } from '../../class/hand-storage';

export const extendsGameTableComponentForHandStorage = (that: any) => {
  // HandStorageServiceをDIから取得（Angularのinjectorを使用）
  // ただし、constructorで既にDIされている場合はそれを使う

  // getterをプロトタイプに追加
  const constructor = that.constructor;

  Object.defineProperty(constructor.prototype, 'handStorages', {
    get: function() {
      // HandStorageServiceのインスタンスを取得
      // Angularの場合、injectorから取得する必要がある
      if (!this._handStorageService) {
        // サービスロケーターパターン: グローバルに登録されたサービスを取得
        // または、app.component.tsなどで事前に設定されたサービスを使用
        const injector = (this as any).injector || (window as any).injector;
        if (injector) {
          this._handStorageService = injector.get(HandStorageService);
        }
      }
      return this._handStorageService ? this._handStorageService.handStorages : [];
    },
    enumerable: true,
    configurable: true
  });
};
