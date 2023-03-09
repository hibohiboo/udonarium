import { extendCloneRotateOff, getObjectRotateOffFactory, rotateOffContextMenuFactory } from "../../domain/object-rotate-off";

const targetProp = 'diceSymbol';
export const rotateOffContextMenuDice = rotateOffContextMenuFactory(targetProp)
export const getObjectRotateOffDice = getObjectRotateOffFactory(targetProp)
export const extendCloneRotateOffDice = extendCloneRotateOff
