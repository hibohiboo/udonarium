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

  @SyncVar() pos_num: number = -1;
  @SyncVar() imageIdentifier: string[] = ['a','b','c','d','e','f','g','h','i','j','k','l'];
  @SyncVar() imageCharactorName: string[] = ['#0','#1','#2','#3','#4','#5','#6','#7','#8','#9','#10','#11'];
  @SyncVar() imageIdentifierZpos: number[] = [0,1,2,3,4,5,6,7,8,9,10,11];

  @SyncVar() count:number = 0;
  @SyncVar() imageIdentifierDummy: string = 'test';//通信開始ために使わなくても書かなきゃだめっぽい後日見直し

  get chatMessages(): ChatMessage[] { return <ChatMessage[]>this.children; }

  get imageZposList( ): number[] {
    let ret:number[] = this.imageIdentifierZpos.slice();
    return ret;
  }

  getImageCharactorPos(name:string){
    for (let i = 0; i < this.imageCharactorName.length ; i++) {
      if( name == this.imageCharactorName[i] ){
        return i;
      }
    }
    return -1;
  }

  tachieZindex( toppos : number ):number {
    let index = this.imageIdentifierZpos.indexOf( Number(toppos) );
    return index;
  }

  public tachieDispFlag = 1;

  replaceTachieZindex( toppos : number ){
    let index = this.imageIdentifierZpos.indexOf( Number(toppos) );
    if( index >= 0 ){
      this.imageIdentifierZpos.splice(index,1);
      this.imageIdentifierZpos.push( Number(toppos) );
      console.log( 'imageIdentifierZpos = ' + this.imageIdentifierZpos );
    }
  }

  private _dispCharctorIcon: boolean = true;
  get dispCharctorIcon(): boolean { return this._dispCharctorIcon; }
  set dispCharctorIcon( flag : boolean) { this._dispCharctorIcon = flag; }

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
      console.log('addMessage:'+key);
      if (key === 'identifier') continue;
      if (key === 'tabIdentifier') continue;

      if (key === 'text') {
        chat.value = message[key];
        continue;
      }
      if (message[key] == null || message[key] === '') continue;

      if (key === 'imagePos') {
        if (message['to'] != null && message['to'] !== '') { continue; } // 秘話時に立ち絵の更新をかけない
        this.pos_num = message[key];
        if( 0 <= this.pos_num && this.pos_num < this.imageIdentifier.length ){
           let oldpos = this.getImageCharactorPos(message['name']);
           if( oldpos >= 0 ){ //同名キャラの古い位置を消去
              this.imageIdentifier[oldpos] = '';
              this.imageCharactorName[oldpos] = '';
           }
           //非表示コマンド\s

           let splitMessage = message['text'].split(/\s+/);
           let hideCommand = null;
           console.log('splitMessage' + splitMessage);
           if( splitMessage ){
             hideCommand = splitMessage[ splitMessage.length -1 ].match(new RegExp('[@＠][HhＨｈ][IiＩｉ][DdＤｄ][EeＥｅ]$'));
             console.log('hideCommand' + hideCommand);
           }
           if( hideCommand ){

           }else{

             this.imageIdentifier[this.pos_num] = message['imageIdentifier'];
             this.imageCharactorName[this.pos_num] =message['name'];
             this.replaceTachieZindex(this.pos_num);

           }
           this.imageIdentifierDummy = message['imageIdentifier'];//同期方法が無理やり感がある、後日

        }
        continue;
      }

      chat.setAttribute(key, message[key]);
    }
    chat.initialize();

    EventSystem.trigger('SEND_MESSAGE', { tabIdentifier: this.identifier, messageIdentifier: chat.identifier });

    EventSystem.trigger('DICE_TABLE_MESSAGE', { tabIdentifier: this.identifier, messageIdentifier: chat.identifier });

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
