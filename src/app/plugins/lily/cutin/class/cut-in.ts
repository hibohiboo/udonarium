import { AudioFile } from '@udonarium/core/file-storage/audio-file';
import { AudioPlayer } from '@udonarium/core/file-storage/audio-player';
import { AudioStorage } from '@udonarium/core/file-storage/audio-storage';

import { SyncObject, SyncVar } from '@udonarium/core/synchronize-object/decorator';
import { GameObject, ObjectContext } from '@udonarium/core/synchronize-object/game-object';

import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';


@SyncObject('cut-in')
export class CutIn extends GameObject {
  @SyncVar() name: string = 'カットイン';
  @SyncVar() width: number = 480;
  @SyncVar() height: number = 320;
  @SyncVar() originalSize: boolean = true;
  @SyncVar() x_pos: number = 50;
  @SyncVar() y_pos: number = 50;

  //主にジュークボックス機能を参考に作成
  @SyncVar() imageIdentifier: string = 'imageIdentifier';
  @SyncVar() audioIdentifier: string = '';
  @SyncVar() audioName: string = '';
  @SyncVar() startTime: number = 0;
  @SyncVar() tagName: string = '';
  @SyncVar() selected: boolean = false;
  @SyncVar() isLoop: boolean = false;
  @SyncVar() outTime: number = 0;

  @SyncVar() useOutUrl: boolean = false;
  @SyncVar() outUrl: string = '';
  @SyncVar() isPlaying: boolean = false;

  get audio(): AudioFile { return AudioStorage.instance.get(this.audioIdentifier); }
  private audioPlayer: AudioPlayer = new AudioPlayer();

  get cutInImage(): ImageFile {
    if (!this.imageIdentifier) return ImageFile.Empty;
    let file = ImageStorage.instance.get(this.imageIdentifier);
    return file ? file : ImageFile.Empty;
  }

  // GameObject Lifecycle
  onStoreAdded() {
    super.onStoreAdded();
  }

  // GameObject Lifecycle
  onStoreRemoved() {
    super.onStoreRemoved();
  }

}
