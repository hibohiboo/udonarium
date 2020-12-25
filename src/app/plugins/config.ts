const useKeyboardHelp = location.search.includes('keyboardHelp=true')
const use2dMode = location.search.includes('2d=true')
const useCardTap = location.search.includes('cardTap=true')
export default {
  useKeyboardHelp: ()=>useKeyboardHelp,
  useCardTap: ()=>useCardTap,
  get use2dMode(){ return use2dMode}
}
