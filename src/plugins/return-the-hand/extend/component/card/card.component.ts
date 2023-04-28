import { PeerCursor } from "@udonarium/peer-cursor";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
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

export const handCardContextMenuHandStorage = (that) => {
  if(!pluginConfig.canReturnHandToIndividualBoard) return [];

    return [
      {
        name: '全て手札にする',
        action: ()=> {
          that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
            card.handOwner = PeerCursor.myCursor.userId;
          })
          SoundEffect.play(PresetSound.cardDraw);
        }
      }
    , {
        name: '全て共用のカードにする',
        action: ()=> {
          that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
            card.handOwner = '';
          })
          SoundEffect.play(PresetSound.cardDraw);
        }
      }
   ]
}

export const selectedHandCardContextMenu = (selectedCards) => {
  if(!pluginConfig.canReturnHandToIndividualBoard) return [];
    return [
      ContextMenuSeparator,
      {
        name: '全て手札にする',
        action: ()=> {
          SoundEffect.play(PresetSound.cardDraw);
          selectedCards().forEach(card => {
            card.handOwner = PeerCursor.myCursor.userId;
          });
        }
      },
      {
        name: '全て共用のカードにする',
        action: ()=> {
          SoundEffect.play(PresetSound.cardDraw);
          selectedCards().forEach(card => {
            card.handOwner = '';
          });
        }
      },
    ]

}
