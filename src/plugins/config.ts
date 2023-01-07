const params = new URL(document.URL).searchParams;
export const pluginConfig = {
    isSettingsPage: params.get('settings') != null
  , is2d: params.get('2d') != null
  , isOffRotate: params.get('rotate-off') != null
  , isMinimizableMenu: params.get('mini-menu') != null
  , isHorizonMenu: params.get('horizon-menu') != null
  , isHideMenuTable: params.get('hide-menu-table') != null
  , isHideMenuImage: params.get('hide-menu-image') != null
  , isHideMenuMusic: params.get('hide-menu-music') != null
  , isHideMenuInventory: params.get('hide-menu-inventory') != null
  , isHideMenuZipUpload: params.get('hide-menu-zip') != null
  , isHideMenuSave: params.get('hide-menu-save') != null
  , isOffObjectRotate: params.get('object-rotate-off') != null
  , isOffObjectRotateIndividually:  params.get('object-rotate-off-individually') != null
  , isUseHelp:  params.get('help') != null
  , isHideFirstPeer: params.get('hide-first-peer') != null
  , isHideFirstChat: params.get('hide-first-chat') != null

} as const;
