import config from './config'
import keyboardHelp from './plus/keyboard-help'
import cardTap from './plus/card-tap'
import postMessage from './plus/post-message'
import insertSpreadsheet from './plus/insert-spreadsheet'
import { getDeckMenu } from './plus/sheet-deck'
import lily from './lily'
import lilyPlus from './lily-plus'
import keyboardShortcut from './plus/keyboard-shortcut'
import cardOnTopMove from './plus/card-on-top-move'
import handStorage from './plus/hand-storage'
import cardContextMenu from './card-context-menu'
import * as utility from './utility'
import withFly from './with-fly'
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
  that,
) => {
  // カードデッキ追加
  if (config.useDeckSpreadSheet) {
    try {
      menuActions.push(await getDeckMenu(position))
    } catch (e) {
      console.error(e)
    }
  }
  // カード置き場
  if (config.useHandStorage) {
    menuActions.push(handStorage.onContextMenuHook(position))
  }
}

// that = ChatInputComponent
export const chatInputInitHook = (that) => {
  if (config.useDicebot) {
    // 少し待たないと、Opal is not definedのエラーが出る
    setTimeout(() => {
      const gameType = utility.getQueryValue('use_dicebot')
      that.gameType = gameType
      that.loadDiceBot(gameType)
    }, 200)
  }
}

// 自分以外だけみせる
export const cardComponentOnContextMenuHook = (that, position) => {
  if (config.useCardOnlySelfHide || config.useCardGMView) {
    cardContextMenu.cardComponentOnContextMenuHook(that, position)
    return true
  }
  return false
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
  that, // gamecharactercomponent
  position: PointerCoordinate,
) => {
  let ret = []
  if (config.useLilyRemocon) {
    ret = lily.remocon.gameCharacterComponentAddContextMenu(
      that.panelService,
      that.gameCharacter,
      position,
    )
  }
  if (config.useWithFlyOpenUrl) {
    ret = [
      ...ret,
      ...withFly.openUrl.gameCharacterComponentAddContextMenu(that),
    ]
  }
  return ret
}

// バフ
export const tabletopServiceMakeDefaultTabletopObjectsHook = () => {
  if (config.hideSample) return true // サンプルを初期表示させない
  if (config.useLilyPlusStandChatChange) return lilyPlus.stand.tabletopServiceMakeDefaultTabletopObjectsHook()
  if (config.useLilyBuff)
    return lily.buff.tabletopServiceMakeDefaultTabletopObjectsHook()

  return false
}

export const tabletopServiceInitializeHook = (listener: Listener) => {
  if (config.useLilyBuff) lily.buff.tabletopServiceInitializeHook(listener)
  if (config.useWithFlyOpenUrl)
    withFly.openUrl.tabletopServiceInitializeHook(listener)
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
  _color?: string,
) => {
  let ret = chatMessage
  if (config.useLilyStand)
    ret = lily.stand.chatMessageSendMessageHook(
      chatMessage,
      sendFrom,
      tachieNum,
    )
  if (config.useLilyMessageColor) {
    const messColor = _color ? _color : '#000000'
    return { ...ret, messColor }
  }

  return ret
}

export const chatTabAddMessageHook = (that, message: ChatMessageContext) => {
  if (config.useLilyStand)
    return lily.stand.chatTabAddMessageHook(that, message)
  return false
}

/// --------------------------------------------------------------------------------------------------------------
// ユドナリウム with fly
/// --------------------------------------------------------------------------------------------------------------

export const gameTableComponentInitHook = (that, listener: Listener) => {
  if (config.useWithFlyResetPoint) {
    listener.on('RESET_POINT_OF_VIEW', (event) => {
      that.isTransformMode = false
      that.pointerDeviceService.isDragging = false

      that.viewRotateX = 0
      that.viewRotateY = 0
      that.viewPotisonX = 0
      that.viewPotisonY = 0
      that.viewRotateZ = 0
      if (!(event?.data === 'rotate')) {
        that.viewPotisonZ = 0
      }

      if (
        !config.use2dMode &&
        event?.data !== 'top' &&
        event?.data !== 'rotate'
      ) {
        that.setTransform(100, 0, 0, 50, 0, 10)
      } else {
        that.setTransform(0, 0, 0, 0, 0, 0)
      }
      that.removeFocus()
    })
  }
  return false
}

export const diceSymbolComponentInitHook = (that, listener: Listener) => {
  if (config.useWithFlyDiceAllOpen) {
    withFly.diceAllOpen.diceSymbolComponentInitHook(that, listener)
  }
}

export const cardStackComponentOnContextMenuHook = (that, position) => {
  let ret = false
  if (config.useWithFlyCardNdraw) {
    withFly.cardNDraw.cardStackComponentOnContextMenuHook(that, position)
    ret = true
  }
  return ret
}

export const terrainComponentOnContextMenuHook = (that) => {
  let ret = false
  if (config.useWithFlyContextMenuHeightTerrain) {
    withFly.contextMenuHeight.terrainComponentOnContextMenuHook(that)
    ret = true
  }
  return ret
}
