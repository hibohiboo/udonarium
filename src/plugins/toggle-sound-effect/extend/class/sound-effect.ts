import { pluginConfig } from "src/plugins/config";

let isMute = false;

export const isSoundEffectMute = ()=> {
  if(!pluginConfig.isToggleSoundEffect) return false;
  return isMute;
}

export const useMute = ()=> {
  if(!pluginConfig.isToggleSoundEffect) return false;
  return !isMute;
}
export const useMuteOff = () => {
  if(!pluginConfig.isToggleSoundEffect) return false;
  return isMute;
}

export const toggleMute = () => {
  isMute = !isMute;
}
