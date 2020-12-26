import { ChatMessage } from "@udonarium/chat-message";
import config from "../config";

export default {
  chatTabOnChildAddedHook(child: ChatMessage){
    if(config.useSpreadSheetSigninButton && !gapi.auth2.getAuthInstance().isSignedIn.get()){ return false}
    addSpreadSheet(child);
    return false;
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

export const peerMenuMethods = {
  handleSignInClick(){
    if(!config.useSpreadSheetSigninButton) return;
    gapi.auth2.getAuthInstance().signIn();
  },
  handleSignOutClick(){
    if(!config.useSpreadSheetSigninButton) return;
    gapi.auth2.getAuthInstance().signOut();
  },
  showSignin(){
    if(!config.useSpreadSheetSigninButton) return false;
    return gapi.auth2 && !gapi.auth2.getAuthInstance().isSignedIn.get();
  },
  showSignout(){
    if(!config.useSpreadSheetSigninButton) return false;
    return gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get();
  }
}
