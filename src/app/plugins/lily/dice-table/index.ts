import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { Listener } from '@udonarium/core/system';

import { StringUtil } from '@udonarium/core/system/util/string-util';
import { DiceBot } from '@udonarium/dice-bot';
import { ChatMessage } from '@udonarium/chat-message';
import { DiceTable } from './class/dice-table';

interface DiceRollResult {
  result: string;
  isSecret: boolean;
}

const getDiceTables = (): DiceTable[] => {
  return ObjectStore.instance.getObjects(DiceTable);
}

export default {
  diceBotOnStoreAddedHook(listener: Listener){
    const diceBot = listener.key;

    listener.on('DICE_TABLE_MESSAGE', async event => {
      console.log('ダイス表判定');

      let chatMessage = ObjectStore.instance.get<ChatMessage>(event.data.messageIdentifier);
      if (!chatMessage || !chatMessage.isSendFromSelf || chatMessage.isSystem) return;

      let text: string = StringUtil.toHalfWidth(chatMessage.text);
      let splitText = text.split(/\s/);

      let diceTable = getDiceTables() ;
      if( !diceTable )return;
      if( splitText.length == 0 )return;

      console.log('コマンド候補:' + splitText[0] );

      let rollTable = null;
      for( let table of diceTable){
        if( table.command == splitText[0] ){
          rollTable = table;
        }
      }
      if( !rollTable ) return;

      try {
        let regArray = /^((\d+)?\s+)?([^\s]*)?/ig.exec(rollTable.dice);
        let repeat: number = (regArray[2] != null) ? Number(regArray[2]) : 1;
        let rollText: string = (regArray[3] != null) ? regArray[3] : text;
        let finalResult: DiceRollResult = { result: '', isSecret: false };
        for (let i = 0; i < repeat && i < 32; i++) {
          let rollResult = await DiceBot.diceRollAsync(rollText, rollTable.diceTablePalette.dicebot);
          if (rollResult.result.length < 1) break;

          finalResult.result += rollResult.result;
          finalResult.isSecret = finalResult.isSecret || rollResult.isSecret;
          if (1 < repeat) finalResult.result += ` #${i + 1}`;
        }
        console.log('finalResult.result:' + finalResult.result );

        let rolledDiceNum = finalResult.result.match(/\d+$/);
        let tableAns = "ダイス目の番号が表にありません";
        if( rolledDiceNum ){
          console.log('rolledDiceNum:' + rolledDiceNum[0] );

          let tablePalette = rollTable.diceTablePalette.getPalette();
            console.log('tablePalette:' + tablePalette );
          for( let i in tablePalette ){
            console.log('oneTable:' + tablePalette[i] );

            let splitOneTable = tablePalette[i].split(/[:：,，\s]/);
            if( splitOneTable[0] == rolledDiceNum[0] ){
              tableAns = tablePalette[i];
            }
          }

        }
        finalResult.result += '\n'+tableAns;
        diceBot.sendResultMessage(finalResult , chatMessage);

      } catch (e) {
        console.error(e);
      }
      return;
    });
  }
}
