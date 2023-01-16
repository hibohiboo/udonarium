import { pluginConfig } from "src/plugins/config";
import { StringUtilPlus } from "src/plugins/util/string-util-plus";
import { CardStackListComponentExtendPlus } from "../card-stack-list/card-stack-list.component";

export const initCardStackComponentForWritableText = (that:any) => {
  if(!pluginConfig.isCardWritable) return;
  Object.defineProperty(that, 'rubiedText', {
    get() { return StringUtilPlus.rubyToHtml(StringUtilPlus.escapeHtml(this.topCard.text)); },
  });
}

export const isCardWritable = pluginConfig.isCardWritable;

export const showStackListWritableText = (that, option, gameObject) => {
  if(!pluginConfig.isCardWritable) return false;
  let component = that.panelService.open(CardStackListComponentExtendPlus, option);
  component.cardStack = gameObject;
  return true;
}
