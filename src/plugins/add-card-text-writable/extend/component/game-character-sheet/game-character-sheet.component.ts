import { Card } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";
import { pluginConfig } from "src/plugins/config";
import { StringUtilPlus } from "src/plugins/util/string-util-plus";

export const initGameCharacterSheetComponentForWritableText = (that:any) => {
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
      // let card = null;
      // if (this.tabletopObject instanceof CardStack) {
      //   card = this.tabletopObject.topCard;
      // } else if (this.tabletopObject instanceof Card) {
      //   card = this.tabletopObject;
      // }
      // return card ? card.color : '#555555';
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
  Object.defineProperty(that, 'imageAreaRreact', {
    get() {
      // const calcImageAreaRect = (areaWidth: number, areaHeight: number, offset: number): {width: number, height: number, top: number, left: number, scale: number} => {
      //     const rect = {width: 0, height: 0, top: offset, left: offset, scale: 1};
      //     if (this.naturalWidth == 0 || this.naturalHeight == 0) return rect;

      //     let card = null;
      //     if (this.tabletopObject instanceof CardStack) {
      //       card = this.tabletopObject.topCard;
      //     } else if (this.tabletopObject instanceof Card) {
      //       card = this.tabletopObject;
      //     }
      //     if (card) {
      //       rect.scale = rect.width / (card.size * this.gridSize);
      //       rect.width = card.size * this.gridSize;
      //       rect.height = rect.width * this.naturalHeight / this.naturalWidth;
      //     }
      //     return rect;
      // };

      // return calcImageAreaRect(this.mainImageWidth, this.mainImageHeight, 0);

      return {
        scale: 2.5,
        width: 100,
        height: 150
      }
     }
  });
}

export const isCardWritable = pluginConfig.isCardWritable;
