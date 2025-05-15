import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

export const rotateOffContextMenuFactory = (prop: string) => (that: any) =>
  pluginConfig.isOffObjectRotateIndividually
    ? [ContextMenuSeparator, getOffMenuFactory(prop)(that)]
    : [];

const getOffMenuFactory = (prop: string) => (that: any) => {
  if (!that[prop].isRotateOffIndividually) {
    return {
      name: '回転させない',
      action: () => {
        that[prop].isRotateOffIndividually = true;
        SoundEffect.play(PresetSound.piecePut);
      },
    };
  }
  return {
    name: '回転オン',
    action: () => {
      that[prop].isRotateOffIndividually = false;
      SoundEffect.play(PresetSound.piecePut);
    },
  };
};

export const getObjectRotateOffFactory = (prop: string) => (that) => {
  if (!pluginConfig.isOffObjectRotateIndividually) return false;
  return that[prop].isRotateOffIndividually;
};

export const extendCloneRotateOff = (original, clone) => {
  if (!pluginConfig.isOffObjectRotateIndividually) return clone;
  clone.isRotateOffIndividually = original.isRotateOffIndividually;
  return clone;
};

export const keyboardShortCutRotateOffFactory = (prop) => (that) => {
  if (!pluginConfig.isOffObjectRotateIndividually) return;
  if (!that[prop].isRotateOffIndividually) {
    that[prop].isRotateOffIndividually = true;
    SoundEffect.play(PresetSound.piecePut);
    return;
  }
  that[prop].isRotateOffIndividually = false;
  SoundEffect.play(PresetSound.piecePut);
};
