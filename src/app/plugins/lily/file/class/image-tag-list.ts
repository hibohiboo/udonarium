//entyu_2 #92
import { ImageTag } from './image-tag';
import { SyncObject } from '@udonarium/core/synchronize-object/decorator';
import { ObjectNode } from '@udonarium/core/synchronize-object/object-node';
import { InnerXml } from '@udonarium/core/synchronize-object/object-serializer';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { ImageFile } from '@udonarium/core/file-storage/image-file';

@SyncObject('image-tag-list')
export class ImageTagList extends ObjectNode implements InnerXml {
  private identifiers: string[] = [];

  // GameObject Lifecycle
  onStoreAdded() {
    super.onStoreAdded();
    ObjectStore.instance.remove(this);
  }

  innerXml(): string {
    return Array.from(new Set(this.identifiers))
      .map(identifier => ImageTag.get(identifier))
      .filter(imageTag => imageTag)
      .map(imageTag => imageTag.toXml())
      .join('');
  }

  static create(images: ImageFile[]): ImageTagList {
    const imageTagList = new ImageTagList();

    imageTagList.identifiers = images.map(image => image.identifier);

    return imageTagList;
  }
}
//
