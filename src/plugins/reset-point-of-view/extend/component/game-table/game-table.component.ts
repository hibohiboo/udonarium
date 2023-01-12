import { pluginConfig } from "src/plugins/config";

let viewPoint2d = false;
export const resetViewHandler = (that, event) => {
  that.isTransformMode = false
  that.pointerDeviceService.isDragging = false

  that.viewRotateX = 0
  that.viewRotateY = 0
  that.viewPotisonX = 0
  that.viewPotisonY = 0
  that.viewRotateZ = 0
  if (!(event?.data === 'rotate')) {
    that.viewPotisonZ = 0
  }
  if(event?.data === 'top'){
    viewPoint2d = true;
  } else{
    viewPoint2d = false;
  }
  setTimeout(() => {
    if (
      event?.data !== 'top' &&
      event?.data !== 'rotate'
    ) {
      that.setTransform(100, 0, 0, 50, 0, 10)
      return;
    }
    that.setTransform(0, 0, 0, 0, 0, 0)
  },50)
  that.removeFocus()
}
export const getViewPoint2d = ()=>{
  if(!pluginConfig.isUseResetPointOfView) false;
  return viewPoint2d;
}
