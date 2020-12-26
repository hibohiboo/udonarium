const useKeyboardHelp = location.search.includes('keyboardHelp=true')
const use2dMode = location.search.includes('2d=true')
const useCardTap = location.search.includes('cardTap=true')
const usePostMessage = location.search.includes('usePostMessage=true')
export default {
  useKeyboardHelp,
  useCardTap,
  get use2dMode(){ return use2dMode},
  get usePostMessage(){return true}
}
