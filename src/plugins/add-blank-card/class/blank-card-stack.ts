import { CardStack } from '@udonarium/card-stack';
import { Card } from '@udonarium/card';
import { SyncObject } from '@udonarium/core/synchronize-object/decorator';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { DataElement } from '@udonarium/data-element';
import { BlankCard } from './blank-card';

@SyncObject('blank-card-stack')
export class BlankCardStack extends CardStack {
  constructor(identifier?: string) {
    super(identifier);
  }

  get cards(): BlankCard[] {
    return super.cards as BlankCard[];
  }

  get topCard(): BlankCard {
    return super.topCard as BlankCard;
  }

  drawCard(): BlankCard {
    return super.drawCard() as BlankCard;
  }

  drawCardAll(): BlankCard[] {
    return super.drawCardAll() as BlankCard[];
  }

  putOnTop(card: Card): Card {
    return super.putOnTop(card);
  }

  putOnBottom(card: Card): Card {
    return super.putOnBottom(card);
  }

  static create(name: string, identifier?: string): BlankCardStack {
    let object: BlankCardStack = null;

    if (identifier) {
      object = new BlankCardStack(identifier);
    } else {
      object = new BlankCardStack();
    }
    object.createDataElements();
    object.commonDataElement.appendChild(DataElement.create('name', name, {}, 'name_' + object.identifier));
    let cardRoot = new ObjectNode('cardRoot_' + object.identifier);
    cardRoot.setAttribute('name', 'cardRoot');
    cardRoot.initialize();
    object.appendChild(cardRoot);
    object.initialize();

    return object;
  }
}
