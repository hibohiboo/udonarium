import { pluginConfig } from 'src/plugins/config';
import { CounterBoardWindowComponent } from './component/counter-board-window/counter-board-window.component';

export const afterViewInit = (that: any) => {
  if (!pluginConfig.isAddCounterBoard) return;
  that.panelService.open(CounterBoardWindowComponent, {
    width: 500,
    height: 450,
    left: 300,
    top: 100,
  });
};
