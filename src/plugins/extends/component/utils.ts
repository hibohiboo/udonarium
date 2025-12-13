/**
 * コンポーネント拡張用の共通ユーティリティ
 */

/**
 * クラス更新関数を生成するヘルパー
 * @param className 追加/削除するCSSクラス名
 * @param shouldAddClass クラスを追加すべきかを判定する関数
 * @returns クラスを更新する関数
 */
export const createClassUpdater = function(className: string, shouldAddClass: () => boolean) {
  return function(this: any) {
    if (!this.elementRef?.nativeElement) { return; }
    if (shouldAddClass.call(this)) {
      this.elementRef.nativeElement.classList.add(className);
    } else {
      this.elementRef.nativeElement.classList.remove(className);
    }
  };
};
