import { Network } from "@udonarium/core/system";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
import { setAutoSelfViewCard } from "src/plugins/auto-self-view-mode/extend/component/hand-storage.component";
import { pluginConfig } from "src/plugins/config";


export const returnHandCardContextMenu = (that) => {
  if(!pluginConfig.canReturnHandToIndividualBoard) return [];

    return [
      ContextMenuSeparator,
      {
        name: that.handStorage.owner ? '手札を回収する' : '共用のカードを回収する',
        action: ()=> {
          SoundEffect.play(PresetSound.cardDraw);
          const owner = that.handStorage.owner;
          const x = that.handStorage.location.x;
          const y = that.handStorage.location.y;
          that.tabletopService.cards.filter(card => card.handOwner === owner).forEach((card, i) => {
            card.location.x = x + i * 55*2;
            card.location.y = y;
            card.update();
            if(owner === Network.peer.userId && that.handStorage.isVirtualScreen){
              setAutoSelfViewCard(card)
            }
          })
        }
      },
      {
        name: 'ランダムに並べる',
        action: ()=> {
          SoundEffect.play(PresetSound.cardDraw);
          const owner = that.handStorage.owner;
          const x = that.handStorage.location.x;
          const y = that.handStorage.location.y;


          // ボード上のカードを取得
          const cloneArray = [...that._calcTopObjects(that.tabletopService.cards).map(({obj})=>obj)];

          // ランダムに並べる
          const result = cloneArray.reduce((_,cur,idx) => {
            let rand = Math.floor(Math.random() * (idx + 1));
            cloneArray[idx] = cloneArray[rand]
            cloneArray[rand] = cur;
            return cloneArray
          })
          result.forEach((card, i) => {
            card.location.x = x + i * 55*2;
            card.location.y = y;
            card.update();
            if(owner === Network.peer.userId && that.handStorage.isVirtualScreen){
              setAutoSelfViewCard(card)
            }
          })
        }
      }
    ]
}

