import { ModalService } from "service/modal.service";

export default {
  keyboardHook(that, e: KeyboardEvent){
    if (e.key === 'm') {
      if (that.modalService.isShow) { return;}
      that.onContextMenu(e);
      return true;
    }
    return false;
  }

}
