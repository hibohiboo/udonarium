import type { ChatMessageContext } from '../class/chat-message'
import type { DiceRollResult } from '../class/dice-bot'
interface PostMessageData<T> {
  payload: T
  type: 'chat' | 'dice'
}
export type PostMessageChat = PostMessageData<{ message: ChatMessageContext, tab: string }>
export type PostMessageDiceChat = PostMessageData<{ message: ChatMessageContext, tab: string, dice: DiceRollResult }>
