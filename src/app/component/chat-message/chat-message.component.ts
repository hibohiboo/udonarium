import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ChatMessage } from '@udonarium/chat-message';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { PeerCursor } from '@udonarium/peer-cursor';
import { ChatMessageService } from 'service/chat-message.service';
import config from 'src/app/plugins/config';
import { chatTabList } from 'src/app/plugins/lily/chat-color/class/chat-message.component';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  animations: [
    trigger('flyInOut', [
      transition('* => active', [
        animate('200ms ease-out', keyframes([
          style({ transform: 'translateX(100px)', opacity: '0', offset: 0 }),
          style({ transform: 'translateX(0)', opacity: '1', offset: 1.0 })
        ]))
      ]),
      transition('void => *', [
        animate('200ms ease-out', keyframes([
          style({ opacity: '0', offset: 0 }),
          style({ opacity: '1', offset: 1.0 })
        ]))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.Default
})

export class ChatMessageComponent implements OnInit, AfterViewInit {
  @Input() chatMessage: ChatMessage;
  imageFile: ImageFile = ImageFile.Empty;
  animeState: string = 'inactive';

  get useLilyMessageColor(): boolean { return config.useLilyMessageColor }
  get chatTabList() { return chatTabList() } // lily

  // start with fly
  get isMine(): boolean {
    return PeerCursor.myCursor.userId.substring(0, 5) == this.chatMessage.from.substring(0, 5)
    || PeerCursor.myCursor.userId.substring(0, 5) == this.chatMessage.originFrom.substring(0, 5);
  }
  get isMyMessage(): boolean {
    return PeerCursor.myCursor.userId.substring(0, 5) == this.chatMessage.from.substring(0, 5);
  }
  get usePlayerColor(){ return config.usePlayerColor; }
  get playerColor() { return PeerCursor.myCursor.color; }
  // end with fly

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    let file: ImageFile = this.chatMessage.image;
    if (file) this.imageFile = file;
    let time = this.chatMessageService.getTime();
    if (time - 10 * 1000 < this.chatMessage.timestamp) this.animeState = 'active';
  }

  ngAfterViewInit() {
  }

  discloseMessage() {
    this.chatMessage.tag = this.chatMessage.tag.replace('secret', '');
  }
}
