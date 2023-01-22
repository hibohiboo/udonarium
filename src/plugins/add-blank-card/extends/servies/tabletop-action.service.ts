import { Card } from "@udonarium/card";
import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuAction } from "service/context-menu.service";
import { PointerCoordinate } from "service/pointer-device.service";
import { pluginConfig } from "src/plugins/config";
// import { ImageTag } from '@udonarium/image-tag';

export const getCreateBlankCardMenu = (position: PointerCoordinate): ContextMenuAction[] => {
  if (!pluginConfig.addBlankCardAddContextMenu) return [];

  return [{
    name: 'ブランクカードを作成', action: () => {
      createBlankCard(position);
      SoundEffect.play(PresetSound.cardPut);
    }
  }]
}
const createBlankCard = (position: PointerCoordinate): Card => {
  const frontUrl = './assets/images/trump/blank_card.png';
  const backUrl = './assets/images/trump/z01.gif';
  let frontImage: ImageFile;
  let backImage: ImageFile;

  frontImage = ImageStorage.instance.get(frontUrl);
  if (!frontImage) {
    frontImage = ImageStorage.instance.add(frontUrl);
    // ImageTag.create(frontImage.identifier).tag = '*default カード';
  }
  backImage = ImageStorage.instance.get(backUrl);
  if (!backImage) {
    backImage = ImageStorage.instance.add(backUrl);
    // ImageTag.create(backImage.identifier).tag = '*default カード';
  }
  let card = Card.create('カード', frontImage.identifier, backImage.identifier);
  card.location.x = position.x - 25;
  card.location.y = position.y - 25;
  card.posZ = position.z;
  return card;
}
