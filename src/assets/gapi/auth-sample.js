const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const CLIENT_ID = 'hogehoge.apps.googleusercontent.com';
const API_KEY = 'fugafuga';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function handleClientLoad() {
  gapi.load('client:auth2',  authorization);
}

async function authorization() {
  try{
    const auth = await authorize()
    await gapi.client.init({
      apiKey: API_KEY,
      'clientId': CLIENT_ID,
      'scope': SCOPES,
      'discoveryDocs': DISCOVERY_DOCS,
    })
  }catch(err){
    console.log('authError', err)
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
