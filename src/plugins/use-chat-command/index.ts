import { CounterBoardWindowComponent } from '../add-counter-board/extend/component/counter-board-window/counter-board-window.component';
import { pluginConfig } from '../config';
import { outerApp } from '../extends/app.component';
import { fetchZip } from '../first-fetch-zip-room/extend/app.component';

import { outerGameBoard } from './game-board';
import { alignmentCards, createHandStorage } from './hand-storage';
import { breakStack, moveTarget } from './target-control';

const parseChatCommand = (text: string) => {
  const regArray = /^\/(\w+)(?:\s+(.*))?/gi.exec(text);
  if (!regArray) return null;
  return {
    command: regArray[1],
    args: regArray[2],
  };
};
export const useChatCommand = (text: string) => {
  if (!pluginConfig.useChatCommand) return;
  const command = parseChatCommand(text);
  if (!command) return;
  switch (command.command) {
    case 'load':
      fetchZip(command.args);
      break;
    case 'view_transform':
      outerGameBoard.setTransform(
        ...command.args.split(',').map((v: string) => Number(v)),
      );

      break;
    case 'move_character':
      moveTarget(command.args, outerGameBoard.tabletopService.characters);
      break;

    case 'move_cardstack':
      moveTarget(command.args, outerGameBoard.tabletopService.cardStacks);
      break;
    case 'move_card':
      moveTarget(command.args, outerGameBoard.tabletopService.cards);
      break;
    case 'move_terrain':
      moveTarget(command.args, outerGameBoard.tabletopService.terrains);
      break;
    case 'param_terrain': {
      const [name, key, value] = command.args.split(',');
      const terrain = outerGameBoard.tabletopService.terrains.find(
        (t) => t.name === name,
      );

      if (terrain) {
        const countElement =
          terrain.detailDataElement.getFirstElementByName(key);
        countElement.value = `${value}`;
        countElement.update();
      }
      break;
    }

    case 'create_hand_storage': {
      const [name, x, y, width, height] = command.args.split(',');
      createHandStorage({
        name,
        x: Number(x),
        y: Number(y),
        width: Number(width),
        height: Number(height),
        opacity: 100,
      });
      break;
    }

    case 'break_stack':
      breakStack(command.args, outerGameBoard.tabletopService.cardStacks);
      break;
    case 'board_alignment':
      const s = outerGameBoard.handStorageService.handStorages.find(
        (handStorage) => handStorage.name === command.args,
      );

      if (s) {
        alignmentCards(s, outerGameBoard.tabletopService.cards);
      }
      break;
    case 'open_counter_board':
      outerApp.panelService.open(CounterBoardWindowComponent, {
        width: 500,
        height: 450,
        left: 300,
        top: 100,
      });
      break;
    default:
      console.log('unknown command', command);
      break;
  }
};
