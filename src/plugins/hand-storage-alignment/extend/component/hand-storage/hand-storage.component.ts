import { Network } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuSeparator } from 'service/context-menu.service';
import { setAutoSelfViewCard } from 'src/plugins/auto-self-view-mode/extend/component/hand-storage.component';
import { pluginConfig } from 'src/plugins/config';

const cardWidth = 80;

const alignmentCards = (that) => {
  const x = that.handStorage.location.x;
  const y = that.handStorage.location.y;

  // ボード上のカードを取得
  const cloneArray = [
    ...that._calcTopObjects(that.tabletopService.cards).map(({ obj }) => obj),
  ];

  cloneArray.forEach((card, i) => {
    card.location.x = x + i * cardWidth * 2;
    card.location.y = y;
    card.update();
  });
};

export const handStorageAlignmentContextMenu = (that) => {
  return [
    ContextMenuSeparator,
    {
      name: 'ボード上のカードを整列',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw);
        alignmentCards(that);
      },
    },
    {
      name: 'ボード上のカードをランダムに並べる',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw);
        const owner = that.handStorage.owner;
        const x = that.handStorage.location.x;
        const y = that.handStorage.location.y;

        // ボード上のカードを取得
        const cloneArray = [
          ...that
            ._calcTopObjects(that.tabletopService.cards)
            .map(({ obj }) => obj),
        ];

        // ランダムに並べる
        const result = cloneArray.reduce((_, cur, idx) => {
          let rand = Math.floor(Math.random() * (idx + 1));
          cloneArray[idx] = cloneArray[rand];
          cloneArray[rand] = cur;
          return cloneArray;
        });
        result.forEach((card, i) => {
          card.location.x = x + i * cardWidth * 2;
          card.location.y = y;
          card.update();
          if (
            owner === Network.peer.userId &&
            that.handStorage.isVirtualScreen
          ) {
            setAutoSelfViewCard(card);
          }
        });
      },
    },
  ];
};
