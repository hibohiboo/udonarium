import { initRotateOffTextNote } from "src/plugins/object-rotate-off/extends/class/text-note";
import { addSyncIsUpright } from "src/plugins/text-note-upright-flat/extend/class/text-note";

export const extendTextNote = (that:any)=>{
  initRotateOffTextNote(that);
  addSyncIsUpright(that);
}
