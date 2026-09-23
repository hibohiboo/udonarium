import { PeerCursor } from "@udonarium/peer-cursor";
import { pluginConfig } from "../config";

/**
 * 「ボードを自分のものだけ触れるようにする」設定が有効な場合に、対象のボードが
 * 自分以外の所有物かどうか（＝触れない状態かどうか）を判定する。
 *
 * `handStorage.owner` が空（誰の所有物でもない＝共用のボード）の場合は、まだ誰も
 * 所有権を主張していないので触れないようにしてはいけない。ここで無条件に
 * `owner !== myUserId` としてしまうと、新規作成した直後のボード（owner未設定）が
 * 作成者自身も含めて誰も触れない・右クリックメニューも開けない（＝所有権を主張する
 * 「自分の個人ボードにする」メニュー自体に辿り着けない）詰み状態になってしまう
 * （移行元 `udonarium-boardgame` から引き継いだ既知のバグ）。
 */
export const isMyHandStorageOnly = (handStorage: any) => pluginConfig.isUseHandStorageSelfOnly && !!handStorage.owner && handStorage.owner !== PeerCursor.myCursor.userId
