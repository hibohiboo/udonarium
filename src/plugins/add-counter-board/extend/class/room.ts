import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { pluginConfig } from 'src/plugins/config';
import { CounterBoard } from './counter-board';

export const innerXMLCounterBoard = (objects) => {
  if (!pluginConfig.isAddCounterBoard) return objects;
  return objects.concat(ObjectStore.instance.getObjects(CounterBoard));
};
