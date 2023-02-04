import { extendCloneRotateOff, getObjectRotateOffFactory, rotateOffContextMenuFactory } from "../../domain/object-rotate-off";

const targetProp = 'gameCharacter';
export const rotateOffContextMenuCharacter = rotateOffContextMenuFactory(targetProp)
export const getObjectRotateOffCharacter = getObjectRotateOffFactory(targetProp)
export const extendCloneRotateOffCharacter = extendCloneRotateOff
