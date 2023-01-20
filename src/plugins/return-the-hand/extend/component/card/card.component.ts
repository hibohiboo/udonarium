import { PeerCursor } from "@udonarium/peer-cursor";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";

export const initReturnTheHandCardComponent = (that)=>{
  if(!pluginConfig.canReturnHandToIndividualBoard) return;

}
export const handCardContextMenu = (that) => {
  if(!pluginConfig.canReturnHandToIndividualBoard) return [];
  if(!that.card.handOwner) {
    return [
      {
        name: '手札にする',
        action: ()=> {
          SoundEffect.play(PresetSound.cardDraw);
          that.card.handOwner = PeerCursor.myCursor.userId;
        }
      }
    ]
  }
  return [
    {
      name: '共用のカードにする',
      action: ()=> {
        that.card.handOwner = '';
        SoundEffect.play(PresetSound.cardDraw);
      }
    }
  ]
}

