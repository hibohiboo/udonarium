import { PointerData } from 'service/pointer-device.service'
import { createCardMenues } from './cardMenu'

export default {
  cardComponentOnContextMenuHook: (that, position: PointerData) => {
    const menues = createCardMenues(that)
    that.contextMenuService.open(
      position,
      menues,
      that.isVisible ? that.name : 'カード',
    )
  },
}
