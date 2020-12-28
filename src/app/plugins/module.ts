import { HelpKeyboardComponent } from './keyboard-help/component/help-keyboard/help-keyboard.component';
import { CutInListComponent } from './lily/cutin/component/cut-in-list/cut-in-list.component';
import { CutInBgmComponent } from './lily/cutin/component/cut-in-bgm/cut-in-bgm.component';
import { CutInWindowComponent } from './lily/cutin/component/cut-in-window/cut-in-window.component';
import { DiceTableSettingComponent } from './lily/dice-table/component/dice-table-setting/dice-table-setting.component';
import { ChatTachieComponent } from './lily/chat-stand/component/chat-tachie/chat-tachie.component';
import { ControllerInputComponent } from './lily/controller/component/controller-input/controller-input.component';
import { FileStorageComponentLily } from './lily/file/component/file-storage/file-storage.component';
import { FileSelecterComponentLily } from './lily/file/component/file-selecter/file-selecter.component';

const components = [
  HelpKeyboardComponent, CutInListComponent, CutInBgmComponent, CutInWindowComponent, DiceTableSettingComponent,
  FileStorageComponentLily, FileSelecterComponentLily,
]
const imports = []

// 以下のように条件分岐で使用コンポーネントを変えようとすると、FormsModuleなどインポートが必要なディレクティブが使えなくなる
// if (config.useKeyboardHelp) { components.push(HelpKeyboardComponent) }
// if (config.useLilyCutin) {
//   components.push(CutInListComponent)
//  }
export default { components, imports}

