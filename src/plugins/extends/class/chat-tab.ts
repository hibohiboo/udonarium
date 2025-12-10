import { ChatMessageContext } from "@udonarium/chat-message";
import { useChatCommand } from "src/plugins/use-chat-command"

export const extendsChatTab = (that:any) => {
const constructor = that.constructor;
  const originalAddMessage = constructor.prototype.addMessage;
  constructor.prototype.addMessage = function(message: ChatMessageContext) {
      useChatCommand(message?.text);
      originalAddMessage.call(this, message);
  };
}
