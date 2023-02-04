import { Component, OnDestroy, OnInit, Input, } from '@angular/core';
import { TabletopService } from 'service/tabletop.service';
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
  get startPositionX() { return this.counterBoard.startPositionX; }
  get startPositionY() { return this.counterBoard.startPositionY; }
  get maxCount () { return this.counterBoard.maxCount; }
  get name() { return this.counterBoard.name }
  get direction() { return this.counterBoard.direction; }
  get samePositionDisplay() { return this.counterBoard.samePositionDisplay; }

  constructor(
    private tabletopService: TabletopService,
  ) { }

  ngOnInit() {}
  ngOnDestroy() {}

  get objects() {
    const name = this.name;
    const that = this;
    return this.tabletopService.terrains.filter(obj=>!!obj.detailDataElement.getFirstElementByName(name))
                .map(obj=> {
                    const countElement = obj.detailDataElement.getFirstElementByName(DETAIL_COUNT_NAME);

                    return {
                        name: obj.name
                      , obj
                      , get count(){ return countElement.value; }
                      , set count(value) {
                          countElement.value = `${value}`;
                          updatePosition(obj, value, that);
                         }
                     };
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
  delete() {
    if(!confirm(`カウンターボード ${this.counterBoard.name} を削除してもよいですか？`)) return;
    this.counterBoard.destroy();
  }
  selectDirection(value) {
    this.counterBoard.direction = value;
  }
  selectSamePosition(value) {
    this.counterBoard.samePositionDisplay = value;
  }

  resetCounter() {
    this.objects.forEach(({ obj })=>{
      obj.location.x = -1;
      obj.location.y = -1;
    })
    this.objects.forEach(({ obj })=>{
      const countElement = obj.detailDataElement.getFirstElementByName(DETAIL_COUNT_NAME);
      countElement.value = `0`;
      updatePosition(obj, 0, this);
    })
  }
}

const updatePosition  = (obj, count, that) => {
  if (that.direction === 'clockwise') {
    updatePositionClockwise(obj, count, that);
  } else if (that.direction === 'toRight') {
    updatePositionX(obj, count, that, 1);
  } else if (that.direction === 'toTop') {
    updatePositionY(obj, count, that, -1);
  } else if (that.direction === 'toBottom') {
    updatePositionY(obj, count, that, 1);
  } else if (that.direction === 'toLeft') {
    updatePositionX(obj, count, that, -1);
  }
}

const updatePositionX  = (obj, count, that, sign: 1 | -1) => {
  if(that.samePositionDisplay === 'stack') return updatePositionStack(obj, count, that, calcNextXDirection(sign));
  return updatePositionXDirection(obj, count, that, calcNextXDirection(sign))
}
const updatePositionY  = (obj, count, that, sign: 1 | -1) => {
  if(that.samePositionDisplay === 'stack') updatePositionStack(obj, count, that, calcNextYDirection(sign));
  return updatePositionYDirection(obj, count, that, calcNextYDirection(sign));
}


const updatePositionClockwise  = (obj, count, that) => {
  updatePositionStack(obj, count, that, calcNextXY);
}

const updatePositionStack  = (obj, count, that, calc) => {
  const size = that.size;

  // 上に積まれているオブジェクトを取得
  const currentPositionObjects = that.tabletopService.terrains
    .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
                 && item.location.x === obj.location.x
                 && item.location.y === obj.location.y
                 && item.posZ > obj.posZ);
  const {x, y} = calc(count, that);

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

const updatePositionXDirection  = (obj, count, that, calc) => {
  const size = that.size;
  const sort = that.samePositionDisplay === 'bottom' ? (a,b)=> b.location.y - a.location.y : (a,b)=> a.location.y - b.location.y;
  const sign = that.samePositionDisplay === 'bottom' ? 1 : -1;
  // 同じ位置のオブジェクトを取得
  const currentPositionObjects = that.tabletopService.terrains
    .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
                 && item.location.x === obj.location.x
                 && sort(obj, item) > 0
                 );
  const {x} = calc(count, that);

  // 移動先の一番上のオブジェクトを取得
  const [topObject] = that.tabletopService.terrains
  .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
               && item.location.x === x
  ).sort(sort);

  obj.location.x = x;
  obj.location.y = topObject == null ? that.startPositionY : calcNextDepth(topObject, obj, size, sign);
  obj.posZ = 0;

  obj.update();

  // 上に積まれていたオブジェクトを下げる
  const objDiff = obj.commonDataElement.getFirstElementByName('depth').value;
  const diff = sign * size * Number(objDiff)
  currentPositionObjects.forEach(item=>{
    item.location.y = item.location.y - diff;
    item.update();
  });
}

