import { ChatMessage } from "@udonarium/chat-message";

export default {
  chatTabOnChildAddedHook(child: ChatMessage){
    addSpreadSheet(child);
    return true;
  }
}

interface Window {
  gapi: any
}
declare var window: Window & typeof globalThis
const gapi = window.gapi

async function addSpreadSheet({timestamp=0, tabIdentifier="",text="",name=""}) {
  let spreadsheetId = null;
  location.search.replace('?', '').split('&').forEach(set=>{
    const [id, value] = set.split('=');
    if(id==='spreadsheet'){
      spreadsheetId =value
    }
  })
  if(!spreadsheetId) return;
  const params = {
    spreadsheetId,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };
  const time = new Date(timestamp + 32400000) // 60 * 60 * 1000 * 9.UTCとJSTの時差9時間
  const body = {
    values: [[name,text,time,tabIdentifier]],
  }
  try {
    const response = (await gapi.client.sheets.spreadsheets.values.append(params, body)).data;
  } catch (err) {
    console.error(err);
  }
}
