import { ChatMessageContext } from "@udonarium/chat-message"

export interface PostMessageData<T> {
  payload: T
  type: 'chat' | 'dice'
}
export type PostMessageChat = PostMessageData<{
  message: ChatMessageContext
  tab: string
}>
export type PostMessageEventType = 'open-connect' | 'login-sunncess' | 'connect-peer' | 'update-chat-message'
                                 | 'load-rooms' | 'password-verify-error'
export type Message = {
  type: PostMessageEventType;
  payload: any;
}
type ReceiveMessageEventType = 'change-player-name' | 'connect-by-target-user-id'  | 'send-chat-message'
                              | 'connect-by-room-alias';
export type ReceiveMessage = {
  type: ReceiveMessageEventType;
  payload: any;
}

