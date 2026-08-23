import { Card } from '@udonarium/card';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuAction } from 'service/context-menu.service';
import { PointerCoordinate } from 'service/pointer-device.service';
import { pluginConfig } from 'src/plugins/config';

/**
 * 本家互換・シンプル版のブランクカード（機能B）。
 * 既存の「拡張ブランクカード」（機能A、`add-blank-card` プラグイン）は専用の同期オブジェクト型
 * `BlankCard` を使うが、こちらはただの `Card`（本家の標準クラス）に前面画像を差し替えるだけで、
 * 通常のトランプカードと型としては区別がつかない。文字入力機能も持たない
 * （文字入力は `add-card-text-writable` が別途担当する汎用機能）。
 * 詳細は docs/plans/settings-features-migration.md の0-3節参照。
 */
export const getCreateBlankCardSimpleMenu = (position: PointerCoordinate): ContextMenuAction[] => {
  if (!pluginConfig.isAddBlankCardMenuSimple) return [];

  return [{
    name: 'ブランクカードを作成（シンプル版）', action: () => {
      createBlankCardSimple(position);
      SoundEffect.play(PresetSound.cardPut);
    }
  }];
};

const createBlankCardSimple = (position: PointerCoordinate): Card => {
  const frontUrl = './assets/images/trump/blank_card.png';
  const backUrl = './assets/images/trump/z01.gif';
  let frontImage: ImageFile;
  let backImage: ImageFile;

  frontImage = ImageStorage.instance.get(frontUrl);
  if (!frontImage) {
    frontImage = ImageStorage.instance.add(frontUrl);
  }
  backImage = ImageStorage.instance.get(backUrl);
  if (!backImage) {
    backImage = ImageStorage.instance.add(backUrl);
  }
  const card = Card.create('カード', frontImage.identifier, backImage.identifier);
  card.location.x = position.x - 25;
  card.location.y = position.y - 25;
  card.posZ = position.z;
  return card;
};
