import { ChatMessage } from '@udonarium/chat-message'
import config from '../config'
import * as utility from '../utility'

export default {
  chatTabOnChildAddedHook(child: ChatMessage) {
    if (
      config.useSpreadSheetSigninButton &&
      !window.gapi.auth2.getAuthInstance().isSignedIn.get()
    ) {
      return false
    }
    addSpreadSheet(child)
    return false
  },
}

interface Window {
  gapi: any
}
declare let window: Window & typeof globalThis

async function addSpreadSheet({
  timestamp = 0,
  tabIdentifier = '',
  text = '',
  name = '',
}) {
  const spreadsheetId = utility.getQueryValue('spreadsheet')
  if (!spreadsheetId) return
  const params = {
    spreadsheetId,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  }
  const time = new Date(timestamp + 32400000) // 60 * 60 * 1000 * 9.UTCとJSTの時差9時間
  const body = {
    values: [[name, text, time, tabIdentifier]],
  }
  try {
    const response = (
      await window.gapi.client.sheets.spreadsheets.values.append(params, body)
    ).data
  } catch (err) {
    console.error(err)
  }
}

export const peerMenuMethods = config.useSpreadSheetSigninButton
  ? {
      handleSignInClick() {
        window.gapi.auth2.getAuthInstance().signIn()
      },
      handleSignOutClick() {
        window.gapi.auth2.getAuthInstance().signOut()
      },
      showSignin() {
        return (
          window.gapi &&
          window.gapi.auth2 &&
          !window.gapi.auth2.getAuthInstance().isSignedIn.get()
        )
      },
      showSignout() {
        return (
          window.gapi &&
          window.gapi.auth2 &&
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        )
      },
    }
  : {
      handleSignInClick() {
        return
      },
      handleSignOutClick() {
        return
      },
      showSignin() {
        return false
      },
      showSignout() {
        return false
      },
    }
