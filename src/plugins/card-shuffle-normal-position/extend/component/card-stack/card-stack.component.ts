import { pluginConfig } from "src/plugins/config";

export const cardShuffleNormalPosition = (that) => {
  if (!pluginConfig.isCardShuffleNormalPosition) return;
  that.cardStack.uprightAll();
}
