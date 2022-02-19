import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import * as constants from 'src/app/plugins/constants'
import { showRemoteController } from '../../lily/controller'
import config from 'src/app/plugins/config'
import { EventSystem, Network } from '@udonarium/core/system'

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
  cardOnKeydownHook(card: { onContextMenu: any, rotate: number, card: any, gridSize: number, owner: string }, e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === menuKey) {
      card.onContextMenu(e)
      return true
    }
    if (e.key === 't') {
      card.rotate = 90
      return true
    }
    if (e.key === 'u') {
      card.rotate = 0
      return true
    }
    if (e.key === 'c') {
      const cloneObject = card.card.clone();
      cloneObject.location.x += card.gridSize;
      cloneObject.location.y += card.gridSize;
      cloneObject.toTopmost();
      SoundEffect.play(PresetSound.cardPut);
    }
    if (e.key === 's') {
      SoundEffect.play(PresetSound.cardDraw);
      card.card.faceDown();
      card.owner = Network.peerContext.userId;
    }
    return false
  },
  cardStackOnKeydownHook(that: { onContextMenu: any, rotate: number, card: any, cardStack: any }, e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === menuKey) {
      that.onContextMenu(e)
      return true
    }
    if (e.key === 't') {
      that.rotate = 90
      return true
    }
    if (e.key === 'u') {
      that.rotate = 0
      return true
    }
    if (e.key === 'r') {
      that.cardStack.faceDownAll();
      SoundEffect.play(PresetSound.cardDraw);
      return true
    }
    if (e.key === 'U') {
      that.cardStack.uprightAll();
      SoundEffect.play(PresetSound.cardDraw);
      return true
    }
    if (e.key === 'S') {
      that.cardStack.shuffle();
      SoundEffect.play(PresetSound.cardShuffle);
      EventSystem.call('SHUFFLE_CARD_STACK', { identifier: that.cardStack.identifier });
      return true
    }

    return false
  },
  // thatはterraincomponent
  terrainOnKeydownHook(that, e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === constants.terrainCopyKey) {
      const cloneObject = that.terrain.clone()
      cloneObject.location.x += that.gridSize
      cloneObject.location.y += that.gridSize
      cloneObject.isLocked = false
      if (that.terrain.parent) that.terrain.parent.appendChild(cloneObject)
      SoundEffect.play(PresetSound.blockPut)
      return true
    } else if (e.key === constants.terrainEditKey) {
      that.showDetail(that.terrain)
      return true
    } else if (e.key === constants.terrainDeleteKey) {
      that.terrain.destroy()
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === constants.terrainEditKey) {
      that.showDetail(that.terrain)
      return true
    } else if (e.key === constants.terrainDeleteKey) {
      that.terrain.destroy()
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === constants.terrainFixKey) {
      if (that.isLocked) {
        that.isLocked = false
        SoundEffect.play(PresetSound.unlock)
      } else {
        that.isLocked = true
        SoundEffect.play(PresetSound.lock)
      }
      return true
    }
    return false
  },
  // thatはGameCharacterComponent
  characterOnKeydownHook(that, e: KeyboardEvent) {
    if (e.key === constants.characterCopyKey) {
      const cloneObject = that.gameCharacter.clone()
      cloneObject.location.x += that.gridSize
      cloneObject.location.y += that.gridSize
      cloneObject.update()
      SoundEffect.play(PresetSound.piecePut)
      return true
    } else if (e.key === constants.characterDeleteKey) {
      that.gameCharacter.setLocation('graveyard')
      SoundEffect.play(PresetSound.sweep)
      return true
    } else if (e.key === constants.characterEditKey) {
      that.showDetail(that.gameCharacter)
      return true
    } else if (
      e.key === constants.characterRemoconKey &&
      config.useLilyRemocon
    ) {
      if (!that.pointerDeviceService.isAllowedToOpenContextMenu) return

      const position = that.pointerDeviceService.pointers[0]
      showRemoteController(that.panelService, that.gameCharacter, position)
      return true
    } else if (e.key === constants.characterMoveInventoryCommonKey) {
      that.gameCharacter.setLocation('common')
      SoundEffect.play(PresetSound.piecePut)
      return true
    } else if (e.key === constants.characterChatPalletKey) {
      that.showChatPalette(that.gameCharacter)
      return true
    } else if (e.key === constants.characterMoveInventoryIndividualKey) {
      that.gameCharacter.setLocation(Network.peerId)
      SoundEffect.play(PresetSound.piecePut)
      return true
    }
    return false
  },
}
