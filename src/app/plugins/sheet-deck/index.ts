import { Card } from "@udonarium/card";
import { CardStack } from "@udonarium/card-stack";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { ContextMenuAction } from "service/context-menu.service";
import { getSheetData, getBookData } from "./spreadSheet";
import * as utility from '../utility';
import type { PointerCoordinate } from "service/pointer-device.service";

function createDeck(name: string, position: PointerCoordinate, decks: {name:string, front:string,back:string}[]): CardStack {
  const cardStack = CardStack.create(`${name}山札`);
  cardStack.location.x = position.x - 25;
  cardStack.location.y = position.y - 25;
  cardStack.posZ = position.z;

  decks.forEach(({name, front, back}) => {
    if (!ImageStorage.instance.get(front)) {
      ImageStorage.instance.add(front);
    }
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back);
    }
    const card = Card.create(name, front, back);
    cardStack.putOnBottom(card);
  });

  return cardStack;
}

export async function getDeckMenu(position: PointerCoordinate): Promise<ContextMenuAction> {
  let spreadsheetId = utility.getQueryValue('decksheet')
  if(!spreadsheetId) return;
  const book = await getBook(spreadsheetId)
  const subMenus: ContextMenuAction[] = book.sheets.map(name=>({
    name,
    action: async () => {
      const decks = await getSheet(spreadsheetId, name);
      console.log('decks', decks)
      createDeck(name, position, decks);
      SoundEffect.play(PresetSound.cardPut);
    }
  }));
  return {
    name: `${book.title}の山札を作成`,
    action: null,
    subActions: subMenus
  };
}
export const getBook = async (spreadId) => getBookData(spreadId)
export const getSheet = async (spreadId, title) =>{
  const data = await getSheetData(spreadId, title, 'C4:E')
  return data.values.map(([name, front, back])=>({ name, front, back}));
}

