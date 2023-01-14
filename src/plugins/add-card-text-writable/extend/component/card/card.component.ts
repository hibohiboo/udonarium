import { pluginConfig } from "src/plugins/config";
import { StringUtilPlus } from "src/plugins/util/string-util-plus";

export const initCardComponentForWritableText = (that:any) => {
  if(!pluginConfig.isCardWritable) return;
  Object.defineProperty(that, 'text', {
    get():string { return this.card.text; },
    set(text: string) { this.card.text = text; }
  });
  Object.defineProperty(that, 'fontSize', {
    get():number { return this.card.fontsize; },
    set(fontSize: number) { this.card.fontsize = fontSize; }
  });
  Object.defineProperty(that, 'rubiedText', {
    get() { return StringUtilPlus.rubyToHtml(StringUtilPlus.escapeHtml(this.text)); },
  });
}

export const isCardWritable = pluginConfig.isCardWritable;
