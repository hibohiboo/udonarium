import config from './config';
import { HelpKeyboardComponent } from './keyboard-help/component/help-keyboard/help-keyboard.component';

const components = []

if (config.useKeyboardHelp) { components.push(HelpKeyboardComponent) }

export default components

