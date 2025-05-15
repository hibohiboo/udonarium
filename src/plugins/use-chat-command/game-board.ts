export const outerGameBoard = {
  setTransform: null,
  tabletopService: null,
  handStorageService: null,
};
export const initCommandGameBoard = (that: any) => {
  outerGameBoard.setTransform = that.setTransform.bind(that);
  outerGameBoard.tabletopService = that.tabletopService;
  outerGameBoard.handStorageService = that.handStorageService;
};
