import { ObjectStore } from '@udonarium/core/synchronize-object/object-store'
import { Listener } from '@udonarium/core/system'
import { StringUtil } from '@udonarium/core/system/util/string-util'
import { GameCharacter } from '@udonarium/game-character'
import { TabletopObject } from '@udonarium/tabletop-object'
import { ContextMenuSeparator } from 'service/context-menu.service'
import { OpenUrlComponent } from './component/open-url/open-url.component'

export default {
  gameCharacterComponentAddContextMenu(that) {
    if (that.gameCharacter.getUrls().length === 0) return []

    return [
      ContextMenuSeparator,
      {
        name: '参照URLを開く',
        action: null,
        subActions: that.gameCharacter.getUrls().map((urlElement) => {
          const url = urlElement.value.toString()
          return {
            name: urlElement.name ? urlElement.name : url,
            action: () => {
              that.modalService.open(OpenUrlComponent, {
                url: url,
                title: that.gameCharacter.name,
                subTitle: urlElement.name,
              })
            },
            disabled: !StringUtil.validUrl(url),
            error: !StringUtil.validUrl(url) ? 'URLが不正です' : null,
            materialIcon: 'open_in_new',
          }
        }),
      },
    ]
  },
  tabletopServiceInitializeHook(listener: Listener) {
    listener.on('XML_LOADED', (event) => {
      // URLのタイプをnoteからurlに変更
      const objects: TabletopObject[] = ObjectStore.instance.getObjects(
        GameCharacter,
      )
      for (const gameObject of objects) {
        if (gameObject instanceof GameCharacter) {
          const gameCharacter: GameCharacter = gameObject
          const [
            urlElement,
          ] = gameCharacter.detailDataElement.getElementsByName('URL')
          if (!urlElement) continue
          urlElement.setAttribute('type', 'url')
        }
      }
    })
  },
}
