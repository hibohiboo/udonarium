import { PeerCursor } from "@udonarium/peer-cursor"
import { TextNoteComponent } from "component/text-note/text-note.component";
import { pluginConfig } from "src/plugins/config";
import { addVirtualScreen, deleteVirtualScreen } from "src/plugins/virtual-screen/domain/virtualScreen";

export const hideVirtualScreenTextNote = (that) => {
  if(!pluginConfig.isUseVirtualScreen) return false;


  return that.textNote.isHideVirtualScreen && that.textNote.hideVirtualScreenUserName !== PeerCursor.myCursor.name;
}

export const initVirtualScreenTextNote = (that)=> {
  if(!pluginConfig.isUseVirtualScreen) return;

  if (!that.addVirtualScreen) {
    // @ts-ignore
    TextNoteComponent.prototype.addVirtualScreen = function() {
      addVirtualScreen(this.textNote);
    }
  }
  if (!that.deleteVirtualScreen) {
    // @ts-ignore
    TextNoteComponent.prototype.deleteVirtualScreen = function() {
      deleteVirtualScreen(this.textNote);
    }
  }

  if (!that.isHideVirtualScreen) {
    // @ts-ignore
    TextNoteComponent.prototype.isHideVirtualScreen = function() {
      return this.textNote.isHideVirtualScreen;
    }
  }
}
