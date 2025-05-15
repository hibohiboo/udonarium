import { Card } from '@udonarium/card';
import { Network } from '@udonarium/core/system';
import { pluginConfig } from 'src/plugins/config';

export const setAutoSelfViewCard = (card: any) => {
  if (!pluginConfig.isAutoSelfViewCard) return;
  if (card instanceof Card) {
    card.faceDown();
    card.owner = Network.peer.userId;
  }
};
