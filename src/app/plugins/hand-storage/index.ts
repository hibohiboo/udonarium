import { ImageFile } from "@udonarium/core/file-storage/image-file";
import { ImageStorage } from "@udonarium/core/file-storage/image-storage";
import { PresetSound, SoundEffect } from "@udonarium/sound-effect";
import { HandStorage } from "./class/hand-storage";

export default {
  // thatはGameTableComponent
  onContextMenuHook(that){

      return {
        name: '手札置き場を作成', action: () => {
          let position = that.pointerDeviceService.pointers[0];
          createHandStorage(position, that);
          SoundEffect.play(PresetSound.blockPut);
        }
      }
  }
}

const createHandStorage = (position, that)=>{
  // const viewTable = that.tableSelecter.viewTable;
  // if (!viewTable) return;

  const handStorage = HandStorage.create('手札置き場', 5, 5, 100);
  handStorage.location.x = position.x - 350;
  handStorage.location.y = position.y - 100;
  handStorage.posZ = 0;
  // viewTable.appendChild(handStorage);
  return handStorage;
}
