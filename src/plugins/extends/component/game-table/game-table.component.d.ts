import { GameTableComponent as OriginalGameTableComponent } from 'src/app/component/game-table/game-table.component';
import { HandStorage } from 'src/plugins/hand-storage/extend/class/hand-storage';

declare module 'src/app/component/game-table/game-table.component' {
  interface GameTableComponent {
    /**
     * HandStorageの配列を取得するgetter（プラグインから注入）
     */
    handStorages: HandStorage[];
  }
}
