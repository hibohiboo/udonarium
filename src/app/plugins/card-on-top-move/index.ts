import { Card } from "@udonarium/card";

interface TopOfCard {
  card: Card,
  distanceX: number,
  distanceY: number,
  distanceZ: number
}
export default {
  // that = CardComponent
  cardComponentOnInputStartHook(that){
    that.topOfCards = [];
    for (const card of that.tabletopService.cards){
      const distanceX = card.location.x - that.card.location.x
      const distanceY = card.location.y - that.card.location.y
      const distanceZ = card.posZ - that.card.posZ
      let distance: number = distanceX ** 2 + distanceY ** 2 + distanceZ ** 2;

      if(distance < 100 ** 2 && that.zindex < card.zindex){
        that.topOfCards.push({card, distanceX, distanceY, distanceZ})
      }
    }
  },
  cardComponentDispatchCardDropEventHook(that: {topOfCards:TopOfCard[], card: Card}){
    for(const topOfCard of that.topOfCards){
      topOfCard.card.location.x = that.card.location.x + topOfCard.distanceX;
      topOfCard.card.location.y = that.card.location.y + topOfCard.distanceY;
      topOfCard.card.posZ = that.card.posZ + topOfCard.distanceZ;
      topOfCard.card.toTopmost();
      // topOfCard.card.update();
    }
    that.topOfCards = [];
  }
}
