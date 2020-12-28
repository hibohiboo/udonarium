import {ChatPalette} from '@udonarium/chat-palette';
import { SyncObject } from '@udonarium/core/synchronize-object/decorator';

@SyncObject('dice-table-palette')
export class DiceTablePalette extends ChatPalette {
}
