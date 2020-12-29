import { CardComponent } from "component/card/card.component";
const menuKey = 'm';

export default {
  keyboardHook(that, e: KeyboardEvent){
    if (e.key === menuKey) {
      if (that.modalService.isShow) { return;}
      that.onContextMenu(e);
      return true;
    }
    return false;
  },
  cardOnKeydownHook(card: {onContextMenu: any}, e: KeyboardEvent){
    e.stopPropagation();
    e.preventDefault();

    if (e.key === menuKey) {
      card.onContextMenu(e);
      return true;
    }
    return false;
  }

}
