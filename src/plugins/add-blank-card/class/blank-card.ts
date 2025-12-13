import { Card } from '@udonarium/card';
import { SyncObject } from '@udonarium/core/synchronize-object/decorator';
import { DataElement } from '@udonarium/data-element';
import { ImageFile } from '@udonarium/core/file-storage/image-file';

@SyncObject('blank-card')
export class BlankCard extends Card {
  constructor(identifier?: string) {
    super(identifier);
  }

  get text(): string {
    const element = this.getElement('text', this.commonDataElement);
    if (!element && this.commonDataElement) {
      this.commonDataElement.appendChild(
        DataElement.create('text', '', { type: 'note', currentValue: '' }, 'text_' + this.identifier)
      );
    }
    return element ? element.value + '' : '';
  }

  set text(text: string) {
    this.setCommonValue('text', text);
  }

  get fontsize(): number {
    const element = this.getElement('fontsize', this.commonDataElement);
    if (!element && this.commonDataElement) {
      this.commonDataElement.appendChild(
        DataElement.create('fontsize', 18, {}, 'fontsize_' + this.identifier)
      );
    }
    return element ? +element.value : 18;
  }

  set fontsize(fontsize: number) {
    this.setCommonValue('fontsize', fontsize);
  }

  get color(): string {
    const element = this.getElement('color', this.commonDataElement);
    if (!element && this.commonDataElement) {
      this.commonDataElement.appendChild(
        DataElement.create('color', '#000000', {}, 'color_' + this.identifier)
      );
    }
    return element ? element.value + '' : '#000000';
  }

  set color(color: string) {
    this.setCommonValue('color', color);
  }

  static create(name: string, front: string, back: string, size: number = 2, identifier?: string): BlankCard {
    let object: BlankCard = null;

    if (identifier) {
      object = new BlankCard(identifier);
    } else {
      object = new BlankCard();
    }
    object.createDataElements();

    object.commonDataElement.appendChild(DataElement.create('name', name, {}, 'name_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('size', size, {}, 'size_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('fontsize', 18, {}, 'fontsize_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('text', '', { type: 'note', currentValue: '' }, 'text_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('color', '#000000', {}, 'color_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('front', front, { type: 'image' }, 'front_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('back', back, { type: 'image' }, 'back_' + object.identifier));
    object.initialize();

    return object;
  }
}
