import config from './config';
import { HelpKeyboardComponent } from './keyboard-help/component/help-keyboard/help-keyboard.component';
import { CutInListComponent } from './lily/cutin/component/cut-in-list/cut-in-list.component';
import { CutInBgmComponent } from './lily/cutin/component/cut-in-bgm/cut-in-bgm.component';
import { CutInWindowComponent } from './lily/cutin/component/cut-in-window/cut-in-window.component';

const components = [HelpKeyboardComponent, CutInListComponent, CutInBgmComponent, CutInWindowComponent]
const imports = []

// 以下のように条件分岐で使用コンポーネントを変えようとすると、FormsModuleなどインポートが必要なディレクティブが使えなくなる
// if (config.useKeyboardHelp) { components.push(HelpKeyboardComponent) }
// if (config.useLilyCutin) {
//   components.push(CutInListComponent)
//   components.push(CutInBgmComponent)
//   components.push(CutInWindowComponent)
//   imports.push(ReactiveFormsModule)
//  }
export default { components, imports}

