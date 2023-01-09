import { HandStorageComponent } from "../hand-storage/extend/component/hand-storage/hand-storage.component"
import { HandStorageService } from "../hand-storage/extend/service/hand-storage.service"
import { HelpKeyboardComponent } from "../keyboard-help/component/help-keyboard/help-keyboard.component"
import { AppComponentExtendPlus } from "./app/app.component"
import { GameTableComponentExtendPlus } from "./app/component/game-table/game-table.component"
import { UIPanelComponentExtendPlus } from "./app/component/ui-panel/ui-panel.component"
import { ResizableDirectiveExtendPlus } from "./app/directive/resizable.directive"
import { PanelServiceExtnedPlus } from "./app/service/panel.service"

const components = [
    UIPanelComponentExtendPlus
  , ResizableDirectiveExtendPlus
  , AppComponentExtendPlus
  , HelpKeyboardComponent
  , HandStorageComponent
  , GameTableComponentExtendPlus // 本家の GameTableComponent は不使用
]
const imports = []
const services = [PanelServiceExtnedPlus, HandStorageService]
const bootstarp = [AppComponentExtendPlus] // 本家の AppComponent は不使用

export default { components, services, bootstarp }
