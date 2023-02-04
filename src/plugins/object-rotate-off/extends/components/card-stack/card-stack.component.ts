import { extendCloneRotateOff, getObjectRotateOffFactory, rotateOffContextMenuFactory } from "../../domain/object-rotate-off";

const targetProp = 'cardStack';
export const rotateOffContextMenuCardStack = rotateOffContextMenuFactory(targetProp)
export const getObjectRotateOffCardStack = getObjectRotateOffFactory(targetProp)
export const extendCloneRotateOffCardStack = extendCloneRotateOff
