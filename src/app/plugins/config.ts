const useKeyboardHelp = location.search.includes('keyboardHelp=true')
const use2dMode = location.search.includes('2d=true')
const useCardTap = location.search.includes('cardTap=true')
const usePostMessage = location.search.includes('usePostMessage=true')
const useSpreadSheet = location.search.includes('spreadsheet=')
const useSpreadSheetSigninButton = location.search.includes('ss_auto=false')
const useDeckSpreadSheet = location.search.includes('decksheet=')
const hideSample = location.search.includes('hide_sample=true')
const useKeyboardShortcut = location.search.includes('keyboard_shortcut=true')
const useCardOnTopMove = location.search.includes('ontopcardmove=true')
const useHandStorage = location.search.includes('hand_storage=true')
const useDicebot = location.search.includes('use_dicebot=')
const useRotateOff = location.search.includes('use_lotate_off=true')

// lily
const useLilyCutin = location.search.includes('lily_cutin=true')
const useLilyStand = location.search.includes('lily_stand=true')
const useLilyDiceTable = location.search.includes('lily_dacetable=true')
const useLilyFile = location.search.includes('lily_file=true')
const useLilyBuff = location.search.includes('lily_buff=true')
const useLilyRemocon = location.search.includes('lily_remocon=true')
const useLilyTalkFlg = location.search.includes('lily_talk_flg=true')
const useLilyHideInventoryFlg = location.search.includes(
  'lily_hide_inventory_flg=true',
)
const useLilyMessageColor = location.search.includes('lily_message_color=true')
const useLilyUdonariumLog = location.search.includes('lily_udonarium_log=true')
const useLilyDeleteLog = location.search.includes('lily_delete_log=true')


// with fly
const usePlayerColor = location.search.includes('withfly_player_color=true')
const useWithFlyResetPoint = location.search.includes(
  'withfly_reset_point=true',
)
const useWithFlyDiceAllOpen = location.search.includes(
  'withfly_dice_all_open=true',
)
const useWithFlyCardNdraw = location.search.includes('withfly_card_n_draw=true')
const useWithFlyGridHeight = location.search.includes(
  'withfly_grid_height=true',
)
const useWithFlyOpenUrl = location.search.includes('withfly_open_url=true')
const useWithFlyContextMenuHeightTerrain = location.search.includes(
  'withfly_context_menu_height=true',
)
const useCardOnlySelfHide = location.search.includes('use_card_only_self_hide=true')
const useCardGMView = location.search.includes('use_card_gm_view=true')


export default {
  useKeyboardHelp,
  useCardTap,
  get use2dMode() {
    return use2dMode
  },
  get usePostMessage() {
    return usePostMessage
  },
  useSpreadSheet,
  useSpreadSheetSigninButton,
  useDeckSpreadSheet,
  useCardOnTopMove,
  useHandStorage,
  hideSample,
  useKeyboardShortcut,
  useDicebot,
  useCardOnlySelfHide,
  useCardGMView,
  useRotateOff,
  // lily
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
  useLilyMessageColor,
  useLilyUdonariumLog,
  useLilyDeleteLog,
  // with fly
  usePlayerColor,
  useWithFlyResetPoint,
  useWithFlyDiceAllOpen,
  useWithFlyCardNdraw,
  useWithFlyGridHeight,
  useWithFlyOpenUrl,
  useWithFlyContextMenuHeightTerrain,
}
