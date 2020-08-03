import type { PostMessageChat } from './types.d'

export const isChatMessage = (data: any): data is PostMessageChat =>
['chat', 'dice'].includes(data.type)
