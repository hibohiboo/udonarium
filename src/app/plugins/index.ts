import { ModalService } from 'service/modal.service'
import keyboardHelp from './keyboard-help'
import config from './config'

/**
 * テーブル上でキーボードを押したときのHook;
 *
 * @param modalService
 * @param e
 * @return boolean true: 処理中断, false: 処理継続
 */
export const keydownHook = (modalService:ModalService, e: KeyboardEvent) => {
  if (!config.useKeyboardHelp()) { return false;}
  return keyboardHelp.keyboardHook(modalService, e)
}