const updatePositionYDirection  = (obj, count, that, calc) => {
  const size = that.size;
  const sort = that.samePositionDisplay === 'right' ? (a,b)=> b.location.x - a.location.x : (a,b)=> a.location.x - b.location.x;
  const sign = that.samePositionDisplay === 'right' ? 1 : -1;

  // 同じ位置のオブジェクトを取得
  const currentPositionObjects = that.tabletopService.terrains
    .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
                 && item.location.y === obj.location.y
                 && sort(obj, item) > 0
                 );
  const {y} = calc(count, that);

  // 移動先の一番上のオブジェクトを取得
  const [topObject] = that.tabletopService.terrains
  .filter(item => !!item.detailDataElement.getFirstElementByName(that.name)
               && item.location.y === y
  ).sort(sort);

  obj.location.y = y;
  obj.location.x = topObject == null ? that.startPositionX : calcNextWidth(topObject, obj, size, sign);
  obj.posZ = 0;

  obj.update();

  // 上に積まれていたオブジェクトを下げる
  const objDiff = obj.commonDataElement.getFirstElementByName('width').value;
  const diff = sign * size * Number(objDiff)
  currentPositionObjects.forEach(item=>{
    item.location.x = item.location.x - diff;
    item.update();
  });
}

const calcNextDepth = (topObject, self, size, sign: 1 | -1) => {
  const topValue = topObject.commonDataElement.getFirstElementByName('depth').value;
  if(sign>0) {
    return Number(topObject.location.y) + Number(topValue) * size
  }
  const selfValue = self.commonDataElement.getFirstElementByName('depth').value;
  return Number(topObject.location.y) - Number(selfValue) * size
}
const calcNextWidth = (topObject, self, size, sign: 1 | -1) => {
  const topValue = topObject.commonDataElement.getFirstElementByName('width').value;
  if(sign>0) {
    return Number(topObject.location.x) + Number(topValue) * size
  }
  const selfValue = self.commonDataElement.getFirstElementByName('width').value;
  return Number(topObject.location.x) - Number(selfValue) * size
}

const calcNextHeight = (topObject, size) => {
  const topHeight = topObject.commonDataElement.getFirstElementByName('height').value;
  return Number(topObject.posZ) + Number(topHeight) * size
}

const calcNextXDirection = (sign: 1 | -1) => (count, that) => {
  const size = that.size;
  const remainder = count % (that.maxCount + 1);

  const x = sign * (remainder) * size + that.startPositionX;
  const y = that.startPositionY;
  return { x, y }
}

const calcNextYDirection = (sign: 1 | -1) => (count, that) => {
  const size = that.size;
  const remainder = count % (that.maxCount + 1);

  const x = that.startPositionX;
  const y = sign * (remainder) * size +that.startPositionY;
  return { x, y }
}

const calcNextXY = (count, that) => {
  const size = that.size;
  const rightCorner = that.rightCorner;
  const lowerRightCorner = that.lowerRightCorner;
  const lowerLeftCorner = that.lowerLeftCorner;
  const remainder = count % (that.maxCount + 1);
  const nextYCount =  calcNextY(remainder, rightCorner, lowerRightCorner, lowerLeftCorner);
  const nextXcount = calcNextX(remainder, rightCorner, lowerRightCorner, lowerLeftCorner);

  const x = (nextXcount) * size + that.startPositionX;
  const y = (nextYCount) * size + that.startPositionY;
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
