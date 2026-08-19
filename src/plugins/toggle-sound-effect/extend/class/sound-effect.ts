import { pluginConfig } from 'src/plugins/config';

/** 操作音（自分の操作によって全員に鳴るサウンドエフェクト）がミュート中かどうか */
let isMute = false;

export const isSoundEffectMute = (): boolean => {
  if (!pluginConfig.isToggleSoundEffect) return false;
  return isMute;
};

/** メニューに「ミュートにする」ボタン（現在ミュートされていない状態）を表示するか */
export const useMute = (): boolean => {
  if (!pluginConfig.isToggleSoundEffect) return false;
  return !isMute;
};

/** メニューに「ミュート解除」ボタン（現在ミュート中の状態）を表示するか */
export const useMuteOff = (): boolean => {
  if (!pluginConfig.isToggleSoundEffect) return false;
  return isMute;
};

export const toggleMute = (): void => {
  isMute = !isMute;
};
