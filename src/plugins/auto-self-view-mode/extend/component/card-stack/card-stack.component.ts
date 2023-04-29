import { Network } from "@udonarium/core/system";
import { pluginConfig } from "src/plugins/config";
let isContextMenuAutoSelfViewCardFromDeck = false;

export const setAutoSelfViewCardFromDeck = (card:any) =>{
  if(!pluginConfig.isAutoSelfViewCardFromDeck && !isContextMenuAutoSelfViewCardFromDeck)return;
  card.faceDown();
  card.owner = Network.peer.userId;
}

export const addContextMenuAutoSelfViewCardFromDeck = ()=>{
  if(!pluginConfig.isContextMenuAutoSelfViewCardFromDeck) return [];
  if(isContextMenuAutoSelfViewCardFromDeck){
    return [{
      name: '✅ 引いたカードを自分だけ見る', action: () => {
        isContextMenuAutoSelfViewCardFromDeck = false;
      }
    }]
  }
  return [{
    name: '☐ 引いたカードを自分だけ見る', action: () => {
      isContextMenuAutoSelfViewCardFromDeck = true;
    }
  }]
}
