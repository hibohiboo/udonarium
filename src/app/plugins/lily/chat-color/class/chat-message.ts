import { ChatTab } from "@udonarium/chat-tab";
import { ChatTabList } from "@udonarium/chat-tab-list";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";

export const chatTabList = ()=>ObjectStore.instance.get<ChatTabList>('ChatTabList');

// thatはChatMessage
export const chatSimpleDispFlag = (that): boolean => {
  if( ! that.parent ){ return false ;}

  let tab : ChatTab = <ChatTab>that.parent;
  return !!tab.chatSimpleDispFlag
}

export const simpleDispFlagTime = (that): boolean => !!that.chatTabList.simpleDispFlagTime
export const  simpleDispFlagUserId = (that): boolean => !!that.chatTabList.simpleDispFlagUserId
