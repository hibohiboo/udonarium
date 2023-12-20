import { GameObject, ObjectContext } from "@udonarium/core/synchronize-object/game-object";
import { ObjectFactory } from "@udonarium/core/synchronize-object/object-factory";
import { ObjectNode } from "@udonarium/core/synchronize-object/object-node";
import { XmlUtil } from "@udonarium/core/system/util/xml-util";

 interface InnerXml extends GameObject {
  innerXml(): string;
  parseInnerXml(element: Element);
}

const objectPropertyKeys = Object.getOwnPropertyNames(Object.prototype);

export class ObjectSerializerEx {
  private static _instance: ObjectSerializerEx
  static get instance(): ObjectSerializerEx {
    if (!ObjectSerializerEx._instance) ObjectSerializerEx._instance = new ObjectSerializerEx();
    return ObjectSerializerEx._instance;
  }

  private constructor() {
    console.log('ObjectSerializerEx ready...');
  };

  parseXml(xml: string | Element, filename: string): GameObject {
    let xmlElement: Element = null;
    if (typeof xml === 'string') {
      xmlElement = XmlUtil.xml2element(xml);
    } else {
      xmlElement = xml;
    }
    if (!xmlElement) {
      console.error('xmlElementが空です');
      return null;
    }

    let gameObject: GameObject = ObjectFactory.instance.create(xmlElement.tagName, filename);
    if (!gameObject) return null;

    if ('parseAttributes' in gameObject) {

      ObjectSerializerEx.parseAttributes((gameObject as any).attributes, xmlElement.attributes)
    } else {
      let context: ObjectContext = gameObject.toContext();

      ObjectSerializerEx.parseAttributes(context.syncData, xmlElement.attributes);
      gameObject.apply(context);
    }

    gameObject.initialize();

    if ('parseInnerXml' in gameObject) {
      const children = xmlElement.children;
      const length = children.length;
      if (0 < length) {
        for (let i = 0; i < length; i++) {
          let child = ObjectSerializerEx.instance.parseXml(children[i], `${filename}_obj_${i}`);
          if (child instanceof ObjectNode && (gameObject as ObjectNode).appendChild) (gameObject as ObjectNode).appendChild(child);
        }
      } else {
        (gameObject as any).value = XmlUtil.decodeEntityReference(xmlElement.innerHTML);
      }
    }
    return gameObject;
  }

  static parseAttributes(syncData: Object, attributes: NamedNodeMap): Object {
    let length = attributes.length;
    for (let i = 0; i < length; i++) {
      let value = attributes[i].value;
      value = XmlUtil.decodeEntityReference(value);

      let split: string[] = attributes[i].name.split('.');
      let key: string | number = split[0];
      let obj: Object | Array<any> = syncData;

      let pollutionKey = split.find(splitKey => objectPropertyKeys.includes(splitKey));
      if (pollutionKey != null) {
        console.log(`skip invalid key (${pollutionKey})`);
        continue;
      }

      if (1 < split.length) {
        ({ obj, key } = ObjectSerializerEx.attributes2object(split, obj, key));
        if (key == null) continue;
      }

      let type = typeof obj[key];
      if (type !== 'string' && obj[key] != null) {
        value = JSON.parse(value);
      }
      obj[key] = value;
    }
    return syncData;
  }

  private static attributes2object(split: string[], obj: Object | any[], key: string | number) {
    // 階層構造の解析 foo.bar.0="abc" 等
    // 処理として実装こそしているが、xmlの仕様としては良くないので使用するべきではない.
    let parentObj: Object | Array<any> = null;
    let length = split.length;
    for (let i = 0; i < length; i++) {
      let index = parseInt(split[i]);
      if (parentObj && !Number.isNaN(index) && !Array.isArray(obj) && Object.keys(parentObj).length) {
        parentObj[key] = [];
        obj = parentObj[key];
      }
      key = Number.isNaN(index) ? split[i] : index;

      if (Array.isArray(obj) && typeof key !== 'number') {
        console.warn('Arrayにはindexの挿入しか許可しない');
        return { obj, key: null };
      }
      if (i + 1 < length) {
        if (obj[key] == null)
          obj[key] = typeof key === 'number' ? [] : {};
        parentObj = obj;
        obj = obj[key];
      }
    }
    return { obj, key };
  }

}
