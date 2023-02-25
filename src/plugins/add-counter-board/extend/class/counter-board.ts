import { SyncObject, SyncVar } from "@udonarium/core/synchronize-object/decorator";
import { ObjectNode } from "@udonarium/core/synchronize-object/object-node";
import { InnerXml } from "@udonarium/core/synchronize-object/object-serializer";
import { TabletopObject } from "@udonarium/tabletop-object";

@SyncObject('counter-board')
export class CounterBoard extends TabletopObject {
  declare name: string;
  declare size: number;
  declare maxCount: number; // 盤上の数字の最大値
  declare rightCorner: number; // 右上角の数字 clockwise
  declare lowerRightCorner: number; // 右下角の数字 clockwise
  declare startPositionX: number; // 開始位置: x
  declare startPositionY: number; // 開始位置: y
  declare inRadius: number; // inの半径: diaclock用
  declare outRadius: number; // outの半径: diaclock用
  declare direction: 'toRight' | 'toLeft' | 'toTop' | 'toBottom' | 'clockwise' | 'diaclock'
  declare samePositionDisplay: 'right' | 'lefte' | 'top' | 'bottom' | 'stack'

  constructor(identifier?: string) {
    super(identifier);
    SyncVar()(this, 'name');
    this.name = '新規カウンター';
    SyncVar()(this, 'size');
    this.size = 50;
    SyncVar()(this, 'maxCount');
    this.maxCount = 7;
    SyncVar()(this, 'rightCorner');
    this.rightCorner = 2;
    SyncVar()(this, 'lowerRightCorner');
    this.lowerRightCorner = 4;
    SyncVar()(this, 'startPositionX');
    this.startPositionX = 0;
    SyncVar()(this, 'startPositionY');
    this.startPositionY = 0;
    SyncVar()(this, 'direction');
    this.direction = 'clockwise';
    SyncVar()(this, 'samePositionDisplay');
    this.samePositionDisplay = 'stack';
    SyncVar()(this, 'inRadius');
    this.inRadius = 0;
    SyncVar()(this, 'outRadius');
    this.inRadius = 100;
  }
  get lowerLeftCorner (): number { return this.lowerRightCorner + this.rightCorner; }
  static create() {
    const board = new CounterBoard();
    board.initialize();
    return board;
  }
}
