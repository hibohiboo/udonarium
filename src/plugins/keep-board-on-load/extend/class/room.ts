import { GameObject } from '@udonarium/core/synchronize-object/game-object';
import { DataElement } from '@udonarium/data-element';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { TabletopObject } from '@udonarium/tabletop-object';

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
export function getExtensionIdFromXmlElement(xmlElement: Element): string | null {
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

export const getExtensionIdsForKeepOnLoad = (objects: GameObject[]) =>{
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
    return [keepExtensionIds, keepObjectIdentifiers];
}
