import { Card } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";
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
      return {
        scale: 2.5,
        width: 100,
        height: 150
      }
     }
  });
  Object.defineProperty(that, 'fullImageAreaRect', {
    get() {

      return {
        scale: 2.5,
        width: 100,
        height: 150
      }
     }
  });
}

export const isCardWritable = pluginConfig.isCardWritable;
