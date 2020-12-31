import { PanelOption, PanelService } from "service/panel.service";
import { RemoteControllerComponent } from "../controller/component/remote-controller/remote-controller.component";
import { ContextMenuAction } from "service/context-menu.service";
import { PointerCoordinate } from "service/pointer-device.service";
import { GameCharacter } from "@udonarium/game-character";

export default {
  gameObjectOnContextMenuHook(menuActions: ContextMenuAction[], panelService: PanelService, gameObject: GameCharacter, position: PointerCoordinate){
    if (gameObject.location.name !== 'graveyard') {
      menuActions.push(getRemoconMenuAction(panelService, gameObject, position));
    }
  },
  gameCharacterComponentAddContextMenu(panelService: PanelService, gameObject: GameCharacter, position: PointerCoordinate){
    return [getRemoconMenuAction(panelService, gameObject, position)];
  }
}


const getRemoconMenuAction = (panelService: PanelService, gameObject: GameCharacter, position: PointerCoordinate) => {
  return { name: 'リモコンを表示', action: () => { showRemoteController(panelService, gameObject, position) } };
}

export const showRemoteController = (panelService: PanelService, gameObject: GameCharacter, coordinate: PointerCoordinate) => {
  let option: PanelOption = { left: coordinate.x - 250, top: coordinate.y - 175, width: 700, height: 600 };
  let component = panelService.open<RemoteControllerComponent>(RemoteControllerComponent, option);
  component.character = gameObject;
}
