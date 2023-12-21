const params = new URL(document.URL).searchParams;

const hollowConfig = params.get('room') !== 'hollow' ? {} : {
    isHollow: true
  , isTapCard: true
  , isUseKeyboardShortcut: true
  , isCardShuffleNormalPosition: true
  , isFirstFetchZipRoom: true
}
export const pluginConfig = {
  ...hollowConfig
  , is2d:  params.get('2d') !=null
} as const;

