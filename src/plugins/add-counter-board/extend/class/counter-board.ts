import { SyncObject, SyncVar } from "@udonarium/core/synchronize-object/decorator";
import { ObjectNode } from "@udonarium/core/synchronize-object/object-node";
import { InnerXml } from "@udonarium/core/synchronize-object/object-serializer";

@SyncObject('counter-board')
export class CounterBoard extends ObjectNode {
  declare name: string;
  declare size: number;
  declare maxCount: number; // 盤上の数字の最大値
  declare rightCorner: number; // 右上角の数字
  declare lowerRightCorner: number; // 右下角の数字
  constructor(identifier?: string) {
    super(identifier);
    SyncVar()(this, 'name');
    this.name = '周囲カウンター';
    SyncVar()(this, 'size');
    this.size = 50;
    SyncVar()(this, 'maxCount');
    this.maxCount = 8;
    SyncVar()(this, 'rightCorner');
    this.rightCorner = 2;
    SyncVar()(this, 'lowerRightCorner');
    this.lowerRightCorner = 4;
  }
  get lowerLeftCorner (): number { return this.lowerRightCorner + this.rightCorner; }
}
