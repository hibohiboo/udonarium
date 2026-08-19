import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuAction } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

/**
 * 山札の右クリックメニューに「カードを引く」（複数枚まとめて引く）サブメニューを追加する。
 * `that` は CardStackComponent のインスタンス（drawCard() はprivateだが実行時アクセスは可能）。
 */
export const drawNCardsContextMenu = (that: any): ContextMenuAction[] => {
  if (!pluginConfig.isAddDrawNCards) return [];

  return [
    {
      name: 'カードを引く',
      action: null,
      subActions: [2, 3, 4, 5, 10].map((n) => {
        return {
          name: `${n}枚`,
          action: () => {
            for (let i = 0; i < n; i++) {
              if (that.drawCard() != null) {
                if (i === 0 || i === 3 || i === 9) SoundEffect.play(PresetSound.cardDraw);
              } else {
                break;
              }
            }
          },
        };
      }),
    },
  ];
};
