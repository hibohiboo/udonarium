
import { ChatMessage, ChatMessageContext } from '@udonarium/chat-message';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { GameCharacter } from '@udonarium/game-character';
import { PeerCursor } from '@udonarium/peer-cursor';
import { TabletopObject } from '@udonarium/tabletop-object';

const findImageIdentifier = (sendFrom,index:number): string => {
  const object = ObjectStore.instance.get(sendFrom);
  if (object instanceof GameCharacter) {
    if( object.imageDataElement.children.length  > index){
      return  ImageStorage.instance.get(<string>object.imageDataElement.children[index].value).identifier;
    }
    return object.imageFile ? object.imageFile.identifier : '';
  } else if (object instanceof PeerCursor) {
    return object.imageIdentifier;
  }
  return sendFrom;
}

const findImagePos = (identifier: string): number => {
  let object = ObjectStore.instance.get(identifier);
  if (object instanceof GameCharacter) {
      let element = object.getElement('POS', object.detailDataElement);
      if(element)
          if( 0 <= <number>element.currentValue && <number>element.currentValue <= 11)
              return <number>element.currentValue;
      return 0;
  }
  return -1;
}

export default {
  chatInputGetImageFileHook(selectCharacterTachie: any){
    if( selectCharacterTachie ){
      let image:ImageFile = ImageStorage.instance.get(<string>selectCharacterTachie.value);
      return image ? image : ImageFile.Empty;
    }
    return undefined;
  },
  chatInputAllowsChatHook(gameCharacter: GameCharacter, peerId: string){
    switch (gameCharacter.location.name) {
      case 'table':
        return !gameCharacter.nonTalkFlag;
      case peerId:
        if( gameCharacter.nonTalkFlag ) return false;
        return true;
      case 'graveyard':
        return false;
      default:
        if( gameCharacter.nonTalkFlag ) return false;
        for (const conn of Network.peerContexts) {
          if (conn.isOpen && gameCharacter.location.name === conn.fullstring) {
            return false;
          }
        }
        return true;
    }
  },
  chatMessageSendMessageHook(chatMessage: ChatMessageContext, sendFrom, tachieNum?: number){
    const imgIndex = tachieNum > 0 ? tachieNum : 0;

    return {
      ...chatMessage,
      imageIdentifier: findImageIdentifier(sendFrom, imgIndex),
      imagePos: findImagePos(sendFrom)
    };
  },
  chatTabAddMessageHook(that, message: ChatMessageContext){
    message.tabIdentifier = that.identifier;

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
        that.pos_num = message[key];
        if( 0 <= that.pos_num && that.pos_num < that.imageIdentifier.length ){
           let oldpos = that.getImageCharactorPos(message['name']);
           if( oldpos >= 0 ){ //同名キャラの古い位置を消去
              that.imageIdentifier[oldpos] = '';
              that.imageCharactorName[oldpos] = '';
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

             that.imageIdentifier[that.pos_num] = message['imageIdentifier'];
             that.imageCharactorName[that.pos_num] =message['name'];
             that.replaceTachieZindex(that.pos_num);

           }
           that.imageIdentifierDummy = message['imageIdentifier'];//同期方法が無理やり感がある、後日

        }
        continue;
      }

      chat.setAttribute(key, message[key]);
    }
    chat.initialize();

    EventSystem.trigger('SEND_MESSAGE', { tabIdentifier: that.identifier, messageIdentifier: chat.identifier });
    EventSystem.trigger('DICE_TABLE_MESSAGE', { tabIdentifier: that.identifier, messageIdentifier: chat.identifier });

    that.appendChild(chat);
    return chat;
  },
  gameObjectInventoryComponentGetGameObjectsHook(inventoryType: string, tableCharacterList_scr: TabletopObject[]){
    if(inventoryType !== 'table') return false;
    const tableCharacterList_dest = [] ;
    for (let character of tableCharacterList_scr) {
      const character_ : GameCharacter = <GameCharacter>character;
      if( !character_.hideInventory ) tableCharacterList_dest.push( <TabletopObject>character );
    }
    return tableCharacterList_dest;
  }
}
