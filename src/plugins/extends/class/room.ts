import { GameObject } from '@udonarium/core/synchronize-object/game-object';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { ObjectSerializer } from '@udonarium/core/synchronize-object/object-serializer';
import { GameTable } from '@udonarium/game-table';
import { GameTableMask } from '@udonarium/game-table-mask';
import { Terrain } from '@udonarium/terrain';
import { GameCharacter } from '@udonarium/game-character';
import { TextNote } from '@udonarium/text-note';
import { CardStack } from '@udonarium/card-stack';
import { Card } from '@udonarium/card';
import { DiceSymbol } from '@udonarium/dice-symbol';
import { innerXMLHandStorageObject } from 'src/plugins/hand-storage/extend/class/room';
import { innerXMLCounterBoard } from 'src/plugins/add-counter-board/extend/class/room';

export const extendsRoom = (that: any) => {
  const constructor = that.constructor;

  // innerXml メソッドをオーバーライド
  constructor.prototype.innerXml = function(): string {
    let xml = '';
    let objects: GameObject[] = [];

    // 元のロジックと同じオブジェクトを取得
    objects = objects.concat(ObjectStore.instance.getObjects(GameTable));
    objects = objects.concat(ObjectStore.instance.getObjects(GameCharacter));
    objects = objects.concat(ObjectStore.instance.getObjects(TextNote));
    objects = objects.concat(ObjectStore.instance.getObjects(CardStack));
    objects = objects.concat(ObjectStore.instance.getObjects(Card).filter((obj: any) => { return obj.parent === null }));
    objects = objects.concat(ObjectStore.instance.getObjects(DiceSymbol));

    // プラグインによる拡張を適用
    objects = innerXMLHandStorageObject(objects);
    objects = innerXMLCounterBoard(objects);

    // XMLに変換
    for (let object of objects) {
      xml += object.toXml();
    }
    return xml;
  };

  // parseInnerXml メソッドをオーバーライド
  constructor.prototype.parseInnerXml = function(element: Element) {
    let objects: GameObject[] = [];

    // 元のロジックと同じオブジェクトを取得
    objects = objects.concat(ObjectStore.instance.getObjects(GameTable));
    objects = objects.concat(ObjectStore.instance.getObjects(GameTableMask));
    objects = objects.concat(ObjectStore.instance.getObjects(Terrain));
    objects = objects.concat(ObjectStore.instance.getObjects(GameCharacter));
    objects = objects.concat(ObjectStore.instance.getObjects(TextNote));
    objects = objects.concat(ObjectStore.instance.getObjects(CardStack));
    objects = objects.concat(ObjectStore.instance.getObjects(Card));
    objects = objects.concat(ObjectStore.instance.getObjects(DiceSymbol));

    // プラグインによる拡張を適用
    objects = innerXMLHandStorageObject(objects);
    objects = innerXMLCounterBoard(objects);

    // オブジェクトを破棄してパース
    for (let object of objects) {
      object.destroy();
    }
    for (let i = 0; i < element.children.length; i++) {
      ObjectSerializer.instance.parseXml(element.children[i]);
    }
  };
};
