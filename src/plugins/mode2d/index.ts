import { pluginConfig } from '../config';

export const is2d = () => pluginConfig.is2d;
export const init2d = (that: any) => {
  if (!is2d()) return;
  that.viewRotateX = 0;
  that.viewRotateZ = 0;
};
