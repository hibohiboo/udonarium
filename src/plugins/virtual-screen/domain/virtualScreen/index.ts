import { PeerCursor } from "@udonarium/peer-cursor";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";

export const addVirtualScreen = (that)=>{
  that.isHideVirtualScreen = true;
  that.hideVirtualScreenUserName = PeerCursor.myCursor.name;
  SoundEffect.play(PresetSound.piecePut);
}
export const deleteVirtualScreen = (that)=>{
  that.isHideVirtualScreen = false;
  that.hideVirtualScreenUserName = '';
  SoundEffect.play(PresetSound.piecePut);
}
