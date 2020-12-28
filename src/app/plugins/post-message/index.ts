import { ObjectStore } from "@udonarium/core/synchronize-object/object-store"
import { Network } from "@udonarium/core/system"
import { environment } from "src/environments/environment";
import type { ChatMessage, ChatMessageContext } from "@udonarium/chat-message";
import type { ChatTab } from "@udonarium/chat-tab"
import type { GameTableComponent } from "component/game-table/game-table.component";


export default {
  appComponentConstructorHook(){
    if (!window.parent) { return false;}

    window.addEventListener('message', (event: MessageEvent) => {
      // console.log('from parent message', event)
      // console.log('ori', environment.origin)
      if (event.origin !== environment.origin) return;
      // event.data.type webpackOKのメッセージなども来る。
      if(!isChatMessage(event.data))return ;
      const { message, tab } = event.data.payload;

      let chatMessage = {
        from: Network.peerContext.id,
        to: message.to,
        name: message.name,
        imageIdentifier: message.imageIdentifier,
        timestamp: message.timestamp,
        tag: message.tag,
        text: message.text,
      };
      ObjectStore.instance.get<ChatTab>(tab).addMessage(chatMessage);
    }, false)
    return false;
  },
  updateGameObjectHook(that: GameTableComponent) {
    if (window === window.parent) { return false; }

    // console.log('table-image', this.tableImage)
    if (this.tableImage.blob) {
      let reader = new FileReader();
      reader.readAsDataURL(that.tableImage.blob); // blob を base64 へ変換し onload を呼び出します

      reader.onload = function() {
        const message = {
          type: 'table-background',
          payload: {
            url: reader.result
          }
        };
        window.parent.postMessage( message, environment.origin, );
      };
      return
    }
    const message = {
      type: 'table-background',
      payload: {
        url: that.tableImage.url.replace('./', `${window.location.protocol}//${window.location.host}/`)
      }
    };
    window.parent.postMessage( message, environment.origin, );
    return false;
  },
  chatTabOnChildAddedHook(child: ChatMessage){
    if (window === window.parent) { return; }
    const chatMessage: ChatMessageContext = {
      from: child.from,
      to: child.to,
      name: child.name,
      imageIdentifier: child.imageIdentifier,
      timestamp: child.timestamp,
      tag: child.tag,
      text: child.text,
    };
    const message: PostMessageChat = {
      type: 'chat',
      payload: {
        message: chatMessage,
        tab: child.tabIdentifier
      }
    };
    window.parent.postMessage(message, environment.origin,)
    return false

  }
}

interface PostMessageData<T> {
  payload: T
  type: 'chat' | 'dice'
}
type PostMessageChat = PostMessageData<{ message: ChatMessageContext, tab: string }>
const isChatMessage = (data: any): data is PostMessageChat => ['chat', 'dice'].includes(data.type)

