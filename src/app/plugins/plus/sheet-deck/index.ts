import { Card } from '@udonarium/card'
import { CardStack } from '@udonarium/card-stack'
import { ImageStorage } from '@udonarium/core/file-storage/image-storage'
import { PresetSound, SoundEffect } from '@udonarium/sound-effect'
import { ContextMenuAction } from 'service/context-menu.service'
import { getSheetData, getBookData } from './spreadSheet'
import * as utility from '../../utility'
import type { PointerCoordinate } from 'service/pointer-device.service'
import { environment } from 'src/environments/environment'

function createDeck(
  name: string,
  position: PointerCoordinate,
  decks: { name: string; front: string; back: string }[],
): CardStack {
  const cardStack = CardStack.create(`${name}山札`)
  cardStack.location.x = position.x - 25
  cardStack.location.y = position.y - 25
  cardStack.posZ = position.z

  decks.forEach(({ name, front, back }) => {
    if (!ImageStorage.instance.get(front)) {
      ImageStorage.instance.add(front)
    }
    if (!ImageStorage.instance.get(back)) {
      ImageStorage.instance.add(back)
    }
    const card = Card.create(name, front, back)
    cardStack.putOnBottom(card)
  })

  return cardStack
}

export async function getDeckMenu(
  position: PointerCoordinate,
): Promise<ContextMenuAction> {
  const spreadsheetId = utility.getQueryValue('decksheet')
  if (!spreadsheetId) return
  const book = await getBook(spreadsheetId)
  if (!book) return
  const subMenus: ContextMenuAction[] = book.sheets.map((name) => ({
    name,
    action: async () => {
      const decks = await getSheet(spreadsheetId, name)
      console.log('decks', decks)
      createDeck(name, position, decks)
      SoundEffect.play(PresetSound.cardPut)
    },
  }))
  return {
    name: `${book.title}の山札を作成`,
    action: null,
    subActions: subMenus,
  }
}
export const getBook = async (spreadId) => getBookData(spreadId)
export const getSheet = async (spreadId, title) => {
  const data = await getSheetData(spreadId, title, 'C4:E')
  const dataWithImages = await Promise.all(
    data.values.map(async ([name, front, back]) => ({
      name,
      front: await getImage(front),
      back: await getImage(back),
    })),
  )
  // resetCache();
  return dataWithImages
}
const getImage = async (urlOrBase64) => {
  if (urlOrBase64.indexOf('http') === 0) {
    return urlOrBase64
  }
  const ret = getCache(urlOrBase64)
  if (ret) {
    return ret
  }

  const res = await fetch(
    `${environment.getImageUrl}?fileId=${urlOrBase64}&key=${environment.imageUrlKey}`,
  )
  const json = await res.json()
  const extend = json.fileName.match(/[^.]+$/)
  const encodedUrl = `data:image/${extend};base64,${json.encoded}`
  setCache(urlOrBase64, encodedUrl)
  return encodedUrl
}
let cache = {}
const getCache = (key) => cache[key]

const setCache = (key, obj) => {
  cache[key] = obj
}

const resetCache = () => {
  cache = {}
}

/*******************************
 * gasでシートを作成
 *
 function get_Filenames() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheets()[0]
  const folderUrl = sheet.getRange('B1').getValue();
  const backUrl = sheet.getRange('D1').getValue();
  const folderId= folderUrl.split('/').pop();
  const folder = DriveApp.getFolderById(folderId);　
  const files= folder.getFiles();

  const rows = [];
  while(files.hasNext()){
    const file = files.next();
    const url = `https://drive.google.com/uc?export=view&id=${file.getId()}&usp=sharing`

    rows.push([`=image("${url}")`,`=image("${backUrl}")`, file.getName(),url, backUrl])
  }

  const startRowNumber = 4
  const startColNumber = 1
  const rowsCount = rows.length
  const colsCount = rows[0].length
  sheet.getRange(startRowNumber, startColNumber, rowsCount, colsCount).setValues(rows);
}
 */

/**
 *
function doGet(e) {
  const file = DriveApp.getFileById(e.parameter.fileId);

  const blob = file.getBlob();
  const encoded = Utilities.base64Encode(blob.getBytes());
  const data = {fileName: file.getName(), encoded};
  const payload = JSON.stringify(data)
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(payload);

  return output;
}
 */
