import { CardStack } from '@udonarium/card-stack';
import { EventSystem, Network } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { cardShuffleNormalPosition } from 'src/plugins/card-shuffle-normal-position/extend/component/card-stack/card-stack.component';
import { pluginConfig } from 'src/plugins/config';

export const onKeyDownKeyboardShortcutCardStack = (that, e: KeyboardEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if (!pluginConfig.isUseKeyboardShortcut) return;
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

  if (e.key === 'm') {
    that.onContextMenu(e);
    return true;
  }
  if (e.key === 't') {
    if (!pluginConfig.isTapCard) return;
    that.rotate = 90;
    rotateSelectedCardStacks(that.rotate);
    return true;
  }
  if (e.key === 'u') {
    if (!pluginConfig.isTapCard) return;
    that.rotate = 0;
    rotateSelectedCardStacks(that.rotate);
    return true;
  }
  if (e.key === 'r') {
    if (!pluginConfig.isTapCard) return;
    that.rotate = 180;
    rotateSelectedCardStacks(that.rotate);
    return true;
  }
  if (e.key === 'R') {
    that.cardStack.faceDownAll();
    SoundEffect.play(PresetSound.cardDraw);
    return true;
  }
  if (e.key === 'U') {
    that.cardStack.uprightAll();
    SoundEffect.play(PresetSound.cardDraw);
    return true;
  }
  if (e.key === 'S') {
    that.cardStack.shuffle();
    cardShuffleNormalPosition(that);
    SoundEffect.play(PresetSound.cardShuffle);
    EventSystem.call('SHUFFLE_CARD_STACK', {
      identifier: that.cardStack.identifier,
    });
    return true;
  } else if (e.key === 'q') {
    that.showDetail(that.cardStack);
    return true;
  } else if (e.key === 'd') {
    that.cardStack.destroy();
    SoundEffect.play(PresetSound.sweep);
    return true;
  } else if (e.key === 'c') {
    let cloneObject = that.cardStack.clone();
    cloneObject.location.x += that.gridSize;
    cloneObject.location.y += that.gridSize;
    cloneObject.owner = '';
    cloneObject.toTopmost();
    SoundEffect.play(PresetSound.cardPut);
    return true;
  }
};

export const initKeyboardShortcutCardStack = (that) => {
  that.tabIndex = '0'; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
};
