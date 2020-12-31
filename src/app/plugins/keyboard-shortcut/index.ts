import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import * as constants from 'src/app/plugins/constants';
import { showRemoteController } from '../lily/controller';
import config from 'src/app/plugins/config';
import { Network } from '@udonarium/core/system';

const menuKey = 'm'

export default {
  keyboardHook(that, e: KeyboardEvent) {
    if (e.key === menuKey) {
      if (that.modalService.isShow) {
        return false
      }
      that.onContextMenu(e)
      return true
    }
    return false
  },
  cardOnKeydownHook(card: { onContextMenu: any }, e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === menuKey) {
      card.onContextMenu(e)
      return true
    }
    return false
  },
  // thatはterraincomponent
  terrainOnKeydownHook(that, e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === constants.terrainCopyKey) {
      let cloneObject = that.terrain.clone();
      cloneObject.location.x += that.gridSize;
      cloneObject.location.y += that.gridSize;
      cloneObject.isLocked = false;
      if (that.terrain.parent) that.terrain.parent.appendChild(cloneObject);
      SoundEffect.play(PresetSound.blockPut);
      return true
    }else if (e.key === constants.terrainEditKey) {
      that.showDetail(that.terrain);
      return true;
    }else if (e.key === constants.terrainDeleteKey) {
      that.terrain.destroy();
      SoundEffect.play(PresetSound.sweep);
      return true;
    }else if (e.key === constants.terrainFixKey) {
      if(that.isLocked){
        that.isLocked = false;
        SoundEffect.play(PresetSound.unlock);
      }else{
        that.isLocked = true;
        SoundEffect.play(PresetSound.lock);
      }
      return true;
    }
    return false
  },
  // thatはGameCharacterComponent
  characterOnKeydownHook(that, e: KeyboardEvent){
    if(e.key === constants.characterCopyKey) {
      let cloneObject = that.gameCharacter.clone();
      cloneObject.location.x += that.gridSize;
      cloneObject.location.y += that.gridSize;
      cloneObject.update();
      SoundEffect.play(PresetSound.piecePut);
      return true;
    } else if (e.key === constants.characterDeleteKey) {
      that.gameCharacter.setLocation('graveyard');
      SoundEffect.play(PresetSound.sweep);
      return true;
    } else if (e.key === constants.characterEditKey) {
      that.showDetail(that.gameCharacter);
      return true;
    } else if (e.key === constants.characterRemoconKey && config.useLilyRemocon) {
      if (!that.pointerDeviceService.isAllowedToOpenContextMenu) return;

      let position = that.pointerDeviceService.pointers[0];
      showRemoteController(that.panelService, that.gameCharacter, position)
      return true;
    } else if (e.key === constants.characterMoveInventoryCommonKey){
      that.gameCharacter.setLocation('common');
      SoundEffect.play(PresetSound.piecePut);
      return true;
    } else if (e.key === constants.characterChatPalletKey) {
      that.showChatPalette(that.gameCharacter)
      return true;
    } else if (e.key === constants.characterMoveInventoryIndividualKey) {
      that.gameCharacter.setLocation(Network.peerId);
      SoundEffect.play(PresetSound.piecePut);
      return true;
    }
    return false
  }
}
// ショートカットキー希望は
// コピーを作る　C
// 地形設定を編集　Q
// 削除する　D

// キャラクターコマ移動
// 墓地に移動　CTRL+M
// 共有イベントに移動　CTRL∔N
// 詳細を表示　CTRL+I
// キャラクターコマを二段で表示してほしい、つまり一段目は　ACとHPとレベルとクラスと　良く使う攻撃方法　二段目で詳細設定など
