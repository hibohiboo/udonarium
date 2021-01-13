import config from './config'
import keyboardHelp from './keyboard-help'
import cardTap from './card-tap'
import postMessage from './post-message'
import insertSpreadsheet from './insert-spreadsheet'
import { getDeckMenu } from './sheet-deck'
import lily from './lily'
import keyboardShortcut from './keyboard-shortcut'
import cardOnTopMove from './card-on-top-move'
import handStorage from './hand-storage'
import type { GameTableComponent } from 'component/game-table/game-table.component'
import type { ChatMessage, ChatMessageContext } from '@udonarium/chat-message'
import type {
  PointerCoordinate,
  PointerDeviceService,
} from 'service/pointer-device.service'
import type { ContextMenuAction } from 'service/context-menu.service'
import type { PanelOption, PanelService } from 'service/panel.service'
import type { GameObject } from '@udonarium/core/synchronize-object/game-object'
import type { CutInLauncher } from './lily/cutin/class/cut-in-launcher'
import type { Listener } from '@udonarium/core/system/event/listener'
import type { GameCharacter } from '@udonarium/game-character'
import type { TabletopObject } from '@udonarium/tabletop-object'
import type { GameTable } from '@udonarium/game-table'

/**
 * テーブル上でキーボードを押したときのHook;
 *
 * @param modalService
 * @param e
 * @return boolean true: 処理中断, false: 処理継続
 */
export const gameBoardKeydownHook = (that, e: KeyboardEvent) => {
  let ret = false
  if (config.useKeyboardHelp) {
    ret = keyboardHelp.keyboardHook(that.modalService, e)
  }
  if (!ret && config.useKeyboardShortcut) {
    ret = keyboardShortcut.keyboardHook(that, e)
  }

  return ret
}

// t,uでカードタップ
export const cardPointerHook = (card: { rotate: number }, e: PointerEvent) => {
  if (!config.useCardTap) {
    return false
  }
  return cardTap.cardPointerHook(card, e)
}
export const cardOnKeydownHook = (
  card: { rotate: number; onContextMenu: any },
  e: KeyboardEvent,
) => {
  let ret = false
  if (config.useCardTap) {
    ret = cardTap.cardOnKeydownHook(card, e)
  }
  if (!ret && config.useKeyboardShortcut) {
    ret = keyboardShortcut.cardOnKeydownHook(card, e)
  }
  return ret
}

// キーボードショートカット
export const terrainOnKeydownHook = (that, e) => {
  let ret = false
  if (config.useKeyboardShortcut) {
    ret = keyboardShortcut.terrainOnKeydownHook(that, e)
  }
  return ret
}

export const characterOnKeydownHook = (that, e) => {
  let ret = false
  if (config.useKeyboardShortcut) {
    ret = keyboardShortcut.characterOnKeydownHook(that, e)
  }
  return ret
}

// 重ねカード移動

export const cardComponentOnInputStartHook = (that) => {
  if (config.useCardOnTopMove) {
    cardOnTopMove.cardComponentOnInputStartHook(that)
  }
}

export const cardComponentDispatchCardDropEventHook = (that) => {
  if (config.useCardOnTopMove) {
    cardOnTopMove.cardComponentDispatchCardDropEventHook(that)
  }
}

// ティラノスクリプト連携

export const appComponentConstructorHook = (listener: Listener) => {
  if (config.usePostMessage) {
    postMessage.appComponentConstructorHook()
  }
  if (config.useLilyCutin) {
    lily.cutin.appComponentConstructorHook(listener)
  } // Cutin
}

export const updateGameObjectHook = (that: GameTableComponent) => {
  if (!config.usePostMessage) {
    return false
  }
  return postMessage.updateGameObjectHook(that)
}

// スプレッドシート連携
export const chatTabOnChildAddedHook = (child: ChatMessage) => {
  if (config.usePostMessage && postMessage.chatTabOnChildAddedHook(child)) {
    return true
  }
  if (
    config.useSpreadSheet &&
    insertSpreadsheet.chatTabOnChildAddedHook(child)
  ) {
    return true
  }

  return false
}

export const onContextMenuHook = async (
  menuActions: ContextMenuAction[],
  position: PointerCoordinate,
  that
) => {
  // カードデッキ追加
  if (config.useDeckSpreadSheet){
    try {
      menuActions.push(await getDeckMenu(position))
    } catch(e){
      console.error(e)
    }
  }
  // カード置き場
  if (config.useHandStorage) {
    menuActions.push(handStorage.onContextMenuHook(that))
  }

}

/// --------------------------------------------------------------------------------------------------------------
// ユドナリウム リリィ
/// --------------------------------------------------------------------------------------------------------------

