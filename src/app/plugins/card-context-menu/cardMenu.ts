import { ChatMessageContext } from '@udonarium/chat-message'
import { ChatTab } from '@udonarium/chat-tab'
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store'
import { Network } from '@udonarium/core/system'
import { PeerCursor } from '@udonarium/peer-cursor'
import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import { ContextMenuSeparator } from 'service/context-menu.service'
import config from 'src/app/plugins/config'
import * as pluginConstants from 'src/app/plugins/constants'

export const createCardMenues = (that) => {
  const [firstTab] = that.chatMessageService.chatTabs

  const menues = []
  if (!that.isVisible || that.isHand) {
    menues.push({
      name: '表にする',
      action: () => {
        that.card.faceUp()
        SoundEffect.play(PresetSound.cardDraw)
      },
    })
  } else if (PeerCursor.myCursor.isCardGMView && !that.isFront) {
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
  if (config.useCardOnlySelfHide && !that.isVisible && !that.isHand) {
    menues.push({
      name: '自分だけ隠す',
      action: () => {
        SoundEffect.play(PresetSound.cardDraw)
        that.card.setSelfHide()
      },
    })
  }

  menues.push(ContextMenuSeparator)
  if (config.useCardGMView) {
    if (!PeerCursor.myCursor.isCardGMView) {
      menues.push({
        name: '全ての裏カードを見る',
        action: () => {
          SoundEffect.play(PresetSound.cardDraw)
          PeerCursor.myCursor.isCardGMView = true
          sendSystemChatMessage(
            `${PeerCursor.myCursor.name}は全ての裏カードを見ることができます。`,
            firstTab.identifier
          )
        },
      })
    } else {
      menues.push({
        name: '裏カードを見るのをやめる',
        action: () => {
          SoundEffect.play(PresetSound.cardDraw)
          PeerCursor.myCursor.isCardGMView = false
          sendSystemChatMessage(
            `${PeerCursor.myCursor.name}は裏カードを見ることができなくなりました。`,
            firstTab.identifier
          )
        },
      })
    }
    menues.push(ContextMenuSeparator)
  }

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

const getTimeStamp = () => {
  const timeOffset: number = Date.now()
  const performanceOffset: number = performance.now()
  return Math.floor(timeOffset + (performance.now() - performanceOffset))
}

const sendSystemChatMessage = (text: string, tabIdentifier: string) => {
  const diceBotMessage: ChatMessageContext = {
    identifier: '',
    tabIdentifier,
    originFrom: Network.peerContext.userId,
    from: pluginConstants.systemChatIdentifier,
    timestamp: getTimeStamp(),
    imageIdentifier: '',
    tag: 'system',
    name: pluginConstants.systemChatName,
    text,
  }

  const chatTab = ObjectStore.instance.get<ChatTab>(tabIdentifier)
  if (chatTab) chatTab.addMessage(diceBotMessage)
}
