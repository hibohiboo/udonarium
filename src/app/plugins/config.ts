const useKeyboardHelp = location.search.includes('keyboardHelp=true')
const use2dMode = location.search.includes('2d=true')
const useCardTap = location.search.includes('cardTap=true')
const usePostMessage = location.search.includes('usePostMessage=true')
const useSpreadSheet = location.search.includes('spreadsheet')
const useSpreadSheetSigninButton = location.search.includes('ss_auto=false')
const useDeckSpreadSheet = location.search.includes('decksheet')
const useLilyCutin = location.search.includes('lily_cutin=true')
const useLilyStand = location.search.includes('lily_stand=true')
const useLilyDiceTable = location.search.includes('lily_dacetable=true')
const useLilyFile = location.search.includes('lily_file=true')
const useLilyBuffer = location.search.includes('lily_buffer=true')

export default {
  useKeyboardHelp,
  useCardTap,
  get use2dMode(){ return use2dMode},
  get usePostMessage(){return true},
  useSpreadSheet,
  useSpreadSheetSigninButton,
  useDeckSpreadSheet,
  useLilyCutin,
  useLilyStand,
  useLilyDiceTable,
  useLilyFile,
  get useLilyBuff(){
    return useLilyBuffer || useLilyStand;
  }
}
