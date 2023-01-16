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
      const gridSize = 50;
      const offset = 16;
      const viewWidth = areaWidth - offset * 2;
      const viewHeight = areaHeight - offset * 2;

      const { width, height, left, top } = calcHeightWidth({
        naturalHeight,
        naturalWidth,
        viewWidth,
        viewHeight,
        offset
      })

      const rect = {
        scale: 1,
        width,
        height,
        left,
        top
      }
      let card = null;
      if (this.tabletopObject instanceof CardStack) {
        card = this.tabletopObject.topCard;
      } else if (this.tabletopObject instanceof Card) {
        card = this.tabletopObject;
      }
      if (card) {
        rect.scale = rect.width / (card.size * gridSize);
        rect.width = card.size * gridSize;
        rect.height = rect.width * this.naturalHeight / this.naturalWidth;
      }
      return rect;
     }
  });
}

const calcHeightWidth = (args: Record<string,number>)=>{
  const { naturalHeight, naturalWidth, viewWidth, viewHeight, offset } = args;
  if (( naturalHeight * viewWidth / naturalWidth) > viewHeight) {
    const  width = naturalWidth * viewHeight / naturalHeight;
    return { width
          , height : viewHeight
          , left : offset + (viewWidth - width) / 2
         };
  }
  const height = naturalHeight * viewWidth / naturalWidth;
  return {
      width: viewWidth
    , height
    , top : offset + (viewHeight - height) / 2
  }

}

export const isCardWritable = pluginConfig.isCardWritable;

export const onCardImageLoadCardWritable = (that: any) => {
  if (!that.cardImageElement) return;
  console.log(that.cardImageElement.nativeElement);
  that.naturalWidth = that.cardImageElement.nativeElement.naturalWidth;
  that.naturalHeight = that.cardImageElement.nativeElement.naturalHeight;
}
