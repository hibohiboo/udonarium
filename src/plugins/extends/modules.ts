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
const bootstarp = [false ? AppComponentExtendPlus : AppComponent]
// 以下のように条件分岐で使用コンポーネントを変えようとすると、FormsModuleなどインポートが必要なディレクティブが使えなくなる
// if (config.useKeyboardHelp) { components.push(HelpKeyboardComponent) }
// if (config.useLilyCutin) {
//   components.push(CutInListComponent)
//  }
export default { components, services, bootstarp }
