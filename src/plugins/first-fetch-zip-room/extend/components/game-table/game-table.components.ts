import { pluginConfig } from 'src/plugins/config';

export const isEmptyDefaultTabletopObjects = pluginConfig.isFirstFetchZipRoom;
export const transformDefault = (that) => {
  // positionにタイポが修正される可能映画あるので要注意
  let viewPotisonZ = 0;
  let viewPotisonX = 0;
  let viewPotisonY = 0;
  let viewRotateX = 0;
  let viewRotateY = 0;
  let viewRotateZ = 0;

  if (pluginConfig.z != null) viewPotisonZ = Number(pluginConfig.z);
  if (pluginConfig.x != null) viewPotisonX = Number(pluginConfig.x);
  if (pluginConfig.y != null) viewPotisonY = Number(pluginConfig.y);
  if (pluginConfig.rx != null) viewRotateX = Number(pluginConfig.rx);
  if (pluginConfig.ry != null) viewRotateY = Number(pluginConfig.ry);
  if (pluginConfig.rz != null) viewRotateZ = Number(pluginConfig.rz);

  that.setTransform(
    viewPotisonX,
    viewPotisonY,
    viewPotisonZ,
    viewRotateX,
    viewRotateY,
    viewRotateZ,
  );
};
