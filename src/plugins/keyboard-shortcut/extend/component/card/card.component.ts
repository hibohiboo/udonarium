import { Card } from '@udonarium/card';
import { Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { pluginConfig } from 'src/plugins/config';

export const onKeyDownKeyboardShortcutCard = (that, e: KeyboardEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if (!pluginConfig.isUseKeyboardShortcut) return;
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
  if (e.key === 'm') {
    that.onContextMenu(e);
  } else if (e.key === 't') {
    if (!pluginConfig.isTapCard) return;
    that.rotate = 90;
    rotateSelectedCards(that.rotate);
    return true;
  } else if (e.key === 'u') {
    if (!pluginConfig.isTapCard) return;
    that.rotate = 0;
    rotateSelectedCards(that.rotate);
    return true;
  } else if (e.key === 'r') {
    if (!pluginConfig.isTapCard) return;
    that.rotate = 180;
    rotateSelectedCards(that.rotate);
    return true;
  } else if (e.key === 'c') {
    const cloneObject = that.card.clone();
    cloneObject.location.x += that.gridSize;
    cloneObject.location.y += that.gridSize;
    cloneObject.toTopmost();
    SoundEffect.play(PresetSound.cardPut);
    return true;
  } else if (e.key === 's') {
    SoundEffect.play(PresetSound.cardDraw);
    that.card.faceDown();
    that.owner = Network.peer.userId;
  } else if (e.key === 'q') {
    that.showDetail(that.card);
    return true;
  } else if (e.key === 'R') {
    that.card.faceDown();
    SoundEffect.play(PresetSound.cardDraw);
    return true;
  } else if (e.key === 'd') {
    that.card.destroy();
    SoundEffect.play(PresetSound.sweep);
    return true;
  } else if (e.key === 'h') {
    SoundEffect.play(PresetSound.cardDraw);
    if (that.card.handOwner) {
      that.card.handOwner = '';
      return;
    }
    that.card.handOwner = PeerCursor.myCursor.userId;
  }
};

export const initKeyboardShortcutCard = (that) => {
  that.tabIndex = '0'; //TabIndexを付与。これをしないとフォーカスできないのでコンポーネントに対するキーイベントを取得できない。
};
