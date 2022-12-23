import { AudioFile } from './core/file-storage/audio-file';
import { AudioPlayer } from './core/file-storage/audio-player';
import { AudioStorage } from './core/file-storage/audio-storage';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { GameObject, ObjectContext } from './core/synchronize-object/game-object';
import { EventSystem } from './core/system';
import { TabletopObject } from './tabletop-object';
import { DataElement } from './data-element';
import { Cutin } from './cutin';
import { ImageFile } from '@udonarium/core/file-storage/image-file';

@SyncObject('cutin-view')
export class CutinView extends TabletopObject {
  @SyncVar() cutin: Cutin;

  get title(): string { return this.cutin.title; }
  // get imageFile(): ImageFile { return this.cutin.imageFile; }

  static create( cutin: Cutin, identifier?: string): CutinView {
    const object: CutinView = identifier ? new CutinView(identifier) : new CutinView();
    object.cutin = cutin;

    object.createDataElements();
    if (object.imageDataElement.getFirstElementByName('imageIdentifier')) {
      object.imageDataElement.getFirstElementByName('imageIdentifier').value = cutin.imageFile.identifier;
    }
    object.initialize();

    return object;
  }

}
