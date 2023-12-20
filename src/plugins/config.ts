const params = new URL(document.URL).searchParams;

const hollowConfig = params.get('room') !== 'hollow' ? {} : {
    isHollow: true
  , is2d: true
  , isTapCard: true
  , isUseKeyboardShortcut: true
  , isCardShuffleNormalPosition: true
  , isFirstFetchZipRoom: true
}
export const pluginConfig = {
  ...hollowConfig
} as const;

