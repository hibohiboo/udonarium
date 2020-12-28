import { EventEmitter } from "@angular/core";
import { ChatTab } from "@udonarium/chat-tab"
import { FileStorageComponent } from "component/file-storage/file-storage.component";
import config from "./config"
import { ChatTab as DiceTableChat } from "./lily/dice-table/class/chat-tab"
import { FileStorageComponentLily } from "./lily/file/component/file-storage/file-storage.component";

export default {
  chatTabFactory(identifier: string){
    if (config.useLilyDiceTable) { return new DiceTableChat(identifier); }
    return new ChatTab(identifier)
  },
  storageComponentFactory(){
    if(config.useLilyFile) { return FileStorageComponentLily; }
    return FileStorageComponent;
  }
}
