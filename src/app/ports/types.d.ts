import type { ChatMessageContext } from '../class/chat-message'
interface PostMessageData<T> {
  payload: T
  type: 'chat' | 'dice'
}
export type PostMessageChat = PostMessageData<{ message: ChatMessageContext, tab: string }>
