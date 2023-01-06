import { AppComponentExtendPlus } from "./app/app.component"
import { UIPanelComponentExtendPlus } from "./app/component/ui-panel/ui-panel.component"
import { ResizableDirectiveExtendPlus } from "./app/directive/resizable.directive"
import { PanelServiceExtnedPlus } from "./app/service/panel.service"

const components = [
    UIPanelComponentExtendPlus
  , ResizableDirectiveExtendPlus
  , AppComponentExtendPlus
]
const imports = []
const services = [PanelServiceExtnedPlus]
const bootstarp = [AppComponentExtendPlus] // 本家の AppComponent は不使用

export default { components, services, bootstarp }
