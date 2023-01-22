import { Card } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";
import { calcAreaRect } from "src/plugins/add-card-text-writable/card-text-writable";
import { pluginConfig } from "src/plugins/config";
import { StringUtilPlus } from "src/plugins/util/string-util-plus";

export const initOverviwPanelComponentForWritableText = (that:any) => {
  if(!pluginConfig.isCardWritable) return;
  Object.defineProperty(that, 'cardFontSize', {
    get() {
        let card = null;
        if (this.tabletopObject instanceof CardStack) {
          card = this.tabletopObject.topCard;
        } else if (this.tabletopObject instanceof Card) {
          card = this.tabletopObject;
        }

        return card ? card.fontsize + 9 : 18;
     }
  });
  Object.defineProperty(that, 'cardText', {
    get() {
        let card = null;
        if (this.tabletopObject instanceof CardStack) {
          card = this.tabletopObject.topCard;
        } else if (this.tabletopObject instanceof Card) {
          card = this.tabletopObject;
        }
        return card ? StringUtilPlus.rubyToHtml(StringUtilPlus.escapeHtml(card.text)) : '';
     }
  });
  Object.defineProperty(that, 'cardColor', {
    get() {
      return '#555555';
     }
  });
  Object.defineProperty(that, 'cardTextShadowCss', {
    get() {
        const shadow = StringUtilPlus.textShadowColor(this.cardColor);
        return `${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px,
        ${shadow} 0px 0px 2px`;
     }
  });
  Object.defineProperty(that, 'imageAreaRect', {
    get() {
      const naturalHeight = this.naturalHeight;
      const naturalWidth = this.naturalWidth;
      return calcAreaRect({
        naturalHeight,
        naturalWidth,
        areaWidth: 250,
        areaHeight: 330,
        tabletopObject: this.tabletopObject,
        offset: 8
      })
     }
  });
  Object.defineProperty(that, 'naturalWidth', {
    value: 0,
    writable: true
  });
  Object.defineProperty(that, 'naturalHeight', {
    value: 0,
    writable: true
  });
  Object.defineProperty(that, 'fullImageAreaRect', {
    get() {
      const naturalHeight = this.naturalHeight;
      const naturalWidth = this.naturalWidth;
      if(naturalHeight === 0 || naturalWidth === 0 ) return;
      const areaWidth = document.documentElement.clientWidth;
      const areaHeight = document.documentElement.offsetHeight;
      const offset = 16;
      return calcAreaRect({
        naturalHeight,
        naturalWidth,
        areaWidth,
        areaHeight,
        tabletopObject: this.tabletopObject,
        offset
      })
    }
  });
}



export const isCardWritable = pluginConfig.isCardWritable;

export const onCardImageLoadCardWritable = (that: any) => {
  if(!pluginConfig.isCardWritable) return;
  if (!that.cardImageElement) return;

  that.naturalWidth = that.cardImageElement.nativeElement.naturalWidth;
  that.naturalHeight = that.cardImageElement.nativeElement.naturalHeight;
}
