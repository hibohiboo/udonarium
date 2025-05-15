import { CardStack } from '@udonarium/card-stack';
import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

export const tapCardStackContextMenu = (that) => {
  if (!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: '山札を横にする',
      action: () => (that.cardStack.rotate = 90),
    },
    {
      name: '山札を縦にする',
      action: () => (that.cardStack.rotate = 0),
    },
    {
      name: '山札を逆位置にする',
      action: () => (that.cardStack.rotate = 180),
    },
  ];
};
export const tapCardStackSelectedContextMenu = (that) => {
  if (!pluginConfig.isTapCard) return [];
  const rotateSelectedCardStacks = (rotate: number) => {
    const stacks = that.selectionService.objects.filter(
      (object) => object.aliasName === that.cardStack.aliasName,
    ) as CardStack[];

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
        rotateSelectedCardStacks(90);
      },
    },
    {
      name: 'すべて縦にする',
      action: () => {
        rotateSelectedCardStacks(0);
      },
    },
    {
      name: 'すべて逆位置にする',
      action: () => {
        rotateSelectedCardStacks(180);
      },
    },
  ];
};
export const tapCardStackEnter = (that: any, e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  // preventScroll: true でフォーカス時にスクロールを抑制(180度回転時に予期しないスクロールが発生するため)
  that.elementRef.nativeElement.focus({ preventScroll: true });
};
