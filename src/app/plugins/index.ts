import config from './config'
import keyboardHelp from './keyboard-help'
import cardTap from './card-tap'
import postMessage from './post-message'
import type { ModalService } from 'service/modal.service'
import type { CardComponent } from 'component/card/card.component';
import type { GameTableComponent } from 'component/game-table/game-table.component'
import type { ChatMessage } from '@udonarium/chat-message'

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

export const cardPointerHook = (card: CardComponent, e: PointerEvent) => {
  if (!config.useCardTap) { return false;}
  return cardTap.cardPointerHook(card, e)
}
export const cardOnKeydownHook = (card: CardComponent, e: KeyboardEvent) => {
  if (!config.useCardTap) { return false;}
  return cardTap.cardOnKeydownHook(card, e);
}
export const appRunOutsideAngularHook = ()=>{
  if (!config.usePostMessage) {return false;}
  return postMessage.appRunOutsideAngular()
}
export const updateGameObjectHook = (that: GameTableComponent)=>{
  if (!config.usePostMessage) {return false;}
  return postMessage.updateGameObjectHook(that);
}
export const chatTabOnChildAddedHook = (child: ChatMessage)=>{
  if (!config.usePostMessage) {return false;}
  return postMessage.chatTabOnChildAddedHook(child)
}
