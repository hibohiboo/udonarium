import { EventEmitter } from "@angular/core";
import { ChatTab } from "@udonarium/chat-tab"
import { GameCharacter } from "@udonarium/game-character";
import { FileSelecterComponent } from "component/file-selecter/file-selecter.component";
import { FileStorageComponent } from "component/file-storage/file-storage.component";
import config from "./config"
import { FileSelecterComponentLily } from "./lily/file/component/file-selecter/file-selecter.component";
import { FileStorageComponentLily } from "./lily/file/component/file-storage/file-storage.component";

export default {
  storageComponentFactory(){
    if(config.useLilyFile) { return FileStorageComponentLily; }
    return FileStorageComponent;
  },
  storageSelectorComponentFactory(){
    if(config.useLilyFile) return FileSelecterComponentLily;
    return FileSelecterComponent;
  },
  chatInputEventEmitterFactory(){
    if(config.useLilyStand) return new EventEmitter<{ text: string, gameType: string, sendFrom: string, sendTo: string ,tachieNum: number }>();
    return new EventEmitter<{ text: string, gameType: string, sendFrom: string, sendTo: string }>();
  },
  chatInputChatMessageFactory(that){
    const retObj = { text: that.text, gameType: that.gameType, sendFrom: that.sendFrom, sendTo: that.sendTo };

    if(config.useLilyStand){
      console.log('円柱TEST event: KeyboardEvent '+that.sendFrom + '  ' + that.tachieNum);
      return {...retObj, tachieNum : that.tachieNum };
    }

    return retObj;
  }
}
