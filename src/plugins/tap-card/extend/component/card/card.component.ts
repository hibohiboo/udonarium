import { Card } from '@udonarium/card';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

export const tapCardContextMenu = (that) => {
  if (!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: 'カードを横にする',
      action: () => (that.card.rotate = 90),
    },
    {
      name: 'カードを縦にする',
      action: () => (that.card.rotate = 0),
    },
    {
      name: 'カードを逆位置にする',
      action: () => (that.card.rotate = 180),
    },
  ];
};

export const tapCardContextMenuHandStorage = (that) => {
  if (!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: '全てのカードを横にする',
      action: () => {
        that
          ._calcTopObjects(that.tabletopService.cards)
          .forEach(({ obj: card }) => {
            card.rotate = 90;
          });
        SoundEffect.play(PresetSound.cardPut);
      },
    },
    {
      name: '全てのカードを縦にする',
      action: () => {
        that
          ._calcTopObjects(that.tabletopService.cards)
          .forEach(({ obj: card }) => {
            card.rotate = 0;
          });
        SoundEffect.play(PresetSound.cardPut);
      },
    },
    {
      name: '全てのカードを逆位置にする',
      action: () => {
        that
          ._calcTopObjects(that.tabletopService.cards)
          .forEach(({ obj: card }) => {
            card.rotate = 180;
          });
        SoundEffect.play(PresetSound.cardPut);
      },
    },
  ];
};
export const tapCardSelectedContextMenu = (that) => {
  if (!pluginConfig.isTapCard) return [];
  const rotateSelectedCards = (rotate: number) => {
    const stacks = that.selectionService.objects.filter(
      (object) => object.aliasName === that.card.aliasName,
    ) as Card[];

    stacks.forEach((cardStack) => {
      // 選択状態を解除しないとrotateの更新が反映されない
      that.selectionService.remove(cardStack);
      cardStack.rotate = rotate;
      cardStack.update();
    });
  };

  return [
    ContextMenuSeparator,
    {
      name: 'すべて横にする',
      action: () => {
        rotateSelectedCards(90);
      },
    },
    {
      name: 'すべて縦にする',
      action: () => {
        rotateSelectedCards(0);
      },
    },
    {
      name: 'すべて逆位置にする',
      action: () => {
        rotateSelectedCards(180);
      },
    },
  ];
};
export const tapCardEnter = (that: any, e: MouseEvent) => {
  if (!pluginConfig.isTapCard) return;
  e.stopPropagation();
  e.preventDefault();
  // preventScroll: true でフォーカス時にスクロールを抑制(180度回転時に予期しないスクロールが発生するため)
  that.elementRef.nativeElement.focus({ preventScroll: true });
};
