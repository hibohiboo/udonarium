import { ObjectStore } from '@udonarium/core/synchronize-object/object-store'
import { GameCharacter } from '@udonarium/game-character'
import { PanelOption, PanelService } from 'service/panel.service'
import { ChatColorSettingComponent } from '../component/chat-color-setting/chat-color-setting.component'

export const shoeColorSetting = (that) => {
  const panelService: PanelService = that.panelService
  if (that.isChatWindow) {
    const coordinate = that.pointerDeviceService.pointers[0]
    const title = '色設定'
    const option: PanelOption = {
      title: title,
      left: coordinate.x + 50,
      top: coordinate.y - 150,
      width: 300,
      height: 120,
    }
    const component = panelService.open<ChatColorSettingComponent>(
      ChatColorSettingComponent,
      option,
    )
    component.tabletopObject = null
  } else {
    const object = ObjectStore.instance.get(that.sendFrom)
    if (object instanceof GameCharacter) {
      const coordinate = that.pointerDeviceService.pointers[0]
      let title = '色設定'
      if (object.name.length) title += ' - ' + object.name
      const option: PanelOption = {
        title: title,
        left: coordinate.x + 50,
        top: coordinate.y - 150,
        width: 300,
        height: 120,
      }
      const component = panelService.open<ChatColorSettingComponent>(
        ChatColorSettingComponent,
        option,
      )
      component.tabletopObject = object
    }
  }
}
