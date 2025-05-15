import { SyncVar } from '@udonarium/core/synchronize-object/decorator';
import { PeerCursor } from '@udonarium/peer-cursor';
import { pluginConfig } from 'src/plugins/config';

export const initReturnTheHandCard = (that) => {
  if (!pluginConfig.canReturnHandToIndividualBoard) return;
  SyncVar()(that, 'handOwner');
  that.handOwner = '';
};
export const hasOwnerExtend = (that) => {
  const hasOwner = 0 < that.owner.length;
  if (!pluginConfig.canReturnHandToIndividualBoard) return hasOwner;
  return hasOwner || 0 < that.handOwner.length;
};
export const ownerNameExtend = (that) => {
  const object = PeerCursor.findByUserId(that.owner);
  const objectName = object ? object.name : '';
  if (!pluginConfig.canReturnHandToIndividualBoard) return objectName;
  if (objectName) return objectName;
  const handObject = PeerCursor.findByUserId(that.handOwner);
  const handObjectName = handObject ? handObject.name : '';
  return handObjectName;
};
