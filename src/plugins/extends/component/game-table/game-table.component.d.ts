import { GameTableComponent as OriginalGameTableComponent } from 'src/app/component/game-table/game-table.component';
import { HandStorage } from 'src/plugins/hand-storage/extend/class/hand-storage';
import { BlankCard } from 'src/plugins/add-blank-card/class/blank-card';
import { BlankCardStack } from 'src/plugins/add-blank-card/class/blank-card-stack';

declare module 'src/app/component/game-table/game-table.component' {
  interface GameTableComponent {
    /**
     * HandStorageの配列を取得するgetter（プラグインから注入）
     */
    handStorages: HandStorage[];
    /**
     * BlankCardの配列を取得するgetter（プラグインから注入）
     */
    blankCards: BlankCard[];
    /**
     * BlankCardStackの配列を取得するgetter（プラグインから注入）
     */
    blankCardStacks: BlankCardStack[];
  }
}
