import { DataElement } from "@udonarium/data-element";
import { pluginConfig } from "src/plugins/config"

export const createEmptyNewCharacter = (that, name, size, imageIdentifier)=> {
  if(!pluginConfig.isEmptyNewCharacter) return false;
  let nameElement: DataElement = DataElement.create('name', name, {}, 'name_' + that.identifier);
  let sizeElement: DataElement = DataElement.create('size', size, {}, 'size_' + that.identifier);

  if (that.imageDataElement.getFirstElementByName('imageIdentifier')) {
    that.imageDataElement.getFirstElementByName('imageIdentifier').value = imageIdentifier;
  }

  that.commonDataElement.appendChild(nameElement);
  that.commonDataElement.appendChild(sizeElement);
  return true;
}
