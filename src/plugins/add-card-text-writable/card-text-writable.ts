import { Card } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";

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
export const calcAreaRect = (args: {
  naturalHeight: number,
  naturalWidth: number,
  areaWidth: number,
  areaHeight: number,
  offset: number,
  tabletopObject: any
}) => {
  const {
      naturalHeight, naturalWidth,areaWidth, areaHeight
    , tabletopObject, offset = 0 } = args;
  if( naturalHeight === 0 || naturalWidth === 0 ) return {
    scale: 1,
    width: 0,
    height: 0,
    left: 0,
    top: 0
  };
  const gridSize = 50;
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
  if (tabletopObject instanceof CardStack) {
    card = tabletopObject.topCard;
  } else if (tabletopObject instanceof Card) {
    card = tabletopObject;
  }
  if (card) {
    rect.scale = rect.width / (card.size * gridSize);
    rect.width = card.size * gridSize;
    rect.height = rect.width * naturalHeight / naturalWidth;
  }
  return rect;
 }

