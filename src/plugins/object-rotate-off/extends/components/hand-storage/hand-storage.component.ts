import { extendCloneRotateOff, getObjectRotateOffFactory, rotateOffContextMenuFactory } from "../../domain/object-rotate-off";

const targetProp = 'handStorage';
export const rotateOffContextMenuHandStorage = rotateOffContextMenuFactory(targetProp)
export const getObjectRotateOffHandStorage = getObjectRotateOffFactory(targetProp)
export const extendCloneRotateOffHandStorage = extendCloneRotateOff

