const params = new URL(document.URL).searchParams;
export const pluginConfig = {
    isSettingsPage: params.get('settings') != null
  , is2d: params.get('2d') != null
  , isOffRotate: params.get('rotate-off') != null
  , isMinimizableMenu: params.get('mini-menu') != null
  , isHorizonMenu: params.get('horizon-menu') != null
} as const;
