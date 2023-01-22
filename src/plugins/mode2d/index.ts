import { pluginConfig } from "../config";
import { isViewPoint2dMode } from "../reset-point-of-view/extend/app.component";

export const is2d = () => pluginConfig.is2d || isViewPoint2dMode()
