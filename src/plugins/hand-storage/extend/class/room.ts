import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { pluginConfig } from 'src/plugins/config';
import { HandStorage } from './hand-storage';

export const innerXMLHandStorageObject = (objects) => {
  if (!pluginConfig.isUseHandStorage) return objects;
  return objects.concat(ObjectStore.instance.getObjects(HandStorage));
};
