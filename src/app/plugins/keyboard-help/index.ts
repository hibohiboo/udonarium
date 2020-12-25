import { ModalService } from "service/modal.service";
import { HelpKeyboardComponent } from "./component/help-keyboard/help-keyboard.component";

export default {
  keyboardHook(modalService:ModalService, e: KeyboardEvent){
    if (e.key === '?') {
      if (modalService.isShow) { return;}
      modalService.open(HelpKeyboardComponent, { width: 700, height: 400, left: 0, top: 400 });
      return true;
    }
    return false;
  }

}
