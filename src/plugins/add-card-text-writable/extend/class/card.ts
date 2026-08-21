import { DataElement } from '@udonarium/data-element';
import { pluginConfig } from 'src/plugins/config';

/**
 * 通常のCardに text / fontsize プロパティを注入する（有効時のみ）。
 * BlankCard（拡張ブランクカード）とは異なり、通常のCardクラス自体は変更せず、
 * commonDataElementの子要素として動的に読み書きする。
 * DataElementが未作成の場合は初回アクセス時に遅延生成する（Card.create()側は変更不要）。
 */
export const initCardClassForWritableText = (that: any) => {
  if (!pluginConfig.isCardWritable) return;

  Object.defineProperty(that, 'text', {
    get(): string {
      let element = this.getElement('text', this.commonDataElement);
      if (!element && this.commonDataElement) {
        this.commonDataElement.appendChild(
          DataElement.create('text', '', { type: 'note', currentValue: '' }, 'text_' + this.identifier)
        );
      }
      return element ? element.value + '' : '';
    },
    set(text: string) {
      this.setCommonValue('text', text);
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(that, 'fontsize', {
    get(): number {
      let element = this.getElement('fontsize', this.commonDataElement);
      if (!element && this.commonDataElement) {
        this.commonDataElement.appendChild(
          DataElement.create('fontsize', 18, {}, 'fontsize_' + this.identifier)
        );
      }
      return element ? +element.value : 18;
    },
    set(fontsize: number) {
      this.setCommonValue('fontsize', fontsize);
    },
    enumerable: true,
    configurable: true,
  });
};
