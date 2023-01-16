import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { pluginConfig } from "src/plugins/config";

export const drawNCardsContextMenu = (that) => {
  if(!pluginConfig.isDrawNCards) return [];
  return [
    {
      name: 'カードを引く',
      action: null,
      subActions: [2, 3, 4, 5, 10].map((n) => {
        return {
          name: `${n}枚`,
          action: () => {
            for (let i = 0; i < n; i++) {
              if (that.drawCard() != null) {
                if (i == 0 || i == 3 || i == 9)
                  SoundEffect.play(PresetSound.cardDraw)
              } else {
                break
              }
            }
          },
        }
      }),
    }
  ]
}
