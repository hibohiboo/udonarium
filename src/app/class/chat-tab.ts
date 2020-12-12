import { ChatMessage, ChatMessageContext } from './chat-message';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { ObjectNode } from './core/synchronize-object/object-node';
import { InnerXml, ObjectSerializer } from './core/synchronize-object/object-serializer';
import { EventSystem } from './core/system';
import type { PostMessageChat, PostMessageDiceChat } from '../ports/types'

interface Window {
  gapi: any
}
declare var window: Window & typeof globalThis
const gapi = window.gapi

@SyncObject('chat-tab')
export class ChatTab extends ObjectNode implements InnerXml {
  @SyncVar() name: string = 'タブ';
  get chatMessages(): ChatMessage[] { return <ChatMessage[]>this.children; }

  private _unreadLength: number = 0;
  get unreadLength(): number { return this._unreadLength; }
  get hasUnread(): boolean { return 0 < this.unreadLength; }

  get latestTimeStamp(): number {
    let lastIndex = this.chatMessages.length - 1;
    return lastIndex < 0 ? 0 : this.chatMessages[lastIndex].timestamp;
  }

  // ObjectNode Lifecycle
  onChildAdded(child: ObjectNode) {
    super.onChildAdded(child);

    if (child.parent === this && child instanceof ChatMessage && child.isDisplayable) {

      // @ts-ignore
      if (window && window.parent && window !== window.parent) {
        // const isDice = child.from === 'System-BCDice'
        // const type = isDice ? 'dice' :'chat'
        // if (isDice) {
        //   const diceBotMessage: ChatMessageContext = {
        //     identifier: '',
        //     tabIdentifier: child.tabIdentifier,
        //     originFrom: child.originFrom,
        //     from: 'System-BCDice',
        //     timestamp: child.timestamp,
        //     imageIdentifier: '',
        //     tag: child.tag,
        //     name: child.name,
        //     text: child.text
        //   };
        //   const message: PostMessageDiceChat = {
        //     type: 'dice',
        //     payload: {
        //       message: diceBotMessage,
        //       tab: child.tabIdentifier,
        //       dice: rollResult
        //     }
        //   };
        //   window.parent.postMessage(
        //     message,
        //     '*', // TODO: Set Origin
        //   );
        // } else {
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
          window.parent.postMessage(
            message,
            '*', // TODO: Set Origin
          )
        // }

      }
      this._unreadLength++;
      EventSystem.trigger('MESSAGE_ADDED', { tabIdentifier: this.identifier, messageIdentifier: child.identifier });
      this.addSpreadSheet(child);
    }
  }
  private async addSpreadSheet({timestamp=0, tabIdentifier="",text="",name=""}) {
    let spreadsheetId = null;
    location.search.replace('?', '').split('&').forEach(set=>{
      const [id, value] = set.split('=');
      if(id==='spreadsheet'){
        spreadsheetId =value
      }
    })
    if(!spreadsheetId) return;
    const params = {
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
    };
    const time = new Date(timestamp + 32400000) // 60 * 60 * 1000 * 9.UTCとJSTの時差9時間
    const body = {
      values: [[name,text,time,tabIdentifier]],
    }
    try {
      const response = (await gapi.client.sheets.spreadsheets.values.append(params, body)).data;
    } catch (err) {
      console.error(err);
    }
  }
  addMessage(message: ChatMessageContext): ChatMessage {
    message.tabIdentifier = this.identifier;

    let chat = new ChatMessage();
    for (let key in message) {
      if (key === 'identifier') continue;
      if (key === 'tabIdentifier') continue;
      if (key === 'text') {
        chat.value = message[key];
        continue;
      }
      if (message[key] == null || message[key] === '') continue;
      chat.setAttribute(key, message[key]);
    }
    chat.initialize();
    EventSystem.trigger('SEND_MESSAGE', { tabIdentifier: this.identifier, messageIdentifier: chat.identifier });
    this.appendChild(chat);
    return chat;
  }

  markForRead() {
    this._unreadLength = 0;
  }

  innerXml(): string {
    let xml = '';
    for (let child of this.children) {
      if (child instanceof ChatMessage && !child.isDisplayable) continue;
      xml += ObjectSerializer.instance.toXml(child);
    }
    return xml;
  };

  parseInnerXml(element: Element) {
    return super.parseInnerXml(element);
  };
}
