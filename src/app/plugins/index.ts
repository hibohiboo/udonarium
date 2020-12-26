import config from './config'
import keyboardHelp from './keyboard-help'
import cardTap from './card-tap'
import postMessage from './post-message'
import insertSpreadsheet from './insert-spreadsheet'
import { getDeckMenu } from './sheet-deck'
import type { ModalService } from 'service/modal.service'
import type { CardComponent } from 'component/card/card.component';
import type { GameTableComponent } from 'component/game-table/game-table.component'
import type { ChatMessage } from '@udonarium/chat-message'
import type { PointerCoordinate } from 'service/pointer-device.service'
import type { ContextMenuAction } from 'service/context-menu.service'

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
export const appRunOutsideAngularHook = ()=>{
  if (!config.usePostMessage) {return false;}
  return postMessage.appRunOutsideAngular()
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
