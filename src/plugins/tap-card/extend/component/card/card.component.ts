import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuSeparator } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";

export const tapCardContextMenu = (that) => {
  if(!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: 'カードを横にする',
      action: ()=> that.card.rotate = 90,
    },
    {
      name: 'カードを縦にする',
      action: ()=> that.card.rotate = 0,
    }
  ]
}

export const tapCardContextMenuHandStorage = (that) => {
  if(!pluginConfig.isTapCard) return [];
  return [
    ContextMenuSeparator,
    {
      name: '全てのカードを横にする',
      action: () => {
        that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
          card.rotate = 90;
        })
        SoundEffect.play(PresetSound.cardPut)
      },
    },
    {
      name: '全てのカードを縦にする',
      action: () => {
        that._calcTopObjects(that.tabletopService.cards).forEach(({obj:card})=>{
          card.rotate = 0;
        })
        SoundEffect.play(PresetSound.cardPut)
      },
    },
  ]
}
