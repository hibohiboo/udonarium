import { CardComponent } from 'component/card/card.component'
const menuKey = 'm'

export default {
  keyboardHook(that, e: KeyboardEvent) {
    if (e.key === menuKey) {
      if (that.modalService.isShow) {
        return false
      }
      that.onContextMenu(e)
      return true
    }
    return false
  },
  cardOnKeydownHook(card: { onContextMenu: any }, e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()

    if (e.key === menuKey) {
      card.onContextMenu(e)
      return true
    }
    return false
  },
}
// ショートカットキー希望は
// コピーを作る　C
// 地形設定を編集　Q
// 削除する　D

// キャラクターコマ移動
// 墓地に移動　CTRL+M
// 共有イベントに移動　CTRL∔N
// 詳細を表示　CTRL+I
// キャラクターコマを二段で表示してほしい、つまり一段目は　ACとHPとレベルとクラスと　良く使う攻撃方法　二段目で詳細設定など
