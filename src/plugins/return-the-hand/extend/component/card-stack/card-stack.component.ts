import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

export const handCardStackContextMenu = (that) => {
  if (!pluginConfig.canReturnHandToIndividualBoard) return [];

  return [
    ContextMenuSeparator,
    {
      name: '山札を全て手札にする',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw);
        for (let card of that.cards) {
          card.handOwner = PeerCursor.myCursor.userId;
        }
      },
    },
    {
      name: '山札を全て共用のカードにする',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw);
        for (let card of that.cards) {
          card.handOwner = '';
        }
      },
    },
  ];
};
