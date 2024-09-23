import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuAction } from 'service/context-menu.service';
import { PointerCoordinate } from 'service/pointer-device.service';
import { pluginConfig } from 'src/plugins/config';
import { HandStorage } from '../class/hand-storage';

export const getCreateHandStorageMenu = (
  position: PointerCoordinate,
): ContextMenuAction[] => {
  if (!pluginConfig.isUseHandStorage) return [];

  return [
    {
      name: 'ボードを作成',
      action: () => {
        createHandStorage(position);
        SoundEffect.play(PresetSound.blockPut);
      },
    },
  ];
};
const createHandStorage = (position) => {
  const handStorage = HandStorage.create('ボード', 5, 5, 100);
  handStorage.location.x = position.x - 25;
  handStorage.location.y = position.y - 100;
  handStorage.posZ = 0;
  return handStorage;
};
