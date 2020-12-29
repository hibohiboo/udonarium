import config from './config'
import keyboardHelp from './keyboard-help'
import cardTap from './card-tap'
import postMessage from './post-message'
import insertSpreadsheet from './insert-spreadsheet'
import { getDeckMenu } from './sheet-deck'
import lily from './lily';
import type { ModalService } from 'service/modal.service'
import type { CardComponent } from 'component/card/card.component';
import type { GameTableComponent } from 'component/game-table/game-table.component'
import type { ChatMessage, ChatMessageContext } from '@udonarium/chat-message'
import type { PointerCoordinate, PointerDeviceService } from 'service/pointer-device.service'
import type { ContextMenuAction } from 'service/context-menu.service'
import type { PanelOption, PanelService } from 'service/panel.service'
import type { GameObject } from '@udonarium/core/synchronize-object/game-object'
import type { CutInLauncher } from './lily/cutin/class/cut-in-launcher'
import type { Listener } from '@udonarium/core/system/event/listener'

/**
 * テーブル上でキーボードを押したときのHook;
 *
 * @param modalService
 * @param e
 * @return boolean true: 処理中断, false: 処理継続
 */
export const gameBoardKeydownHook = (modalService:ModalService, e: KeyboardEvent) => {
  if (!config.useKeyboardHelp) { return false;}
  return keyboardHelp.keyboardHook(modalService, e)
}

// t,uでカードタップ
export const cardPointerHook = (card: CardComponent, e: PointerEvent) => {
  if (!config.useCardTap) { return false;}
  return cardTap.cardPointerHook(card, e)
}
export const cardOnKeydownHook = (card: CardComponent, e: KeyboardEvent) => {
  if (!config.useCardTap) { return false;}
  return cardTap.cardOnKeydownHook(card, e);
}

// ティラノスクリプト連携

export const appComponentConstructorHook = (listener: Listener)=>{
  if (config.usePostMessage) { postMessage.appComponentConstructorHook()}
  if (config.useLilyCutin) {lily.cutin.appComponentConstructorHook(listener);} // Cutin
}

export const updateGameObjectHook = (that: GameTableComponent)=>{
  if (!config.usePostMessage) {return false;}
  return postMessage.updateGameObjectHook(that);
}

// スプレッドシート連携
export const chatTabOnChildAddedHook = (child: ChatMessage)=>{
  if (config.usePostMessage && postMessage.chatTabOnChildAddedHook(child)) {return true;}
  if (config.useSpreadSheet && insertSpreadsheet.chatTabOnChildAddedHook(child)) {return true;}

  return false;
}

// カードデッキ追加
export const onContextMenuHook = async (menuActions: ContextMenuAction[], position: PointerCoordinate)=>{
  if(!config.useDeckSpreadSheet)return;
  menuActions.push(await getDeckMenu(position));
}

// Cutin
export const panelOpenHook = (option: PanelOption, childPanelService: PanelService) => {
  if(!config.useLilyCutin) return;
  lily.cutin.panelOpenHook(option, childPanelService);
}
export const roomInnerXmlObjectsHook = (objests: GameObject[]) => {
  if(!config.useLilyCutin) return objests;
  return lily.cutin.roomInnerXmlObjectsHook(objests);
}
export const jukeboxLauncher = ()=>{
  if(!config.useLilyCutin) return null;
  return lily.cutin.jukeboxLauncher();
}
export const jukeboxPlayBGMHook = (cutInLauncher: CutInLauncher)=>{
  if(!config.useLilyCutin) return null;
  lily.cutin.jukeboxPlayBGMHook(cutInLauncher);
}
export const jukeboxOpenCutInListHook = (pointerDeviceService: PointerDeviceService, panelService: PanelService) => {
  if(!config.useLilyCutin) return;
  lily.cutin.jukeboxOpenCutInListHook(pointerDeviceService, panelService);
}

// ダイス表
export const diceBotOnStoreAddedHook = (listener: Listener) => {
  if(config.useLilyDiceTable) {lily.diceTable.diceBotOnStoreAddedHook(listener)}
}

// ファイル

export const saveDataSaveRoomHook = (files: File[], roomXml:string, chatXml: string)=>{
  if(config.useLilyFile) return lily.file.saveDataSaveRoomHook(files, roomXml, chatXml);
  return files;
}
export const saveDataSaveGameObjectHook = (files: File[], xml: string) => {
  if(config.useLilyFile) return lily.file.saveDataSaveGameObjectHook(files, xml);
  return files;
}
export const tabletopServiceMakeDefaultTableHook = () =>{
  if(config.useLilyFile) return lily.file.tabletopServiceMakeDefaultTable();
  return false;
}
export const tableTopServiceCreateTrumpHook = (position: PointerCoordinate) => {
  if(config.useLilyFile) return lily.file.tableTopServiceCreateTrump(position);
  return false;
}
export const tableTopServiceCreateTerrainHook = (position: PointerCoordinate)=>{
  if(config.useLilyFile) return lily.file.tableTopServiceCreateTerrainHook(position);
  return false;
}
// バフ
export const tabletopServiceMakeDefaultTabletopObjectsHook = () => {
  if (config.useLilyBuff) return lily.buff.tabletopServiceMakeDefaultTabletopObjectsHook();
  return false;
}

export const tabletopServiceInitializeHook = (listener: Listener)=>{
  if (config.useLilyBuff) return lily.buff.tabletopServiceInitializeHook(listener);
}

// 立ち絵

export const chatInputGetImageFileHook = (selectCharacterTachie: any)=>{
  if(config.useLilyStand) return lily.stand.chatInputGetImageFileHook(selectCharacterTachie);
}

export const chatInputAllowsChatHook = (gameCharacter: any)=>{
  if(config.useLilyStand) return lily.stand.chatInputAllowsChatHook(gameCharacter);
}

export const chatMessageSendMessageHook = (chatMessage: ChatMessageContext, sendFrom, tachieNum?: number) =>{
  if(config.useLilyStand) return lily.stand.chatMessageSendMessageHook(chatMessage, sendFrom, tachieNum);
  return chatMessage;
}
