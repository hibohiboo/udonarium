const useKeyboardHelp = location.search.includes('keyboardHelp=true')
const use2dMode = location.search.includes('2d=true')
const useCardTap = location.search.includes('cardTap=true')
const usePostMessage = location.search.includes('usePostMessage=true')
const useSpreadSheet = location.search.includes('spreadsheet')
const useSpreadSheetSigninButton = location.search.includes('ss_auto=false')
const useDeckSpreadSheet = location.search.includes('decksheet')
const hideSample = location.search.includes('hide_sample=true')
const useKeyboardShortcut = location.search.includes('keyboard_shortcut=true')

const useLilyCutin = location.search.includes('lily_cutin=true')
const useLilyStand = location.search.includes('lily_stand=true')
const useLilyDiceTable = location.search.includes('lily_dacetable=true')
const useLilyFile = location.search.includes('lily_file=true')
const useLilyBuff = location.search.includes('lily_buff=true')
const useLilyRemocon = location.search.includes('lily_remocon=true')
const useLilyTalkFlg = location.search.includes('lily_talk_flg=true')
const useLilyHideInventoryFlg = location.search.includes('lily_hide_inventory_flg=true')


export default {
  useKeyboardHelp,
  useCardTap,
  get use2dMode(){ return use2dMode},
  get usePostMessage(){return usePostMessage},
  useSpreadSheet,
  useSpreadSheetSigninButton,
  useDeckSpreadSheet,
  useLilyCutin,
  useLilyDiceTable,
  useLilyFile,
  get useLilyRemocon() {
    return useLilyRemocon || useLilyBuff || useLilyStand
  },
  useLilyBuff,
  useLilyStand,
  useLilyTalkFlg,
  useLilyHideInventoryFlg,
  hideSample,
  useKeyboardShortcut,
}
