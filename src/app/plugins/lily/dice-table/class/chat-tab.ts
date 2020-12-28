import { SyncObject } from '@udonarium/core/synchronize-object/decorator';
import { ChatTab as ChatTabBase } from '@udonarium/chat-tab';
import { EventSystem } from '@udonarium/core/system';
import type { ChatMessage, ChatMessageContext } from '@udonarium/chat-message';

export class ChatTab extends ChatTabBase {
  addMessage(message: ChatMessageContext): ChatMessage {
    const chat = super.addMessage(message);
    EventSystem.trigger('DICE_TABLE_MESSAGE', { tabIdentifier: this.identifier, messageIdentifier: chat.identifier });
    return chat;
  }
}
