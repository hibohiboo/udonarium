import { Routes } from '@angular/router';
import { CounterBoardWindowComponent } from '../add-counter-board/extend/component/counter-board-window/counter-board-window.component';
import { CounterBoardComponent } from '../add-counter-board/extend/component/counter-board/counter-board.component';
import { CounterBoardService } from '../add-counter-board/extend/service/counter-board.service';
import { HandStorageComponent } from '../hand-storage/extend/component/hand-storage/hand-storage.component';
import { HandStorageService } from '../hand-storage/extend/service/hand-storage.service';
import { HelpKeyboardComponent } from '../keyboard-help/component/help-keyboard/help-keyboard.component';
import { PluginSettingsComponent } from '../settings/component/plugin-settings.component';
import { settingsRoutes } from '../settings/routing';
import { BlankCardComponent } from '../add-blank-card/component/blank-card/blank-card.component';
import { BlankCardStackComponent } from '../add-blank-card/component/blank-card-stack/blank-card-stack.component';
import { BlankCardOverviewPanelComponent } from '../add-blank-card/component/blank-card-overview-panel/blank-card-overview-panel.component';
import { BlankCardSheetComponent } from '../add-blank-card/component/blank-card-sheet/blank-card-sheet.component';
import { IconContextMenuComponent } from '../context-menu-add-icon/component/icon-context-menu/icon-context-menu.component';


const components = [
  CounterBoardComponent,
  CounterBoardWindowComponent,
  HandStorageComponent,
  HelpKeyboardComponent,
  PluginSettingsComponent,
  BlankCardComponent,
  BlankCardStackComponent,
  BlankCardOverviewPanelComponent,
  BlankCardSheetComponent,
  IconContextMenuComponent,
];
const imports = [];
const services = [CounterBoardService, HandStorageService];
const bootstarp = []; // 本家の AppComponent は不使用
const routes: Routes = [
  ...settingsRoutes,
];

export default { components, services, bootstarp, routes,imports };
