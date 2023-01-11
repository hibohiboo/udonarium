import { PeerCursor } from "@udonarium/peer-cursor";
import { pluginConfig } from "../config";

export const isMyHandStorageOnly = (handStorage: any) => pluginConfig.isUseHandStorageSelfOnly && handStorage.owner !== PeerCursor.myCursor.userId
