import { initRotateOffCard } from "src/plugins/object-rotate-off/extends/class/card";
import { initCardClassForWritableText } from "src/plugins/add-card-text-writable/extend/class/card";

export const extendCard = (that:any)=>{
  initRotateOffCard(that);
  initCardClassForWritableText(that);
}
