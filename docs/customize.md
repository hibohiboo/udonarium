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

##### gridの比率
src\app\service\tabletop.service.ts ファイルの`makeDefaultTable`メソッドを参照

```js
    gameTable.width = 28;
    gameTable.height = 20;
    gameTable.initialize();
```

##### 画像

src\app\service\tabletop.service.ts ファイルの`makeDefaultTable`メソッドを参照

#### コマやカードの初期配置

src\app\service\tabletop.service.ts ファイルの`makeDefaultTabletopObjects`メソッドを参照
identifierの名前を付けておかないと、初期表示同士が接続されたときに、同じコマが増える現象が起きる。


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


## 新コンポーネント追加

### 惨劇RoopeR用カードオブジェクト

#### class
src\app\class\card.tsをコピーして、src\app\class\rooper-card.tsを作成。

#### component
src\app\component\cardディレクトリをコピーして、src\app\component\rooper-cardディレクトリを作成。
src\app\component\card\card.component.tsでいくつかのメソッド・プロパティをprivateからprotectedに。

#### componentの登録
src\app\app.module.tsに登録する。

```diff
import { CardComponent } from 'component/card/card.component';
+import { RooperCardComponent } from 'component/rooper-card/rooper-card.component';

// 省略

@NgModule({
  declarations: [
    AppComponent,
    BadgeComponent,
    CardComponent,
+    RooperCardComponent,
```

#### game-table componentへの登録
src\app\component\game-table\game-table.component.ts

```js
  get rooperCards(): RooperCard[] {
    return this.tabletopService.rooperCards;
  }
```

src\app\component\game-table\game-table.component.html
```diff
      <card class="is-3d" *ngFor="let card of cards; trackBy: trackByGameObject" [card]="card" [appTooltip]="card" [ngStyle]="{'z-index' : card.zindex, 'transform': 'translateZ(' + (card.zindex * 0.001) +'px)'}"></card>
+      <rooper-card class="is-3d" *ngFor="let rooperCard of rooperCards; trackBy: trackByGameObject" [card]="rooperCard" [appTooltip]="rooperCard" [ngStyle]="{'z-index' : rooperCard.zindex, 'transform': 'translateZ(' + (rooperCard.zindex * 0.001) +'px)'}"></rooper-card>
```


#### サービスへの登録
src\app\service\tabletop.service.ts を編集

##### キャッシュの登録

```js
  private rooperCardCache = new TabletopCache<RooperCard>(() =>
    ObjectStore.instance.getObjects(RooperCard).filter(obj => obj.isVisibleOnTable)
  );
  get rooperCards(): RooperCard[] {
    return this.rooperCardCache.objects;
  }
```

```diff
  private findCache(aliasName: string): TabletopCache<any> {
    switch (aliasName) {
      case GameCharacter.aliasName:
        return this.characterCache;
      case Card.aliasName:
        return this.cardCache;
+      case RooperCard.aliasName:
+          return this.rooperCardCache;

// 省略


  private refreshCacheAll() {
    this.characterCache.refresh();
+    this.cardCache.refresh();
    this.rooperCardCache.refresh();
```

#### overviewの登録

src\app\component\overview-panel\overview-panel.component.html

```diff
    <ng-container *ngSwitchCase="'card'">
      <ng-container *ngTemplateOutlet="overviewCard; context: { card: tabletopObject }"></ng-container>
    </ng-container>
+    <ng-container *ngSwitchCase="'rooper-card'">
+      <ng-container *ngTemplateOutlet="overviewCard; context: { card: tabletopObject }"></ng-container>
+    </ng-container>
```

### Roomへの登録
これを行わないと、保存したときにxmlに出力されない。

src\app\class\room.ts

```diff
    objects = objects.concat(ObjectStore.instance.getObjects(Card).filter((obj) => { return obj.parent === null }));
+    objects = objects.concat(ObjectStore.instance.getObjects(RooperCard).filter((obj) => { return obj.parent === null }));
// 省略
    objects = objects.concat(ObjectStore.instance.getObjects(Card));
+    objects = objects.concat(ObjectStore.instance.getObjects(RooperCard));
```

## ノートを平面にする。

src\app\component\text-note\text-note.component.css

```diff
- transform: rotateX(-90deg);
```

## 参考

[【Angular7】初期フォーカスを当てる方法を解説！](https://traveler0401.com/angular-autofocus/)
[キーコード](https://web-designer.cman.jp/javascript_ref/keyboard/keycode/)
[Angularで、Componentにキーイベントを取得させる](https://qiita.com/Hayakuchi0/items/30e7b91c65d401ba8632)