import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { TerrainViewState } from "@udonarium/terrain";
import { ContextMenuAction, ContextMenuSeparator } from "service/context-menu.service";

export default {
  terrainComponentOnContextMenuHook(that){
    let menuPosition = that.pointerDeviceService.pointers[0];
    let objectPosition = that.coordinateService.calcTabletopLocalCoordinate();
    const actions: ContextMenuAction[] = []
    actions.push(
      that.isLocked
        ? {
            name: '☑ 固定', action: () => {
              that.isLocked = false;
              SoundEffect.play(PresetSound.unlock);
              console.log(`width: ${that.width}  gridSize: ${that.gridSize} depth: ${that.depth} terreinAltitude: ${that.terreinAltitude} altitude: ${that.altitude}, height: ${that.height}, viewRotateZ: ${that.viewRotateZ}`);

            }
          }
        : {
          name: '☐ 固定', action: () => {
              that.isLocked = true;
              SoundEffect.play(PresetSound.lock);
            }
          }
    )
    actions.push(ContextMenuSeparator)
    actions.push(
      that.isSlope
        ? {
          name: '☑ 傾斜', action: () => {
            that.isSlope = false;
          }
        } : {
          name: '☐ 傾斜', action: () => {
            that.isSlope = true;
          }
        });
    actions.push(
      { name: '壁の表示', action: null, subActions: [
        {
          name: `${ that.hasWall && that.isSurfaceShading ? '◉' : '○' } 通常`, action: () => {
            that.mode = TerrainViewState.ALL;
            that.isSurfaceShading = true;
          }
        },
        {
          name: `${ that.hasWall && !that.isSurfaceShading ? '◉' : '○' } 陰影なし`, action: () => {
            that.mode = TerrainViewState.ALL;
            that.isSurfaceShading = false;
          }
        },
        {
          name: `${ !that.hasWall ? '◉' : '○' } 非表示`, action: () => {
            that.mode = TerrainViewState.FLOOR;
            if (that.depth * that.width === 0) {
              that.terrain.width = that.width <= 0 ? 1 : that.width;
              that.terrain.depth = that.depth <= 0 ? 1 : that.depth;
            }
          }
        },
      ]})
    actions.push(ContextMenuSeparator)

    actions.push(
        that.isDropShadow
        ? {
          name: '☑ 影を落とす', action: () => {
            that.isDropShadow = false;
          }
        } : {
          name: '☐ 影を落とす', action: () => {
            that.isDropShadow = true;
          }
        }
    )

    actions.push(
      that.isAltitudeIndicate
      ? {
        name: '☑ 高度の表示', action: () => {
          that.isAltitudeIndicate = false;
        }
      } : {
        name: '☐ 高度の表示', action: () => {
          that.isAltitudeIndicate = true;
        }
    })
    actions.push(
      {
        name: '高度を0にする', action: () => {
          if (that.altitude != 0) {
            that.altitude = 0;
            SoundEffect.play(PresetSound.sweep);
          }
        },
        altitudeHande: that.terrain
      })
    actions.push(ContextMenuSeparator)
    actions.push({ name: '地形設定を編集', action: () => { that.showDetail(that.terrain); } })
    actions.push({
        name: 'コピーを作る', action: () => {
          let cloneObject = that.terrain.clone();
          cloneObject.location.x += that.gridSize;
          cloneObject.location.y += that.gridSize;
          cloneObject.isLocked = false;
          if (that.terrain.parent) that.terrain.parent.appendChild(cloneObject);
          SoundEffect.play(PresetSound.blockPut);
        }
      })
    actions.push(
      {
        name: '削除する', action: () => {
          that.terrain.destroy();
          SoundEffect.play(PresetSound.sweep);
        }
      })
    actions.push(ContextMenuSeparator)
    actions.push({ name: 'オブジェクト作成', action: null, subActions: that.tabletopActionService.makeDefaultContextMenuActions(objectPosition) });
    that.contextMenuService.open(menuPosition, actions,that.name);
  }
}
