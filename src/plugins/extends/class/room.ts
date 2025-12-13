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
import { DataElement } from '@udonarium/data-element';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { TabletopObject } from '@udonarium/tabletop-object';
import { innerXMLHandStorageObject } from 'src/plugins/hand-storage/extend/class/room';
import { innerXMLCounterBoard } from 'src/plugins/add-counter-board/extend/class/room';

/**
 * detailElement配下の設定から「ロード時に残すか」フラグをチェックする
 * @param detailElement detail要素
 * @returns 「残す」設定がある場合true
 */
function checkKeepFlagFromDetail(detailElement: DataElement | null): boolean {
  if (!detailElement) {
    return false;
  }

  const settingsElement = detailElement.getFirstElementByName('拡張設定');
  if (!settingsElement) {
    return false;
  }

  const keepElement = settingsElement.getFirstElementByName('ロード時に残すか');
  if (!keepElement) {
    return false;
  }

  return keepElement.value === '残す';
}

/**
 * オブジェクトから拡張設定のIDを取得する
 * @param object GameObjectインスタンス
 * @returns 拡張設定のID、存在しない場合はnull
 */
function getExtensionIdFromObject(object: GameObject): string | null {
  let detailElement: DataElement | null = null;

  // TabletopObjectの場合はdetailDataElementを使用
  if (object instanceof TabletopObject) {
    detailElement = object.detailDataElement;
  }
  // その他のObjectNodeの場合は子要素から探す
  else if (object instanceof ObjectNode) {
    for (const child of object.children) {
      if (child instanceof DataElement && child.getAttribute('name') === 'detail') {
        detailElement = child;
        break;
      }
    }
  }

  if (!detailElement) {
    return null;
  }

  const settingsElement = detailElement.getFirstElementByName('拡張設定');
  if (!settingsElement) {
    return null;
  }

  const idElement = settingsElement.getFirstElementByName('ID');
  if (!idElement) {
    return null;
  }

  return idElement.value as string;
}

/**
 * XML Element配下のdata要素から指定パスの要素を探す
 * @param element 開始要素
 * @param path パス（例: ['detail', '拡張設定', 'ID']）
 * @returns 見つかった要素、存在しない場合はnull
 */
function findDataElementByPath(element: Element, path: string[]): Element | null {
  if (path.length === 0) {
    return element;
  }

  const targetName = path[0];
  const remainingPath = path.slice(1);

  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.tagName === 'data' && child.getAttribute('name') === targetName) {
      return findDataElementByPath(child, remainingPath);
    }
  }

  return null;
}

/**
 * XML Elementから拡張設定のIDを取得する
 * @param xmlElement XML要素
 * @returns 拡張設定のID、存在しない場合はnull
 */
function getExtensionIdFromXmlElement(xmlElement: Element): string | null {
  // 最初のdata要素（rootDataElement相当）を探す
  let rootDataElement: Element | null = null;
  for (let i = 0; i < xmlElement.children.length; i++) {
    const child = xmlElement.children[i];
    if (child.tagName === 'data') {
      rootDataElement = child;
      break;
    }
  }

  if (!rootDataElement) {
    return null;
  }

  // detail.拡張設定.IDのパスを辿る
  const idElement = findDataElementByPath(rootDataElement, ['detail', '拡張設定', 'ID']);
  if (!idElement) {
    return null;
  }

  return idElement.textContent || null;
}

/**
 * オブジェクトが「ロード時に残す」設定を持っているかチェックする
 * detail.拡張設定.ロード時に残すか が「残す」の場合にtrueを返す
 */
function shouldKeepOnXmlLoad(object: GameObject): boolean {
  let detailElement: DataElement | null = null;

  // TabletopObjectの場合はdetailDataElementを使用
  if (object instanceof TabletopObject) {
    detailElement = object.detailDataElement;
  }
  // その他のObjectNodeの場合は子要素から探す
  else if (object instanceof ObjectNode) {
    for (const child of object.children) {
      if (child instanceof DataElement && child.getAttribute('name') === 'detail') {
        detailElement = child;
        break;
      }
    }
  }

  return checkKeepFlagFromDetail(detailElement);
}

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

    // 「ロード時に残す」設定のオブジェクトの拡張設定IDを収集
    const keepExtensionIds = new Set<string>();
    const keepObjectIdentifiers = new Set<string>();
    for (let object of objects) {
      if (shouldKeepOnXmlLoad(object)) {
        const extensionId = getExtensionIdFromObject(object);
        if (extensionId) {
          keepExtensionIds.add(extensionId);
          keepObjectIdentifiers.add(object.identifier);
        }
      }
    }

    // オブジェクトを破棄してパース
    // 「ロード時に残す」設定がされているオブジェクトは破棄しない
    for (let object of objects) {
      if (!keepObjectIdentifiers.has(object.identifier)) {
        object.destroy();
      }
    }

    // XMLをパース
    // 「ロード時に残す」設定のオブジェクトと同じ拡張設定IDを持つXML要素はスキップ
    for (let i = 0; i < element.children.length; i++) {
      const xmlElement = element.children[i];
      const extensionId = getExtensionIdFromXmlElement(xmlElement);

      // 既存の「残す」オブジェクトと同じ拡張設定IDの場合はスキップ
      if (extensionId && keepExtensionIds.has(extensionId)) {
        continue;
      }

      ObjectSerializer.instance.parseXml(xmlElement);
    }
  };
};
