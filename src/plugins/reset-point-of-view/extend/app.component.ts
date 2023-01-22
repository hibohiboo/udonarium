import { EventSystem } from "@udonarium/core/system";
import { getViewPoint2d } from "./component/game-table/game-table.component";

export const resetPointOfView = (that) => {
  that.contextMenuService.open(that.pointerDeviceService.pointers[0], [
  { name: '初期視点に戻す', action: () => EventSystem.trigger('RESET_POINT_OF_VIEW', null) },
  { name: '2Dモードに切り替える', action: () => EventSystem.trigger('RESET_POINT_OF_VIEW', 'top') }
], '視点リセット');
}

export const isViewPoint2dMode = ()=>{
  return getViewPoint2d()
}
