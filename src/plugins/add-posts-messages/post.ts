import { parentOrigin } from "./const"
import { Message, PostMessageEventType } from "./types"

export const postMessage = (payload: any, type: PostMessageEventType) =>{
  if (window === window.parent) {
    return
  }
  const message:Message = {
    type,
    payload
  }
  window.parent.postMessage(message, parentOrigin)
}
