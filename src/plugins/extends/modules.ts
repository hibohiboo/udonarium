import { CounterBoardWindowComponent } from '../add-counter-board/extend/component/counter-board-window/counter-board-window.component';
import { CounterBoardComponent } from '../add-counter-board/extend/component/counter-board/counter-board.component';
import { CounterBoardService } from '../add-counter-board/extend/service/counter-board.service';
import { HandStorageComponent } from '../hand-storage/extend/component/hand-storage/hand-storage.component';
import { HandStorageService } from '../hand-storage/extend/service/hand-storage.service';
import { HelpKeyboardComponent } from '../keyboard-help/component/help-keyboard/help-keyboard.component';
const components = [
  CounterBoardComponent,
  CounterBoardWindowComponent,
  HandStorageComponent,
  HelpKeyboardComponent,
];
const imports = [];
const services = [CounterBoardService, HandStorageService];
const bootstarp = []; // 本家の AppComponent は不使用

export default { components, services, bootstarp };
