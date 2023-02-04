import { extendCloneRotateOff, getObjectRotateOffFactory, rotateOffContextMenuFactory } from "../../domain/object-rotate-off";

const targetProp = 'textNote';
export const rotateOffContextMenuTextNote = rotateOffContextMenuFactory(targetProp)
export const getObjectRotateOffTextNote = getObjectRotateOffFactory(targetProp)
export const extendCloneRotateOffTextNote = extendCloneRotateOff
