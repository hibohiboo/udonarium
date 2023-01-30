import { Component, OnDestroy, OnInit,HostListener, Input, } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopActionService } from 'service/tabletop-action.service';
import { CoordinateService } from 'service/coordinate.service';
import { CounterBoard } from '../../class/counter-board';

const DETAIL_COUNT_NAME = 'カウント'

@Component({
  selector: 'counter-board',
  templateUrl: './counter-board.component.html',
  styleUrls: ['./counter-board.component.css'],
})
export class CounterBoardComponent implements OnInit, OnDestroy {
  @Input() counterBoard: CounterBoard;
  get size () { return this.counterBoard.size; }
  get rightCorner () { return this.counterBoard.rightCorner; }
  get lowerRightCorner () { return this.counterBoard.lowerRightCorner; }
  get lowerLeftCorner () { return this.counterBoard.lowerLeftCorner; }
  get maxCount () { return this.counterBoard.maxCount; }
  get name() { return this.counterBoard.name }
  constructor(
    private tabletopService: TabletopService,
  ) { }

  ngOnInit() {}
  ngOnDestroy() {}

  get objects() {
    const name = this.name;
    return this.tabletopService.terrains.filter(obj=>!!obj.detailDataElement.getFirstElementByName(name)).map(obj=> {
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
  trackByItem(index: number, value: CounterBoard): string {
    return value ? value.identifier : null;
  }
}

const updatePosition  = (obj, count, that) => {
  const size = that.size;

  // 上に積まれているオブジェクトを取得
  const currentPositionObjects = that.tabletopService.terrains
    .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
                 && item.location.x === obj.location.x
                 && item.location.y === obj.location.y
                 && item.posZ > obj.posZ);
  const {x, y} = calcNextXY(count, that);

  // 移動先の一番上のオブジェクトを取得
  const [topObject] = that.tabletopService.terrains
  .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
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
