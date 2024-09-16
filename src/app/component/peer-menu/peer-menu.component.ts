import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { PeerContext } from '@udonarium/core/system/network/peer-context';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';

import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { LobbyComponent } from 'component/lobby/lobby.component';
import { AppConfigService } from 'service/app-config.service';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { peerMenuMethods } from 'src/app/plugins/plus/insert-spreadsheet';
import factory from 'src/app/plugins/factory';
import config from 'src/app/plugins/config';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'peer-menu',
  templateUrl: './peer-menu.component.html',
  styleUrls: ['./peer-menu.component.css'],
  // start with fly
  animations: [
    trigger('fadeInOut', [
      transition('false => true', [
        animate('50ms ease-in-out', style({ opacity: 1.0 })),
        animate('900ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
  // end with fly
})
export class PeerMenuComponent implements OnInit, OnDestroy, AfterViewInit {

  targetUserId: string = '';
  networkService = Network
  gameRoomService = ObjectStore.instance;
  help: string = '';

  // start with fly
  @ViewChild('idInput') idInput: ElementRef;
  @ViewChild('idSpacer') idSpacer: ElementRef;
  isCopied = false;
  private _timeOutId;

  get usePlayerColor(): boolean { return config.usePlayerColor; }
  get myPeerName(): string {
    if (!PeerCursor.myCursor) return null;
    return PeerCursor.myCursor.name;
  }
  set myPeerName(name: string) {
    if (window.localStorage) {
      localStorage.setItem(PeerCursor.CHAT_MY_NAME_LOCAL_STORAGE_KEY, name);
    }
    if (PeerCursor.myCursor) PeerCursor.myCursor.name = name;
  }

  get myPeerColor(): string {
    if (!PeerCursor.myCursor) return PeerCursor.CHAT_DEFAULT_COLOR;
    return PeerCursor.myCursor.color;
  }
  set myPeerColor(color: string) {
    if (PeerCursor.myCursor) {
      PeerCursor.myCursor.color = (color == PeerCursor.CHAT_TRANSPARENT_COLOR) ? PeerCursor.CHAT_DEFAULT_COLOR : color;
    }
    if (window.localStorage) {
      localStorage.setItem(PeerCursor.CHAT_MY_COLOR_LOCAL_STORAGE_KEY, PeerCursor.myCursor.color);
    }
  }
  // end with fly

  get myPeer(): PeerCursor { return PeerCursor.myCursor; }

  constructor(
    private ngZone: NgZone,
    private modalService: ModalService,
    private panelService: PanelService,
    public appConfigService: AppConfigService
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = '接続情報');
  }

  ngAfterViewInit() {
    EventSystem.register(this)
      .on('OPEN_NETWORK', event => {
        this.ngZone.run(() => { });
        if (config.usePlayerColor && this.idInput && this.idInput.nativeElement) this.idInput.nativeElement.style.width = this.idSpacer.nativeElement.getBoundingClientRect().width + 'px';
      });
      if (config.usePlayerColor && this.idInput && this.idInput.nativeElement) this.idInput.nativeElement.style.width = this.idSpacer.nativeElement.getBoundingClientRect().width + 'px';
  }

  ngOnDestroy() {
    if (config.usePlayerColor) clearTimeout(this._timeOutId);
    EventSystem.unregister(this);
  }

  changeIcon() {
    this.modalService.open<string>(factory.storageSelectorComponentFactory()).then(value => {
      if (!this.myPeer || !value) return;
      this.myPeer.imageIdentifier = value;
    });
  }

  connectPeer() {
    let targetUserId = this.targetUserId;
    this.targetUserId = '';
    if (targetUserId.length < 1) return;
    this.help = '';
    let context = PeerContext.create(targetUserId);
    if (context.isRoom) return;
    ObjectStore.instance.clearDeleteHistory();
    Network.connect(context.peerId);
  }

  showLobby() {
    this.modalService.open(LobbyComponent, { width: 700, height: 400, left: 0, top: 400 });
  }

  findUserId(peerId: string) {
    const peerCursor = PeerCursor.findByPeerId(peerId);
    return peerCursor ? peerCursor.userId : '';
  }

  findPeerName(peerId: string) {
    const peerCursor = PeerCursor.findByPeerId(peerId);
    return peerCursor ? peerCursor.name : '';
  }

  handleSignInClick() {
    peerMenuMethods.handleSignInClick();
  }

  handleSignOutClick() {
    peerMenuMethods.handleSignOutClick();
  }
  showSignin() {
    return peerMenuMethods.showSignin();
  }
  showSignout() {
    return peerMenuMethods.showSignout();
  }

  // start with fly
  findPeerColor(peerId: string) {
    const peerCursor = PeerCursor.findByPeerId(peerId);
    return peerCursor ? peerCursor.color : '';
  }

  copyPeerId() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.networkService.peerContext.userId);
      this.isCopied = true;
      clearTimeout(this._timeOutId);
      this._timeOutId = setTimeout(() => {
        this.isCopied = false;
      }, 1000);
    }
  }

  isAbleClipboardCopy(): boolean {
    return navigator.clipboard ? true : false;
  }
  // end with fly
}
