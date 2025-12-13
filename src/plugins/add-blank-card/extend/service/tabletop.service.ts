import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { TabletopService } from 'service/tabletop.service';
import { BlankCard } from '../../class/blank-card';
import { BlankCardStack } from '../../class/blank-card-stack';

export const extendTabletopServiceForBlankCard = () => {
  const proto = TabletopService.prototype as any;

  // 既にプラグインでオーバーライド済みかチェック
  if (proto._blankCardExtended) {
    return;
  }
  proto._blankCardExtended = true;

  // blankCards getter を追加
  if (!Object.getOwnPropertyDescriptor(proto, 'blankCards')) {
    Object.defineProperty(proto, 'blankCards', {
      get: function() {
        return ObjectStore.instance.getObjects(BlankCard).filter(obj => obj.isVisibleOnTable);
      },
      enumerable: true,
      configurable: true
    });
  }

  // blankCardStacks getter を追加
  if (!Object.getOwnPropertyDescriptor(proto, 'blankCardStacks')) {
    Object.defineProperty(proto, 'blankCardStacks', {
      get: function() {
        return ObjectStore.instance.getObjects(BlankCardStack).filter(obj => obj.isVisibleOnTable);
      },
      enumerable: true,
      configurable: true
    });
  }
};
