import { AudioFile } from './core/file-storage/audio-file';
import { AudioPlayer } from './core/file-storage/audio-player';
import { AudioStorage } from './core/file-storage/audio-storage';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { GameObject, ObjectContext } from './core/synchronize-object/game-object';
import { EventSystem } from './core/system';
import { TabletopObject } from './tabletop-object';
import { DataElement } from './data-element';

@SyncObject('cutin')
export class Cutin extends TabletopObject {
  // @SyncVar() audioIdentifier: string = '';

  get title(): string { return this.getCommonValue('title', ''); }
  get text(): string { return this.getCommonValue('text', ''); }
  set text(text: string) { this.setCommonValue('text', text); }

  static create(title: string, imageIdentifier: string, text: string = '', fontSize: number = 16, width: number = 1, height: number = 1, identifier?: string): Cutin {
    const object: Cutin = identifier ? new Cutin(identifier) : new Cutin();

    object.createDataElements();
    object.commonDataElement.appendChild(DataElement.create('title', title, {}, 'title_' + object.identifier));
    if (object.imageDataElement.getFirstElementByName('imageIdentifier')) {
      object.imageDataElement.getFirstElementByName('imageIdentifier').value = imageIdentifier;
    }
    object.initialize();

    return object;
  }

}
