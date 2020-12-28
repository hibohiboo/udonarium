import { ChatTab } from "@udonarium/chat-tab"
import config from "./config"
import { ChatTab as DiceTableChat } from "./lily/dice-table/class/chat-tab"

export default {
  chatTabFactory(identifier: string){
    if (config.useLilyDiceTable) { return new DiceTableChat(identifier); }
    return new ChatTab(identifier)
  }
}
