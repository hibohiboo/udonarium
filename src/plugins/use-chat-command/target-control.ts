type Target = {
  name: string;
  location: { x: number; y: number };
  update: () => void;
};
const selectTarget = (name: string, targets: Target[]) => {
  const [target] = targets.filter((char) => {
    return char.name === name;
  });
  return target;
};

export const moveTarget = (args: string, targets: Target[]) => {
  const [name, x, y] = args.split(',');
  const target = selectTarget(name, targets);
  if (!target) return;
  target.location.x = Number(x);
  target.location.y = Number(y);
  target.update();
};

export const breakStack = (args: string, targets: Target[]) => {
  const [name] = args.split(',');
  const target = selectTarget(name, targets) as any;
  if (!target) return;
  target.drawCardAll().reverse();
  target.setLocation('graveyard');
  target.destroy();
};
