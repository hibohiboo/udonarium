## カスタマイズ覚書

### 右クリック時コンテキストメニュー

#### コンテキストメニュー選択肢

src\app\service\tabletop.service.ts ファイルの`getContextMenuActionsForCreateObject`メソッドを参照。

##### デッキの追加

src\app\service\tabletop.service.ts ファイルの`getCreateTrumpMenu`メソッドを参照

### 初期表示

#### ゲームテーブルの初期配置

##### 拡大率など

src\app\component\game-table\game-table.component.ts ファイルの`GameTableComponent`クラスのプロパティ参照

```js
  private viewPotisonX: number = 200;  // 左右の調整
  private viewPotisonY: number = 0;    // 上下の調整
  private viewPotisonZ: number = -600; // 拡大率

  private viewRotateX: number = 0; // 忍者屋敷のどんでん返しの壁のように回転
  private viewRotateY: number = 0; // ノートパソコン閉じたり開くときのように回転
  private viewRotateZ: number = 0; // 時計のように回転
```

##### 画像

src\app\service\tabletop.service.ts ファイルの`makeDefaultTable`メソッドを参照

#### コマやカードの初期配置

src\app\service\tabletop.service.ts ファイルの`makeDefaultTabletopObjects`メソッドを参照

#### チャットウィンドウ・接続情報の初期配置

src\app\app.component.tsファイルの`ngAfterViewInit`メソッドを参照

#### チャットの初期メッセージ

src\app\component\chat-tab\chat-tab.component.tsファイルの`ChatTabComponent`クラスのsampleMessagesプロパティを参照

### 接続情報のカスタマイズ

src\app\component\peer-menu\フォルダ内のファイルを参照

### メニューのカスタマイズ

src\app\app.component.htmlファイルを参照
[この時点のソース](https://github.com/hibohiboo/udonarium/tree/54643446e60710e6ef702b6a64c8176b81d18f34)

### キーボードショートカットの表示を追加
src\app\component\game-table\game-table.component.tsファイルの`onKeydown`メソッドを参照

[この時点のソース](https://github.com/hibohiboo/udonarium/tree/b7b27e1fed8aaeecceda17d902921b6353d18d6e)

### カードにキーボードイベントを対応させる

src\app\component\card\card.component.tsファイルを参照
コンポーネントにフォーカスを当てるようにしないとキーイベントを拾えなかったのでハマった。
tabIndexがないとフォーカスを当てられないもよう。。

```diff
  ElementRef,
  HostListener,
+  HostBinding,
```

```diff
+  @HostBinding('tabIndex') tabIndex:string;
  constructor(
    private ngZone: NgZone,
    private contextMenuService: ContextMenuService,
    private panelService: PanelService,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef,
    private tabletopService: TabletopService,
    private pointerDeviceService: PointerDeviceService
  ) {
+    this.tabIndex="0";
   }
```

```diff
+  @HostListener("pointerenter", ["$event"])
+  onPointerenter(e: KeyboardEvent) {
+    this.elementRef.nativeElement.focus();
+  }

+  @HostListener("keydown", ["$event"])
+  onKeydown(e: KeyboardEvent) {

+    if (e.key === 't') {
+      this.card.rotate = 90;
+      return;
+    }
+    if (e.key === 'u') {
+      this.rotate = 0;
+      return;
+    }
+  }

  private createStack() {
```


[この時点のソース](https://github.com/hibohiboo/udonarium/tree/0f52077de2cfc74b835c59eabb25496d164544cc)


## 参考

[【Angular7】初期フォーカスを当てる方法を解説！](https://traveler0401.com/angular-autofocus/)
[キーコード](https://web-designer.cman.jp/javascript_ref/keyboard/keycode/)
[Angularで、Componentにキーイベントを取得させる](https://qiita.com/Hayakuchi0/items/30e7b91c65d401ba8632)