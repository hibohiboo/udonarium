import { Component, OnDestroy, OnInit,HostListener, } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopActionService } from 'service/tabletop-action.service';
import { CoordinateService } from 'service/coordinate.service';

const DETAIL_COUNT_NAME = 'カウント'

@Component({
  selector: 'counter-board',
  templateUrl: './counter-board.component.html',
  styleUrls: ['./counter-board.component.css'],
})
export class CounterBoardComponent implements OnInit, OnDestroy {
  get size () { return 50; }
  get rightCorner () { return 2; }
  get lowerRightCorner () { return 4; }
  get lowerLeftCorner () { return this.lowerRightCorner + this.rightCorner; }
  get maxCount () { return 8; }

  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private tabletopActionService: TabletopActionService,
    private coordinateService: CoordinateService,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = 'カウンターボード');
  }

  ngOnDestroy() {
  }
  get objects() {
    return this.tabletopService.terrains.map(obj=> {
     const countElement = obj.detailDataElement.getFirstElementByName(DETAIL_COUNT_NAME);
     const count = Number(countElement.value);
     return {
              name: obj.name
            , count
            , obj
          }
    })
  }

  increaseCount(obj) {
    const countElement = obj.detailDataElement.getFirstElementByName(DETAIL_COUNT_NAME);
    const count = Number(countElement.value);
    const newValue = count + 1;
    countElement.value = `${newValue}`;
    updatePosition(obj, newValue, this);
  }

  decreaseCount(obj) {
    const countElement = obj.detailDataElement.getFirstElementByName(DETAIL_COUNT_NAME);
    const count = Number(countElement.value);
    const newValue = count - 1;
    countElement.value = `${newValue}`;
    updatePosition(obj, newValue, this);
  }

}

const updatePosition  = (obj, count, that) => {
  const size = that.size;

  // 上に積まれているオブジェクトを取得
  const currentPositionObjects = that.tabletopService.terrains
    .filter(item => item.detailDataElement.getFirstElementByName('周囲カウンター')
                 && item.location.x === obj.location.x
                 && item.location.y === obj.location.y
                 && item.posZ > obj.posZ);
  const {x, y} = calcNextXY(count, that);

  // 移動先の一番上のオブジェクトを取得
  const [topObject] = that.tabletopService.terrains
  .filter(item => item.detailDataElement.getFirstElementByName('周囲カウンター')
               && item.location.x === x
               && item.location.y === y
  ).sort((a,b)=> b.posZ - a.posZ);

  obj.location.x = x;
  obj.location.y = y;

  obj.posZ = topObject == null ? 0 : calcNextHeight(topObject, size);
  obj.update();

  // 上に積まれていたオブジェクトを下げる
  const objHeight = obj.commonDataElement.getFirstElementByName('height').value;
  const height = size * Number(objHeight)
  currentPositionObjects.forEach(item=>{
    item.posZ = item.posZ - height;
    item.update();
  });
}

const calcNextHeight = (topObject, size) => {
  const topHeight = topObject.commonDataElement.getFirstElementByName('height').value;
  return Number(topObject.posZ) + Number(topHeight) * size
}

const calcNextXY = (count, that) => {
  const size = that.size;
  const rightCorner = that.rightCorner;
  const lowerRightCorner = that.lowerRightCorner;
  const lowerLeftCorner = that.lowerLeftCorner;
  const remainder = count % that.maxCount;
  const nextYCount =  calcNextY(remainder, rightCorner, lowerRightCorner, lowerLeftCorner);
  const nextXcount = calcNextX(remainder, rightCorner, lowerRightCorner, lowerLeftCorner);
  const x = (nextXcount) * size;
  const y = (nextYCount) * size;
  return { x, y }
}

const calcNextX = (count, rightCorner, lowerRightCorner, lowerLeftCorner) => {
  if (count < rightCorner) return count;
  if (count >= lowerLeftCorner) return 0;
  if (count >= lowerRightCorner) return rightCorner - (count - lowerRightCorner);
  return rightCorner;
}
const calcNextY = (count, rightCorner, lowerRightCorner, lowerLeftCorner) => {
  if (count <= rightCorner) return 0;
  if (count >= lowerLeftCorner) return lowerRightCorner - rightCorner - (count - lowerLeftCorner);
  if (count > lowerRightCorner) return lowerRightCorner - rightCorner;
  return count - rightCorner
}
