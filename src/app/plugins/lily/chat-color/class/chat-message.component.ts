import { ChatTabList } from "@udonarium/chat-tab-list";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";

export const chatTabList = (): ChatTabList =>  ObjectStore.instance.get<ChatTabList>('ChatTabList');
