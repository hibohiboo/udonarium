import { SoundEffect } from '@udonarium/sound-effect';
import { isSoundEffectMute } from 'src/plugins/toggle-sound-effect/extend/class/sound-effect';

let isExtended = false;

/**
 * SoundEffect.play（静的メソッド）を1回だけオーバーライドし、
 * toggle-sound-effectプラグインでミュート中の場合は操作音を鳴らさないようにする。
 * SoundEffectはAngularコンポーネントではない（プレーンなSyncObjectクラス）ため、
 * 他のextendXxxComponentと同様のプロトタイプ拡張ではなく、静的メソッドそのものを差し替える。
 */
export const extendSoundEffect = () => {
  if (isExtended) return;
  isExtended = true;

  const originalPlay = SoundEffect.play;
  (SoundEffect as any).play = function (arg: any) {
    if (isSoundEffectMute()) return;
    return (originalPlay as any).call(SoundEffect, arg);
  };
};
