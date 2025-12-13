import { pluginConfig } from 'src/plugins/config';
import { DataElement } from '@udonarium/data-element';
import { TabletopObject } from '@udonarium/tabletop-object';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';

/**
 * ボード上に残す機能のコンテキストメニューを返す
 * @param component HandStorageComponentインスタンス
 * @returns コンテキストメニュー配列
 */
export function keepBoardOnLoadContextMenu(component: any): any[] {
  if (!pluginConfig.isKeepBoardOnLoad) return [];

  const handStorage = component.handStorage;
  const isKeepOnLoad = checkIfKeepOnLoad(handStorage);

  return [
    {
      name: isKeepOnLoad ? 'ロード時に残す設定を解除' : 'ロード時にボード上に残す',
      action: () => {
        if (isKeepOnLoad) {
          removeKeepOnLoadSettings(component);
        } else {
          setKeepOnLoadSettings(component);
        }
        SoundEffect.play(PresetSound.lock);
      },
    },
  ];
}

/**
 * オブジェクトが「ロード時に残す」設定を持っているかチェック
 */
function checkIfKeepOnLoad(object: TabletopObject): boolean {
  const detailElement = object.detailDataElement;
  if (!detailElement) return false;

  const settingsElement = detailElement.getFirstElementByName('拡張設定');
  if (!settingsElement) return false;

  const keepElement = settingsElement.getFirstElementByName('ロード時に残すか');
  if (!keepElement) return false;

  return keepElement.value === '残す';
}

/**
 * ボードとボード上のオブジェクトに「ロード時に残す」設定を追加
 */
function setKeepOnLoadSettings(component: any): void {
  const handStorage = component.handStorage;

  // ボード自体に設定を追加
  setExtensionSettings(handStorage);

  // ボード上のオブジェクトに設定を追加
  component.calcTopOfObjects();
  for (const topOfObject of component.topOfObjects) {
    setExtensionSettings(topOfObject.obj);
  }

  handStorage.update();
}

/**
 * ボードとボード上のオブジェクトから「ロード時に残す」設定を削除
 */
function removeKeepOnLoadSettings(component: any): void {
  const handStorage = component.handStorage;

  // ボード自体から設定を削除
  removeExtensionSettings(handStorage);

  // ボード上のオブジェクトから設定を削除
  component.calcTopOfObjects();
  for (const topOfObject of component.topOfObjects) {
    removeExtensionSettings(topOfObject.obj);
  }

  handStorage.update();
}

/**
 * オブジェクトに拡張設定を追加する
 * detail.拡張設定.ロード時に残すか = '残す'
 * detail.拡張設定.ID = オブジェクトのidentifier
 */
function setExtensionSettings(object: TabletopObject): void {
  const detailElement = object.detailDataElement;
  if (!detailElement) return;

  // 拡張設定要素を取得または作成
  let settingsElement = detailElement.getFirstElementByName('拡張設定');
  if (!settingsElement) {
    settingsElement = DataElement.create('拡張設定', '', {}, `settings_${object.identifier}`);
    detailElement.appendChild(settingsElement);
  }

  // ロード時に残すかフラグを設定
  let keepElement = settingsElement.getFirstElementByName('ロード時に残すか');
  if (!keepElement) {
    keepElement = DataElement.create('ロード時に残すか', '残す', {}, `keep_${object.identifier}`);
    settingsElement.appendChild(keepElement);
  } else {
    keepElement.value = '残す';
  }

  // IDを設定
  let idElement = settingsElement.getFirstElementByName('ID');
  if (!idElement) {
    idElement = DataElement.create('ID', object.identifier, {}, `id_${object.identifier}`);
    settingsElement.appendChild(idElement);
  } else {
    idElement.value = object.identifier;
  }

  object.update();
}

/**
 * オブジェクトから拡張設定を削除する
 */
function removeExtensionSettings(object: TabletopObject): void {
  const detailElement = object.detailDataElement;
  if (!detailElement) return;

  const settingsElement = detailElement.getFirstElementByName('拡張設定');
  if (!settingsElement) return;

  // ロード時に残すかフラグを削除
  const keepElement = settingsElement.getFirstElementByName('ロード時に残すか');
  if (keepElement) {
    keepElement.destroy();
  }

  // IDも削除
  const idElement = settingsElement.getFirstElementByName('ID');
  if (idElement) {
    idElement.destroy();
  }

  object.update();
}
