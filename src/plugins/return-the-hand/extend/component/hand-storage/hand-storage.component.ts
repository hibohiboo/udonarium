import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
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
            card.location.x = x + i * 20;
            card.location.y = y;
            card.update();
          })
        }
      }
    ]

}
