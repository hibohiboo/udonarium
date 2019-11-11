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

  // // GameObject Lifecycle
  // onStoreAdded() {
  //   super.onStoreAdded();
  // }

  // // GameObject Lifecycle
  // onStoreRemoved() {
  //   super.onStoreRemoved();
  // }

  // // override
  // apply(context: ObjectContext) {
  //   let audioIdentifier = this.audioIdentifier;
  //   let isPlaying = this.isPlaying;
  //   super.apply(context);
  //   if ((audioIdentifier !== this.audioIdentifier || !isPlaying) && this.isPlaying) {
  //     this._play();
  //   } else if (isPlaying !== this.isPlaying && !this.isPlaying) {
  //     this._stop();
  //   }
  // }

  // get fontSize(): number { return this.getCommonValue('fontsize', 1); }
  get title(): string { return this.getCommonValue('title', ''); }
  get text(): string { return this.getCommonValue('text', ''); }
  set text(text: string) { this.setCommonValue('text', text); }

  // toTopmost() {
  //   moveToTopmost(this);
  // }

  static create(title: string, text: string, fontSize: number = 16, width: number = 1, height: number = 1, identifier?: string): Cutin {
    const object: Cutin = identifier ? new Cutin(identifier) : new Cutin();

    object.createDataElements();
    // object.commonDataElement.appendChild(DataElement.create('fontsize', fontSize, {}, 'fontsize_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('title', title, {}, 'title_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('text', text, { type: 'note', currentValue: text }, 'text_' + object.identifier));
    object.initialize();

    return object;
  }

}
