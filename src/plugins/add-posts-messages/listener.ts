
import { EventSystem, Network } from "@udonarium/core/system";
import { PostMessageChat, ReceiveMessage } from "./types"
import { postMessage } from "./post";
import { PeerCursor } from "@udonarium/peer-cursor";
import { PeerContext } from "@udonarium/core/system/network/peer-context";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { parentOrigin } from "./const";
import { ChatTab } from "@udonarium/chat-tab";
import { ChatMessage } from "@udonarium/chat-message";
import { IRoomInfo } from "@udonarium/core/system/network/room-info";

const isChatMessage = (data: any): data is PostMessageChat =>
  ['chat', 'dice'].includes(data.type);

let loadedRooms = [];

export const listenMessage = ()=>{
  window.addEventListener(
    'message',
    (event: MessageEvent<ReceiveMessage>) => {
      if (event.origin !== parentOrigin) return
      // event.data.type webpackOKのメッセージなども来る。

      // ニックネーム修正
      if(event.data.type === 'change-player-name') PeerCursor.myCursor.name = event.data.payload

      // プライベート接続
      if(event.data.type === 'connect-by-target-user-id') {
        let targetUserId = event.data.payload;
        if (targetUserId.length < 1) return;
        let peer = PeerContext.create(targetUserId);
        if (peer.isRoom) return;
        ObjectStore.instance.clearDeleteHistory();
        Network.connect(peer);
      }

      // ルーム接続
      if(event.data.type === 'connect-by-room-alias'){
        const {alias, pass} = event.data.payload;
        const room = loadedRooms.find(room=>room.id === alias)
        if(!room) return;
        connectRoom(room, pass);
      }

      // チャット受信
      if (event.data.type === 'send-chat-message'){
        const tab = 'MainTab'
        ObjectStore.instance.get<ChatTab>(tab).addMessage(event.data.payload)
      }

    },
    false,
  );
  EventSystem.register({})
    .on('OPEN_NETWORK', event => {
      console.warn('eero')
      postMessage(Network.peer.userId, 'open-connect')
      window.setTimeout(async() => {
        console.log('room')
        const rooms = await loadRooms();
        postMessage(rooms, 'load-rooms');
        console.log('rooms', rooms)
        loadedRooms = rooms;
      }, 1000);
    })
    // .on('ALARM_TIMEUP_ORIGIN', event => {})
    // .on('ALARM_POP', event => {})
    // .on('START_VOTE', event => {})
    // .on('FINISH_VOTE', event => {})
    // .on('START_CUT_IN', event => {})
    // .on('STOP_CUT_IN', event => {})
    .on('UPDATE_GAME_OBJECT', event => {
      let message = ObjectStore.instance.get(event.data.identifier);
      if (message && message instanceof ChatMessage) {
        postMessage(message, 'update-chat-message')
      }
    })
    // .on('DELETE_GAME_OBJECT', event => {  })
    // .on('SYNCHRONIZE_AUDIO_LIST', event => {  })
    // .on('SYNCHRONIZE_FILE_LIST', event => {  })
    // .on<AppConfig>('LOAD_CONFIG', event => {})
    // .on<File>('FILE_LOADED', event => {})
    // .on('NETWORK_ERROR', event => {})
    .on('CONNECT_PEER', event => {
      postMessage(true, 'connect-peer')
    })
    // .on('DISCONNECT_PEER', event => {})
  ;
}
const loadRooms = async()=>{
  const rooms = await Network.listAllRooms();

  return rooms;
}

const connectRoom = (room: IRoomInfo, password: string) => {
  const targetPeers = room.filterByPassword(password);
  if (targetPeers.length < 1) {
    postMessage(true, 'password-verify-error')

    return;
  }
  const userId = Network.peer.userId;
  Network.open(userId, room.id, room.name, password);
  PeerCursor.myCursor.peerId = Network.peerId;

  const triedPeer: string[] = [];
  EventSystem.register(triedPeer)
    .on('OPEN_NETWORK', event => {
      console.log('LobbyComponent OPEN_PEER', event.data.peerId);
      EventSystem.unregister(triedPeer);
      ObjectStore.instance.clearDeleteHistory();
      for (let peer of targetPeers) {
        Network.connect(peer);
      }
      EventSystem.register(triedPeer)
        .on('CONNECT_PEER', event => {
          triedPeer.push(event.data.peerId);
          if (targetPeers.length <= triedPeer.length) {
            resetNetwork();
            EventSystem.unregister(triedPeer);
            // this.closeIfConnected();
          }
        })
        .on('DISCONNECT_PEER', event => {
          triedPeer.push(event.data.peerId);
          if (targetPeers.length <= triedPeer.length) {
            resetNetwork();
            EventSystem.unregister(triedPeer);
            // this.closeIfConnected();
          }
        });
    });
}
const resetNetwork = ()=> {
  if (Network.peers.length < 1) {
    Network.open();
    PeerCursor.myCursor.peerId = Network.peerId;
  }
}
