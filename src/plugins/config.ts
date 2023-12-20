const params = new URL(document.URL).searchParams;
console.error('env', params.get('env'));
const hollowConfig =params.get('env') !== 'hollow' ? {} : {
    is2d: true
  , isTapCard: true
  , isUseKeyboardShortcut: true
  , isCardShuffleNormalPosition: true
}
export const pluginConfig = {
  ...hollowConfig
} as const;

