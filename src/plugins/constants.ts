export const dataServerDomain = 'https://yakumi.azureedge.net';
export const getStorageAccountFilePath = (fileName: string) =>
  `${dataServerDomain}/${fileName}`;
