import { AppComponent } from "src/app/app.component"
import { useExtendComponents } from "../config"
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
const bootstarp = [AppComponentExtendPlus]

export default { components, services, bootstarp }
