import { Card } from '@udonarium/card';
import { pluginConfig } from 'src/plugins/config';

interface TopOfCard {
  card: Card;
  distanceX: number;
  distanceY: number;
  distanceZ: number;
}

/** 移動中のカードの上に重なっている（zindexが大きい）カードの一覧。1枚のドラッグ操作中だけ有効 */
let topOfCards: TopOfCard[] = [];

/**
 * カードの移動開始時に呼ぶ。移動するカードの上に重なっているカードを記録しておき、
 * endMoveStackedCard で一緒に追従移動させる。
 * 呼び出し元では `card.toTopmost()` より先に呼ぶ必要がある
 * （toTopmost() の後だと zindex が変わり、「上に乗っている」判定ができなくなるため）。
 */
export const startMoveStackedCard = (that: any) => {
  if (!pluginConfig.isMoveStackedCard) return;
  topOfCards = [];
  for (const card of that.tabletopService.cards) {
    const distanceX = card.location.x - that.card.location.x;
    const distanceY = card.location.y - that.card.location.y;
    const distanceZ = card.posZ - that.card.posZ;
    const distance: number = distanceX ** 2 + distanceY ** 2 + distanceZ ** 2;

    if (distance < 100 ** 2 && that.zindex < card.zindex) {
      topOfCards.push({ card, distanceX, distanceY, distanceZ });
    }
  }
};

/** カードの移動終了時に呼ぶ。startMoveStackedCard で記録した重なりカードを追従させる。 */
export const endMoveStackedCard = (that: { card: Card }) => {
  if (!pluginConfig.isMoveStackedCard) return;

  for (const topOfCard of topOfCards) {
    topOfCard.card.location.x = that.card.location.x + topOfCard.distanceX;
    topOfCard.card.location.y = that.card.location.y + topOfCard.distanceY;
    topOfCard.card.posZ = that.card.posZ + topOfCard.distanceZ;
    topOfCard.card.toTopmost();
  }
  topOfCards = [];
};
