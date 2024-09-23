import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { TableSelecter } from '@udonarium/table-selecter';
import { Terrain } from '@udonarium/terrain';
import { pluginConfig } from 'src/plugins/config';

export const createDefaultCubeTerrain = (
  position,
  name = 'キューブ',
  imageUrl = './assets/images/extend/cube.jpg',
) => {
  const url: string = imageUrl;
  const image: ImageFile =
    ImageStorage.instance.get(url) || ImageStorage.instance.add(url);

  const viewTable = TableSelecter.instance.viewTable;
  if (!viewTable) return;

  const terrain = Terrain.create(
    name,
    0.5,
    0.5,
    0.5,
    image.identifier,
    image.identifier,
  ) as any;
  terrain.location.x = position.x - 50;
  terrain.location.y = position.y - 50;
  terrain.posZ = position.z;
  if (pluginConfig.isOffObjectRotateIndividually)
    terrain.isRotateOffIndividually = true;

  viewTable.appendChild(terrain);
  return terrain;
};
