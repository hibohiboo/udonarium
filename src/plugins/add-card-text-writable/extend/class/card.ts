import { Card } from "@udonarium/card";
import { DataElement } from "@udonarium/data-element";
import { pluginConfig } from "src/plugins/config";

export const initCardClassForWritableText = (that:any) => {
  if(!pluginConfig.isCardWritable) return;
  Object.defineProperty(that, 'text', {
    get() {
      let element = this.getElement('text', this.commonDataElement);
      if (!element && this.commonDataElement) {
        this.commonDataElement.appendChild(DataElement.create('text', '', { type: 'note', currentValue: '' }, 'text_' + this.identifier));
      }
      return element ? element.value + '' : '';
    },
    set(text: string) { this.setCommonValue('text', text); }
  });
  Object.defineProperty(that, 'fontsize', {
    get() {
      let element = this.getElement('fontsize', this.commonDataElement);
      if (!element && this.commonDataElement) {
        this.commonDataElement.appendChild(DataElement.create('fontsize', 18, { }, 'fontsize_' + this.identifier));
      }
      return element ? +element.value : 18;
    },
    set(fontsize: number) { this.setCommonValue('fontsize', fontsize);  }
  });
}

export const extendCreateForWritableText = (object: Card) => {
  if(!pluginConfig.isCardWritable) return;
  object.commonDataElement.appendChild(DataElement.create('fontsize', 18, { }, 'fontsize_' + object.identifier));
  object.commonDataElement.appendChild(DataElement.create('text', '', { type: 'note', currentValue: '' }, 'text_' + object.identifier));
}
