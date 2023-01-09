import { pluginConfig } from "src/plugins/config";

export const getIsUpright = (that:any): boolean => {
  if (!pluginConfig.isTextNoteSelectableUprightFlat) return true;
  return that.textNote.isUpright;
}

export const setIsUpright = (that:any, isUpright: boolean) => {
  if (!pluginConfig.isTextNoteSelectableUprightFlat) return;
  that.textNote.isUpright = isUpright;
}

export const uprightContextMenu = (that:any)=>{
  if (!pluginConfig.isTextNoteSelectableUprightFlat) return [];

  return [(that.isUpright
    ? {
      name: '☑ 直立', action: () => {
        that.isUpright = false;
      }
    } : {
      name: '☐ 直立', action: () => {
        that.isUpright = true;
      }
    })]
}
