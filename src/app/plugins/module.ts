import { HelpKeyboardComponent } from './keyboard-help/component/help-keyboard/help-keyboard.component';
import { CutInListComponent } from './lily/cutin/component/cut-in-list/cut-in-list.component';
import { CutInBgmComponent } from './lily/cutin/component/cut-in-bgm/cut-in-bgm.component';
import { CutInWindowComponent } from './lily/cutin/component/cut-in-window/cut-in-window.component';
import { DiceTableSettingComponent } from './lily/dice-table/component/dice-table-setting/dice-table-setting.component';
import { ChatTachieComponent } from './lily/chat-stand/component/chat-tachie/chat-tachie.component';
import { ControllerInputComponent } from './lily/controller/component/controller-input/controller-input.component';
import { FileStorageComponentLily } from './lily/file/component/file-storage/file-storage.component';
import { FileSelecterComponentLily } from './lily/file/component/file-selecter/file-selecter.component';
import { GameDataElementBuffComponent } from './lily/character-buff/component/game-data-element-buff/game-data-element-buff.component';
import { RemoteControllerComponent } from './lily/controller/component/remote-controller/remote-controller.component';
import { GameCharacterBuffViewComponent } from './lily/controller/component/game-character-buff-view/game-character-buff-view.component';

const components = [
  HelpKeyboardComponent, CutInListComponent, CutInBgmComponent, CutInWindowComponent, DiceTableSettingComponent,
  FileStorageComponentLily, FileSelecterComponentLily, GameDataElementBuffComponent,
  RemoteControllerComponent, ControllerInputComponent, GameCharacterBuffViewComponent,
  ChatTachieComponent,
]
const imports = []

// 以下のように条件分岐で使用コンポーネントを変えようとすると、FormsModuleなどインポートが必要なディレクティブが使えなくなる
// if (config.useKeyboardHelp) { components.push(HelpKeyboardComponent) }
// if (config.useLilyCutin) {
//   components.push(CutInListComponent)
//  }
export default { components, imports}

