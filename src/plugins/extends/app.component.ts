export const outerApp = {
  panelService: null,
};

export const afterViewInitExtend = (that: any) => {
  outerApp.panelService = that.panelService;
};
