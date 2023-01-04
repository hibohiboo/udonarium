const params = new URL(document.URL).searchParams;
export const pluginConfig = {
  isSettingsPage: params.get('settings') != null,
  is2d: params.get('2d') != null,
} as const;
