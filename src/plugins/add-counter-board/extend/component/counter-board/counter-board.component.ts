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

                    return { name: obj.name, obj
                      ,get count(){ return countElement.value; }
                      ,set count(value) {
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
}

const updatePosition  = (obj, count, that) => {
  if (that.direction === 'clockwise') {
    updatePositionClockwise(obj, count, that);
  } else if (that.direction === 'toRight') {
    updatePositionX(obj, count, that, 1);
  } else if (that.direction === 'toLeft') {
    updatePositionX(obj, count, that, -1);
  }
}

const updatePositionX  = (obj, count, that, sign: 1 | -1) => {
  updatePositionStack(obj, count, that, calcNextXDirection(sign));
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

const calcNextHeight = (topObject, size) => {
  const topHeight = topObject.commonDataElement.getFirstElementByName('height').value;
  return Number(topObject.posZ) + Number(topHeight) * size
}

const calcNextXDirection = (sign: 1 | -1) => (count, that) => {
  const size = that.size;
  const remainder = count % that.maxCount;

  const x = sign * (remainder) * size + that.startPositionX;
  const y = that.startPositionY;
  return { x, y }
}

const calcNextXY = (count, that) => {
  const size = that.size;
  const rightCorner = that.rightCorner;
  const lowerRightCorner = that.lowerRightCorner;
  const lowerLeftCorner = that.lowerLeftCorner;
  const remainder = count % that.maxCount;
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
