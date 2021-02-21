import { environment } from 'src/environments/environment'

const fetchUrl = 'https://sheets.googleapis.com/v4/spreadsheets'

const cache = new Map()
const createBookData = (c) => ({
  title: c.properties.title,
  sheets: c.sheets.map((sheet) => sheet.properties.title),
})
export const getBookData = async (
  spreadId: string,
): Promise<{ title: string; sheets: string[] }> => {
  const url = `${fetchUrl}/${spreadId}?key=${environment.googleSpreadApiKey}`
  const c = cache.get(url)

  if (c) {
    return createBookData(c)
  }
  const res = await fetch(url)
  const json = await res.json()
  cache.set(url, json)
  if(json && json.properties && json.properties.title && json.sheets && json.sheets.length){
    return createBookData(json)
  }
  return null
}

export const getSheetData = async (
  spreadId: string,
  sheet: string,
  range: string,
): Promise<{ values: string[][] }> => {
  const res = await fetch(
    `${fetchUrl}/${spreadId}/values/${sheet}!${range}?key=${environment.googleSpreadApiKey}`,
  )
  if (res.status >= 400) {
    // throw new Error('spread sheet read failed')
    console.error('error', res.url)
    console.error(res.status, res.statusText)

    return { values: [[]] }
  }
  const json = await res.json()
  if (!json.values) {
    console.log('can not get values', json)
    return { values: [[]] }
  }

  return json as { values: string[][] }
}
