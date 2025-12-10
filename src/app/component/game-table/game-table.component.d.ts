import { GameTableComponent as OriginalGameTableComponent } from './game-table.component';
import { HandStorage } from 'src/plugins/hand-storage/extend/class/hand-storage';

declare module './game-table.component' {
  interface GameTableComponent {
    /**
     * HandStorageの配列を取得するgetter（プラグインから注入）
     */
    handStorages: HandStorage[];
  }
}
