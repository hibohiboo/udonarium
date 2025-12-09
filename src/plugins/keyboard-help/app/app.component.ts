import { ModalService } from 'service/modal.service';
import { pluginConfig } from 'src/plugins/config';
import { HelpKeyboardComponent } from '../component/help-keyboard/help-keyboard.component';

export const useHelp = pluginConfig.isUseKeyboardShortcut;

export const openHelpEvent = (modalService: ModalService, e: KeyboardEvent) => {
  if (!pluginConfig.isUseKeyboardShortcut) return;

  if (e.key === '?') {
    openHelp(modalService);
    return true;
  }
  return false;
};
export const openHelp = (modalService: ModalService) => {
  if (!pluginConfig.isUseKeyboardShortcut) return;
   modalService.open(HelpKeyboardComponent, {
    width: 700,
    height: 400,
    left: 0,
    top: 400,
  });

};
