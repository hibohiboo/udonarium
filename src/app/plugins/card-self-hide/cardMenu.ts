import { Network } from '@udonarium/core/system'
import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import { ContextMenuSeparator } from 'service/context-menu.service'

export const createCardMenues = (that) => {
  const menues = []
  if (!that.isVisible || that.isHand) {
    menues.push({
      name: '表にする',
      action: () => {
        that.card.faceUp()
        SoundEffect.play(PresetSound.cardDraw)
      },
    })
  } else {
    menues.push({
      name: '裏にする',
      action: () => {
        that.card.faceDown()
        SoundEffect.play(PresetSound.cardDraw)
      },
    })
  }
  if (that.isHand) {
    menues.push({
      name: '裏にする',
      action: () => {
        that.card.faceDown()
        SoundEffect.play(PresetSound.cardDraw)
      },
    })
  } else {
    menues.push({
      name: '自分だけ見る',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw)
        that.card.faceDown()
        that.owner = Network.peerContext.userId
      },
    })
  }
  if (!that.isVisible && !that.isHand) {
    menues.push({
      name: '自分だけ隠す',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw)
        that.card.setSelfHide()
      },
    })
  }

  menues.push(ContextMenuSeparator)
  menues.push({
    name: '重なったカードで山札を作る',
    action: () => {
      that.createStack()
      SoundEffect.play(PresetSound.cardPut)
    },
  })
  menues.push(ContextMenuSeparator)
  menues.push({
    name: 'カードを編集',
    action: () => {
      that.showDetail(that.card)
    },
  })
  menues.push({
    name: 'コピーを作る',
    action: () => {
      const cloneObject = that.card.clone()
      cloneObject.location.x += that.gridSize
      cloneObject.location.y += that.gridSize
      cloneObject.toTopmost()
      SoundEffect.play(PresetSound.cardPut)
    },
  })
  menues.push({
    name: '削除する',
    action: () => {
      that.card.destroy()
      SoundEffect.play(PresetSound.sweep)
    },
  })
  return menues
}
