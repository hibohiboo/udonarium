import { Network } from "@udonarium/core/system";
import { pluginConfig } from "src/plugins/config";


export const setAutoSelfViewCardFromDeck = (card:any) =>{
  if(!pluginConfig.isAutoSelfViewCardFromDeck)return;
  card.faceDown();
  card.owner = Network.peer.userId;
}
