import { pluginConfig } from "src/plugins/config";
import { StringUtilPlus } from "src/plugins/util/string-util-plus";

export const initCardStackComponentForWritableText = (that:any) => {
  if(!pluginConfig.isCardWritable) return;
  Object.defineProperty(that, 'rubiedText', {
    get() { return StringUtilPlus.rubyToHtml(StringUtilPlus.escapeHtml(this.topCard.text)); },
  });
}

export const isCardWritable = pluginConfig.isCardWritable;
