import { Card as OriginalCard } from 'src/app/class/card';

declare module 'src/app/class/card' {
  interface Card {
    /**
     * カードに書き込むテキスト（add-card-text-writableプラグインから注入、無効時は空文字列）
     */
    text: string;
    /**
     * テキストのフォントサイズ（add-card-text-writableプラグインから注入、無効時は18固定）
     */
    fontsize: number;
  }
}
