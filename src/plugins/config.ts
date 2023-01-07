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
  , isOffObjectRotate: true// params.get('object-rotate-off') != null
} as const;
