const params = new URL(document.URL).searchParams;
export const pluginConfig = {
    isSettingsPage: params.get('settings') != null
  , is2d: params.get('2d') != null
  , isOffRotate: params.get('rotate-off') != null
  , isMinimizableMenu: params.get('mini-menu') != null
} as const;

export const useExtendComponents = pluginConfig.isMinimizableMenu
