import { ContextMenuAction } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';
import { CounterBoardWindowComponent } from '../component/counter-board-window/counter-board-window.component';
import { outerApp } from 'src/plugins/extends/app.component';

export const getCounterboardStorageMenu = (): ContextMenuAction[] => {
  if (!pluginConfig.isAddCounterBoard) return [];
  return [
    {
      name: 'カウンターボードを開く',
      action: () => {
        outerApp.panelService.open(CounterBoardWindowComponent, {
          width: 500,
          height: 450,
          left: 300,
          top: 100,
        });
      },
    },
  ];
};
