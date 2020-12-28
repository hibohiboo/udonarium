import type { PanelOption, PanelService } from "service/panel.service";
import { PointerDeviceService } from "service/pointer-device.service";
import { DiceTableSettingComponent } from "../component/dice-table-setting/dice-table-setting.component";

export default {
  showDiceTableSetting(pointerDeviceService: PointerDeviceService, panelService: PanelService){
    let coordinate = pointerDeviceService.pointers[0];
    let option: PanelOption = { left: coordinate.x - 250, top: coordinate.y - 200, width: 500, height: 400 };
    let component = panelService.open<DiceTableSettingComponent>(DiceTableSettingComponent, option);
  }
}
