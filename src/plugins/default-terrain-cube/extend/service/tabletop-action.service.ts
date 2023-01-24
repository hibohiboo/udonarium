import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { Terrain } from "@udonarium/terrain";
import { pluginConfig } from "src/plugins/config"

export const createDefaultCubeTerrain = (that, position) => {
  if(!pluginConfig.isChangeDefaultTerrain) return null;
  const url: string = './assets/images/extend/cube.jpg';
  const image: ImageFile = ImageStorage.instance.get(url) || ImageStorage.instance.add(url);

  const viewTable = that.getViewTable();
  if (!viewTable) return;

  const terrain = Terrain.create('キューブ', 0.5, 0.5, 0.5, image.identifier, image.identifier) as any;
  terrain.location.x = position.x - 50;
  terrain.location.y = position.y - 50;
  terrain.posZ = position.z;
  if(pluginConfig.isOffObjectRotateIndividually) terrain.isRotateOffIndividually = true;

  viewTable.appendChild(terrain);
  return terrain;
}
