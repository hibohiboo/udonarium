import { Card } from "@udonarium/card"
import { pluginConfig } from "src/plugins/config"

interface TopOfCard {
  card: Card
  distanceX: number
  distanceY: number
  distanceZ: number
}

let topOfCards:TopOfCard[] = [];
export const startMoveStackedCard = (that:any) => {
  if(!pluginConfig.isMoveStackedCard) return;
  topOfCards = [];
  for (const card of that.tabletopService.cards) {

    const distanceX = card.location.x - that.card.location.x
    const distanceY = card.location.y - that.card.location.y
    const distanceZ = card.posZ - that.card.posZ
    const distance: number = distanceX ** 2 + distanceY ** 2 + distanceZ ** 2

    if (distance < 100 ** 2 && that.zindex < card.zindex) {
      topOfCards.push({ card, distanceX, distanceY, distanceZ })
    }
  }
}

export const endMoveStackedCard = (that: {card: Card }) => {
  if(!pluginConfig.isMoveStackedCard) return;

  for (const topOfCard of topOfCards) {
    topOfCard.card.location.x = that.card.location.x + topOfCard.distanceX
    topOfCard.card.location.y = that.card.location.y + topOfCard.distanceY
    topOfCard.card.posZ = that.card.posZ + topOfCard.distanceZ
    topOfCard.card.toTopmost()
  }
  topOfCards = [];
}
