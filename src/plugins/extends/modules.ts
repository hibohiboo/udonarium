import { CardListImageComponent } from "../add-card-text-writable/extend/component/card-list-image/card-list-image.component"
import { CardStackListComponentExtendPlus } from "../add-card-text-writable/extend/component/card-stack-list/card-stack-list.component"
import { HandStorageComponent } from "../hand-storage/extend/component/hand-storage/hand-storage.component"
import { HandStorageService } from "../hand-storage/extend/service/hand-storage.service"
import { HelpKeyboardComponent } from "../keyboard-help/component/help-keyboard/help-keyboard.component"
import { AppComponentExtendPlus } from "./app/app.component"
import { ContextMenuComponentExtendPlus } from "./app/component/context-menu/context-menu.component"
import { GameCharacterSheetComponentExtendPlus } from "./app/component/game-character-sheet/game-character-sheet.component"
import { GameTableComponentExtendPlus } from "./app/component/game-table/game-table.component"
import { OverviewPanelComponentExtendPlus } from "./app/component/overview-panel/overview-panel.component"
import { PeerMenuComponentExtendPlus } from "./app/component/peer-menu/peer-menu.component"
import { UIPanelComponentExtendPlus } from "./app/component/ui-panel/ui-panel.component"
import { ResizableDirectiveExtendPlus } from "./app/directive/resizable.directive"
import { TooltipDirectiveExtendPlus } from "./app/directive/tooltip.directive"
import { PanelServiceExtnedPlus } from "./app/service/panel.service"

const components = [
    UIPanelComponentExtendPlus
  , ResizableDirectiveExtendPlus
  , AppComponentExtendPlus
  , HelpKeyboardComponent
  , HandStorageComponent
  , GameTableComponentExtendPlus // 本家の GameTableComponent は不使用
  , GameCharacterSheetComponentExtendPlus
  , OverviewPanelComponentExtendPlus
  , TooltipDirectiveExtendPlus
  , CardListImageComponent
  , CardStackListComponentExtendPlus
  , PeerMenuComponentExtendPlus
  , ContextMenuComponentExtendPlus
]
const imports = []
const services = [PanelServiceExtnedPlus, HandStorageService]
const bootstarp = [AppComponentExtendPlus] // 本家の AppComponent は不使用

export default { components, services, bootstarp }
