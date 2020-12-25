export default {
  useKeyboardHelp: ()=>location.search.includes('keyboardHelp=true'),
  useCardTap: ()=>location.search.includes('cardTap=true')
}
