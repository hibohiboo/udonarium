import { PeerCursor } from '@udonarium/peer-cursor';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';

export const addVirtualScreen = (that) => {
  that.isHideVirtualScreen = true;
  that.hideVirtualScreenUserName = PeerCursor.myCursor.name;
  SoundEffect.play(PresetSound.piecePut);
};
export const deleteVirtualScreen = (that) => {
  that.isHideVirtualScreen = false;
  that.hideVirtualScreenUserName = '';
  SoundEffect.play(PresetSound.piecePut);
};
export const dispatchTabletopObjectDropEvent = (that: any, prop: string) => {
  const element: HTMLElement = that.elementRef.nativeElement;
  const parent = element.parentElement;
  const children = parent.children;
  const detail = that[prop];
  const event = new CustomEvent('objectdrop', { detail, bubbles: true });
  for (let i = 0; i < children.length; i++) {
    children[i].dispatchEvent(event);
  }
};