// Cutin
export const panelOpenHook = (
  option: PanelOption,
  childPanelService: PanelService,
) => {
  if (!config.useLilyCutin) return
  lily.cutin.panelOpenHook(option, childPanelService)
}
export const roomInnerXmlObjectsHook = (objests: GameObject[]) => {
  if (!config.useLilyCutin) return objests
  return lily.cutin.roomInnerXmlObjectsHook(objests)
}
export const jukeboxLauncher = () => {
  if (!config.useLilyCutin) return null
  return lily.cutin.jukeboxLauncher()
}
export const jukeboxPlayBGMHook = (cutInLauncher: CutInLauncher) => {
  if (!config.useLilyCutin) return null
  lily.cutin.jukeboxPlayBGMHook(cutInLauncher)
}
export const jukeboxOpenCutInListHook = (
  pointerDeviceService: PointerDeviceService,
  panelService: PanelService,
) => {
  if (!config.useLilyCutin) return
  lily.cutin.jukeboxOpenCutInListHook(pointerDeviceService, panelService)
}

// ダイス表
export const diceBotOnStoreAddedHook = (listener: Listener) => {
  if (config.useLilyDiceTable) {
    lily.diceTable.diceBotOnStoreAddedHook(listener)
  }
}

// ファイル

export const saveDataSaveRoomHook = (
  files: File[],
  roomXml: string,
  chatXml: string,
) => {
  if (config.useLilyFile)
    return lily.file.saveDataSaveRoomHook(files, roomXml, chatXml)
  return files
}
export const saveDataSaveGameObjectHook = (files: File[], xml: string) => {
  if (config.useLilyFile)
    return lily.file.saveDataSaveGameObjectHook(files, xml)
  return files
}
export const tabletopServiceMakeDefaultTableHook = () => {
  if (config.useLilyFile) return lily.file.tabletopServiceMakeDefaultTable()
  return false
}
export const tableTopServiceCreateTrumpHook = (position: PointerCoordinate) => {
  if (config.useLilyFile) return lily.file.tableTopServiceCreateTrump(position)
  return false
}
export const tableTopServiceCreateTerrainHook = (
  viewTable: GameTable,
  position: PointerCoordinate,
) => {
  if (config.useLilyFile)
    return lily.file.tableTopServiceCreateTerrainHook(viewTable, position)
  return false
}

// リモコン
export const gameObjectInventoryOnContextMenuHook = (
  menuActions: ContextMenuAction[],
  panelService: PanelService,
  gameObject: GameCharacter,
  position: PointerCoordinate,
) => {
  if (config.useLilyRemocon) {
    lily.remocon.gameObjectOnContextMenuHook(
      menuActions,
      panelService,
      gameObject,
      position,
    )
  }
}
export const gameCharacterOnContextMenuHook = (
  panelService: PanelService,
  gameObject: GameCharacter,
  position: PointerCoordinate,
) => {
  if (config.useLilyRemocon) {
    return lily.remocon.gameCharacterComponentAddContextMenu(
      panelService,
      gameObject,
      position,
    )
  }
  return []
}

// バフ
export const tabletopServiceMakeDefaultTabletopObjectsHook = () => {
  if (config.hideSample) return true // サンプルを初期表示させない
  if (config.useLilyBuff)
    return lily.buff.tabletopServiceMakeDefaultTabletopObjectsHook()

  return false
}

export const tabletopServiceInitializeHook = (listener: Listener) => {
  if (config.useLilyBuff)
    return lily.buff.tabletopServiceInitializeHook(listener)
}

// 発言の可否を設定

export const chatInputAllowsChatHook = (
  gameCharacter: GameCharacter,
  peerId: string,
) => {
  if (config.useLilyTalkFlg)
    return lily.stand.chatInputAllowsChatHook(gameCharacter, peerId)
}

// インベントリの表示/非表示を設定
export const gameObjectInventoryComponentGetGameObjectsHook = (
  inventoryType: string,
  objects: TabletopObject[],
) => {
  if (config.useLilyHideInventoryFlg) {
    return lily.stand.gameObjectInventoryComponentGetGameObjectsHook(
      inventoryType,
      objects,
    )
  }
  return false
}

// 立ち絵

export const chatInputGetImageFileHook = (selectCharacterTachie: any) => {
  if (config.useLilyStand)
    return lily.stand.chatInputGetImageFileHook(selectCharacterTachie)
}

export const chatMessageSendMessageHook = (
  chatMessage: ChatMessageContext,
  sendFrom,
  tachieNum?: number,
  _color?: string
) => {
  let ret = chatMessage
  if (config.useLilyStand)
    ret = lily.stand.chatMessageSendMessageHook(
      chatMessage,
      sendFrom,
      tachieNum,
    )
  if (config.useLilyMessageColor) {
    const messColor =  _color ? _color : '#000000'
    return {...ret, messColor }
  }

  return ret
}

export const chatTabAddMessageHook = (that, message: ChatMessageContext) => {
  if (config.useLilyStand)
    return lily.stand.chatTabAddMessageHook(that, message)
  return false
}
