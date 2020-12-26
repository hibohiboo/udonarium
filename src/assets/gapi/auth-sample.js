// auth.jsにリネームして、CLIENT_IDとAPI_KEYを適切なものに変更すること
// https://qiita.com/hibohiboo/items/38e1f29c9cce345fccfe

const CLIENT_ID = 'hogehoge.apps.googleusercontent.com';
const API_KEY = 'fugafuga';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

function handleClientLoad() {
  if(!location.search.includes('spreadsheet'))return;
  gapi.load('client:auth2',  authorization);
}

async function authorization() {
  try{
    if (!location.search.includes('ss_auto=false')) {
      const auth = await authorize()
    } else {
      gapi.auth2.init({client_id: CLIENT_ID})
    }
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: DISCOVERY_DOCS,
    })
  }catch(err){
    console.error('authError', err)
  }
}
function authorize(){
  return new Promise((resolve, reject) => {
    gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: false}, function(authResult) {
      if (authResult && !authResult.error) {
        resolve(authResult)
      } else {
        reject(authResult.error)
      }
    });
  })
}
