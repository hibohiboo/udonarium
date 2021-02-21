import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChatMessage } from '@udonarium/chat-message';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerContext } from '@udonarium/core/system/network/peer-context';
import { ResettableTimeout } from '@udonarium/core/system/util/resettable-timeout';
import { DiceBot } from '@udonarium/dice-bot';
import { GameCharacter } from '@udonarium/game-character';
import { PeerCursor } from '@udonarium/peer-cursor';
import { TextViewComponent } from 'component/text-view/text-view.component';
import { BatchService } from 'service/batch.service';
import { ChatMessageService } from 'service/chat-message.service';
import { ModalService } from 'service/modal.service';
import { PanelOption, PanelService } from 'service/panel.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { chatInputAllowsChatHook, chatInputGetImageFileHook, chatInputInitHook } from 'src/app/plugins';
import config from 'src/app/plugins/config';
import factory from 'src/app/plugins/factory';


@Component({
  selector: 'user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit, OnDestroy {
  @Input() onlyCharacters: boolean = false;
  @Input() chatTabidentifier: string = '';
  @Input('sendFrom') _sendFrom: string = this.myPeer ? this.myPeer.identifier : '';
  @Output() sendFromChange = new EventEmitter<string>();
  get sendFrom(): string { return this._sendFrom };
  set sendFrom(sendFrom: string) {
    this._sendFrom = sendFrom;
    this.sendFromChange.emit(sendFrom);
    const object = ObjectStore.instance.get(this.sendFrom);
    this.myPeer.speechIdentifier = object.identifier;
  }
  networkService = Network
  gameHelp: string = '';

  get imageFile(): ImageFile {

    let object = ObjectStore.instance.get(this.sendFrom);
    let image: ImageFile = null;
    if (object instanceof GameCharacter) {
      image = object.imageFile;
    } else if (object instanceof PeerCursor) {
      image = object.image;
    }
    return image ? image : ImageFile.Empty;
  }

  private shouldUpdateCharacterList: boolean = true;
  private _gameCharacters: GameCharacter[] = [];
  get gameCharacters(): GameCharacter[] {
    if (this.shouldUpdateCharacterList) {
      this.shouldUpdateCharacterList = false;
      this._gameCharacters = ObjectStore.instance
        .getObjects<GameCharacter>(GameCharacter)
        .filter(character => this.allowsChat(character));
    }
    return this._gameCharacters;
  }



  speechingPeers: Map<string, ResettableTimeout> = new Map();
  speechingPeerNames: string[] = [];
  private _speechThreshold: number = 50;
  get speechThreshold(){return this._speechThreshold; }
  set speechThreshold(val){ this._speechThreshold = val}
  private _volume: number=0;
  get volume(){return this._volume; }
  set volume(val){ this._volume = val}
  get diceBotInfos() { return DiceBot.diceBotInfos }
  get myPeer(): PeerCursor { return PeerCursor.myCursor; }
  get otherPeers(): PeerCursor[] { return ObjectStore.instance.getObjects(PeerCursor).filter(peer=>peer.peerId !== this.myPeer.peerId); }

  constructor(
    private ngZone: NgZone,
    public chatMessageService: ChatMessageService,
    private batchService: BatchService,
    private panelService: PanelService,
    private pointerDeviceService: PointerDeviceService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    // this.chatTabidentifier = this.panelService.chatTab.identifier;
    Promise.resolve().then(() => this.modalService.title = this.panelService.title =
      '発言状態')

    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (event.data.aliasName !== GameCharacter.aliasName) return;
        this.shouldUpdateCharacterList = true;
        if (event.data.identifier !== this.sendFrom) return;
        let gameCharacter = ObjectStore.instance.get<GameCharacter>(event.data.identifier);
        if (gameCharacter && !this.allowsChat(gameCharacter)) {
          if (0 < this.gameCharacters.length && this.onlyCharacters) {
            this.sendFrom = this.gameCharacters[0].identifier;
          } else {
            this.sendFrom = this.myPeer.identifier;
          }
        }
      })
      .on<string>('SPEECHING_A_MESSAGE', event => {
        if (!this.speechingPeers.has(event.sendFrom)) {
          this.speechingPeers.set(event.sendFrom, new ResettableTimeout(() => {
            this.speechingPeers.delete(event.sendFrom);
            this.updatespeechingPeerNames();
            this.ngZone.run(() => { });
          }, 1000));
        }
        this.speechingPeers.get(event.sendFrom).reset();
        this.updatespeechingPeerNames();
        this.batchService.add(() => this.ngZone.run(() => { }), this);
      });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
    this.batchService.remove(this);
  }

  private updatespeechingPeerNames() {
    this.speechingPeerNames = Array.from(this.speechingPeers.keys()).map(peerId => {
      let peer = PeerCursor.findByPeerId(peerId);
      return peer ? peer.name : '';
    });
  }


  private _isSpeechConnect = false;
  get isSpeechConnect(){return this._isSpeechConnect}
  set isSpeechConnect(b){this._isSpeechConnect = b}

  async speechStart(){
    const that = this;
    // 事前準備
    const initAudio = async (callback) => {
      // 音声のみ取得する場合は引数を{audio: true}に設定する
      // 成功ハンドラが引数としてMediaStreamオブジェクトを受け取る
      try{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx= new AudioContext();
        const analyser = ctx.createAnalyser();
        const frequencies = new Uint8Array(analyser.frequencyBinCount);
        const getByteFrequencyDataAverage = () => {
          // 配列に周波数ごとの振幅を格納
          analyser.getByteFrequencyData(frequencies);
          // 解析結果の全周波数の振幅を、合計し、要素数で割ることで、平均を求める
          return frequencies.reduce((previous, current) => previous + current, 0) / analyser.frequencyBinCount;
        };
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        // ctx.createMediaStreamSource(stream).connect(ctx.destination);
        // Firefoxには、グローバルに保持しておかないとMediaStreamオブジェクトへの参照が時間経過でなくなってしまうバグがある
        globalThis.hackForMozzila = stream;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const draw = async () => {
          const vol = Math.floor(getByteFrequencyDataAverage());
          callback(vol)
          // window.setTimeout(draw, 1000)
          if(!that.isSpeechConnect){
            await ctx.close();
            callback(0)
            return;
          }
          requestAnimationFrame(draw)
        };

        await draw();
      }catch(e){
        console.log(e)
      }
    }
    // ↑↑ 事前準備ここまで

    this.isSpeechConnect = true;

    await initAudio((vol: number)=>{
      this.volume = vol;
      if(vol>this.speechThreshold){
        EventSystem.call('SPEECHING_A_MESSAGE', "")
      }
    });
  }

  speechEnd(){
    this.isSpeechConnect = false;
  }

  private allowsChat(gameCharacter: GameCharacter): boolean {
    const hookResult = chatInputAllowsChatHook(gameCharacter, this.myPeer.peerId);
    if(hookResult !==undefined) return hookResult;
    switch (gameCharacter.location.name) {
      case 'table':
      case this.myPeer.peerId:
        return true;
      case 'graveyard':
        return false;
      default:
        for (const conn of Network.peerContexts) {
          if (conn.isOpen && gameCharacter.location.name === conn.peerId) {
            return false;
          }
        }
        return true;
    }
  }
  findPeerColor(peerId: string) {
    const peerCursor = PeerCursor.findByPeerId(peerId);
    return peerCursor ? peerCursor.color : '';
  }
  findSpeechName(peer: PeerCursor){
    const character = this.gameCharacters.find(g=>g.identifier === peer.speechIdentifier)
    if(!character) return ''
    return character.name;
  }
  isSpeeching(peer: PeerCursor){
    return this.speechingPeers.has(peer.peerId)
  }
  speechPeerImages(peer: PeerCursor){
    const image = this.getCharacterSpeechImg(peer);
    return image.map(img=>img.url);
  }

  private getCharacterSpeechImg(peer: PeerCursor): ImageFile[]{
    let object = ObjectStore.instance.get(peer.speechIdentifier);
    if(!object || !(object instanceof GameCharacter)) return [peer.image];

    if(!this.speechingPeers.has(peer.peerId)) return [object.imageFile];

    const [speeching1, speeching2] = object.imageDataElement.getElementsByName('発言中')
    if(!speeching1){
      return [object.imageFile];
    }
    let image1:ImageFile = ImageStorage.instance.get(<string>speeching1.value);

    if(!speeching2){
      return [image1];
    }
    let image2:ImageFile = ImageStorage.instance.get(<string>speeching2.value);

    return [image1, image2];
  }
}
