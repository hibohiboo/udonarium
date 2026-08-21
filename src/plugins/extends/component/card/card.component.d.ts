import { CardComponent as OriginalCardComponent } from 'src/app/component/card/card.component';

declare module 'src/app/component/card/card.component' {
  interface CardComponent {
    /**
     * カードへの文字入力機能が有効かどうか（add-card-text-writableプラグインから注入）
     */
    isCardWritable: boolean;
  }
}
