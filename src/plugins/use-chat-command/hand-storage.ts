import { HandStorage } from '../hand-storage/extend/class/hand-storage';

export const createHandStorage = ({
  name,
  x,
  y,
  width = 5,
  height = 5,
  opacity = 100,
}: {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}) => {
  const handStorage = HandStorage.create(name, width, height, opacity);
  handStorage.location.x = x;
  handStorage.location.y = y;
  handStorage.posZ = 0;
  handStorage.isLock = true;
  return handStorage;
};

// -----------------------------------------
// ボード上に載っているかどうかを判定する
const gridSize = 50;
const getHandStorageArea = (handStorage: any) => {
  const x = handStorage.location.x;
  const y = handStorage.location.y;
  const w = handStorage.width * gridSize;
  const h = handStorage.height * gridSize;
  return { x, y, w, h };
};
const getDistance = (x, y, obj) => {
  const distanceX = obj.location.x - x;
  const distanceY = obj.location.y - y;
  return { distanceX, distanceY };
};
const isTopOfHandStorage = (x, y, w, h, distanceX, distanceY) => {
  return (
    -gridSize < distanceX &&
    -gridSize < distanceY &&
    distanceX < w &&
    distanceY < h
  );
};
const calcTopObjects = (handStorage, objects) => {
  const { x, y, w, h } = getHandStorageArea(handStorage);
  const topOfObjects = [];
  for (const obj of objects) {
    const { distanceX, distanceY } = getDistance(x, y, obj);
    if (isTopOfHandStorage(x, y, w, h, distanceX, distanceY)) {
      topOfObjects.push({ obj: obj, distanceX, distanceY });
    }
  }

  return topOfObjects;
};
export const alignmentCards = (handStorage, cards) => {
  const x = handStorage.location.x;
  const y = handStorage.location.y;

  const cloneArray = [
    ...calcTopObjects(handStorage, cards).map(({ obj }) => obj),
  ];
  const cardWidth = 80;
  cloneArray.forEach((card, i) => {
    card.location.x = x + i * cardWidth * 2;
    card.location.y = y;
    card.update();
  });
};
