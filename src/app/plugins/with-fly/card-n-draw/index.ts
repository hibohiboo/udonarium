
import { EventSystem, Network } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuAction, ContextMenuSeparator } from 'service/context-menu.service';
import { PointerData } from 'service/pointer-device.service';

export default {
  cardStackComponentOnContextMenuHook: (that, position: PointerData) => {
    const actions: ContextMenuAction[] = []
    if (that.cards.length > 0) {
      actions.push({
        name: 'カードを１枚引く', action: () => {
          if (that.drawCard() != null) {
            SoundEffect.play(PresetSound.cardDraw);
          }
        }
      })
      actions.push({
        name: 'カードを引く', action: null,
        subActions: [2, 3, 4, 5, 10].map(n => {
          return {
            name: `${n}枚`,
            action: () => {
              for (let i = 0; i < n; i++) {
                if (that.drawCard() != null) {
                  if (i == 0 || i == 3 || i == 9) SoundEffect.play(PresetSound.cardDraw);
                } else {
                  break;
                }
              }
            }
          };
        })
      })
      actions.push(ContextMenuSeparator)
      actions.push({
        name: '一番上を表にする', action: () => {
          that.cardStack.faceUp();
          SoundEffect.play(PresetSound.cardDraw);
        }
      })
      actions.push({
        name: '一番上を裏にする', action: () => {
          that.cardStack.faceDown();
          SoundEffect.play(PresetSound.cardDraw);
        }
      })
      actions.push(ContextMenuSeparator)
      actions.push({
        name: 'すべて表にする', action: () => {
          that.cardStack.faceUpAll();
          SoundEffect.play(PresetSound.cardDraw);
        }
      })
      actions.push({
        name: 'すべて裏にする', action: () => {
          that.cardStack.faceDownAll();
          SoundEffect.play(PresetSound.cardDraw);
        }
      })
      actions.push({
        name: 'すべて正位置にする', action: () => {
          that.cardStack.uprightAll();
          SoundEffect.play(PresetSound.cardDraw);
        }
      })
      actions.push(ContextMenuSeparator)
      actions.push({
        name: 'シャッフル', action: () => {
          that.cardStack.shuffle();
          SoundEffect.play(PresetSound.cardShuffle);
          EventSystem.call('SHUFFLE_CARD_STACK', { identifier: that.cardStack.identifier });
        }
      })
      actions.push({ name: 'カード一覧を見る', action: () => { that.showStackList(that.cardStack); } })
      actions.push(ContextMenuSeparator)
      if(that.isShowTotal) {
        actions.push({ name: '☑ 枚数を表示', action: () => { that.cardStack.isShowTotal = false; } })
      } else {
        actions.push({ name: '☐ 枚数を表示', action: () => { that.cardStack.isShowTotal = true; } })
      }
      actions.push({ name: 'カードサイズを揃える', action: () => { if (that.cardStack.topCard) that.cardStack.unifyCardsSize(that.cardStack.topCard.size); } })
      actions.push(ContextMenuSeparator)
      actions.push({
        name: '山札を人数分に分割する', action: () => {
          that.splitStack(Network.peerIds.length);
          SoundEffect.play(PresetSound.cardDraw);
        }
      })
      actions.push({
        name: '山札を崩す', action: () => {
          that.breakStack();
          SoundEffect.play(PresetSound.cardShuffle);
        }
      })
      actions.push(ContextMenuSeparator)
      actions.push( { name: '詳細を表示', action: () => { that.showDetail(that.cardStack); } })
    }
    actions.push( {
      name: 'コピーを作る', action: () => {
        let cloneObject = that.cardStack.clone();
        cloneObject.location.x += that.gridSize;
        cloneObject.location.y += that.gridSize;
        cloneObject.owner = '';
        cloneObject.toTopmost();
        SoundEffect.play(PresetSound.cardPut);
      }
    })
    actions.push({
      name: '山札を削除する', action: () => {
        that.cardStack.setLocation('graveyard');
        that.cardStack.destroy();
        SoundEffect.play(PresetSound.sweep);
      }
    })
    that.contextMenuService.open(position, actions, that.name);
  },
}
