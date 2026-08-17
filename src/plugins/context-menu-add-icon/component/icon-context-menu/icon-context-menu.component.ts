import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContextMenuAction, ContextMenuService } from 'service/context-menu.service';

/**
 * ゲームテーブル背景の右クリックメニュー（オブジェクト新規作成メニュー）の
 * アイコングリッド表示版。
 * 通常の component/context-menu/context-menu.component.ts と同じ役割（位置調整・
 * 外側クリックで閉じる）を持つが、テキストの縦一覧ではなくアイコン付きのグリッドで描画する。
 * ダイスのみ、種類選択のサブメニューを通常のテキストメニューとして開き直す。
 */
@Component({
  selector: 'icon-context-menu',
  templateUrl: './icon-context-menu.component.html',
  styleUrls: ['./icon-context-menu.component.css']
})
export class IconContextMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('root', { static: true }) rootElementRef: ElementRef<HTMLElement>;

  actions: ContextMenuAction[] = [];

  // *ngFor で描画するアイコン一覧。ngOnInit で一度だけ計算して固定する。
  // getter にして毎変更検知サイクルで作り直すと、返す配列・オブジェクトが毎回別参照になり
  // *ngFor がその都度 <li> を作り直してしまう（mousemoveなどのイベントでも変更検知は走るため、
  // mousedown～clickの間に要素が差し替わり、実クリックが届かなくなる不具合になる）。
  iconItems: { action: ContextMenuAction, icon: string, label: string }[] = [];

  private callbackOnOutsideClick = (e: Event) => this.onOutsideClick(e);

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    public contextMenuService: ContextMenuService,
  ) { }

  ngOnInit() {
    this.actions = this.contextMenuService.actions;
    this.iconItems = IconContextMenuComponent.ICON_MAP
      .map(item => ({ action: this.findAction(item.name), icon: item.icon, label: item.label }))
      .filter((item): item is { action: ContextMenuAction, icon: string, label: string } => item.action != null);
  }

  ngAfterViewInit() {
    this.adjustPosition();
    document.addEventListener('touchstart', this.callbackOnOutsideClick, true);
    document.addEventListener('mousedown', this.callbackOnOutsideClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('touchstart', this.callbackOnOutsideClick, true);
    document.removeEventListener('mousedown', this.callbackOnOutsideClick, true);
  }

  onOutsideClick(event: Event) {
    if (this.rootElementRef.nativeElement.contains(event.target as Node) === false) {
      this.close();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  private adjustPosition() {
    let panel: HTMLElement = this.rootElementRef.nativeElement;

    panel.style.left = this.contextMenuService.position.x + 'px';
    panel.style.top = this.contextMenuService.position.y + 'px';

    let panelBox = panel.getBoundingClientRect();

    let diffLeft = 0;
    let diffTop = 0;

    if (window.innerWidth < panelBox.right + diffLeft) {
      diffLeft += window.innerWidth - (panelBox.right + diffLeft);
    }
    if (panelBox.left + diffLeft < 0) {
      diffLeft += 0 - (panelBox.left + diffLeft);
    }

    if (window.innerHeight < panelBox.bottom + diffTop) {
      diffTop += window.innerHeight - (panelBox.bottom + diffTop);
    }
    if (panelBox.top + diffTop < 0) {
      diffTop += 0 - (panelBox.top + diffTop);
    }

    panel.style.left = panel.offsetLeft + diffLeft + 'px';
    panel.style.top = panel.offsetTop + diffTop + 'px';
  }

  doAction(action: ContextMenuAction) {
    if (action.subActions && 0 < action.subActions.length) {
      // ダイスなど：種類選択は通常のテキストメニューをサブメニューとして開き直す
      this.contextMenuService.open(this.contextMenuService.position, action.subActions, action.name);
      return;
    }
    if (action.action != null) {
      action.action();
    }
    this.close();
  }

  close() {
    if (this.contextMenuService) this.contextMenuService.close();
  }

  /**
   * アイコン化する対象のアクション名 → アイコン・ラベルの対応表。
   * 「ボードを作成」「ブランクカードを作成」はプラグイン設定次第でactionsに存在しないことがあるため、
   * ngOnInit側で存在するものだけに絞り込む。
   * アイコンは全て「Material Icons」フォント（index.htmlで読み込み済み）の範囲で選定。
   * 本家(udonarium-boardgame)の対応機能はmaterial-symbols-outlinedフォント（未読込）の
   * 'diagnosis' を使っているが、フォント追加を避けるためMaterial Iconsの'style'で代替する。
   */
  private static readonly ICON_MAP: { name: string, icon: string, label: string }[] = [
    { name: 'ブランクカードを作成', icon: 'crop_portrait', label: 'カード' },
    { name: 'トランプの山札を作成', icon: 'style', label: 'トランプ' },
    { name: 'ボードを作成', icon: 'view_comfy', label: 'ボード' },
    { name: 'キャラクターを作成', icon: 'person', label: 'フィギュア' },
    { name: 'ダイスを作成', icon: 'casino', label: 'ダイス' },
    { name: '地形を作成', icon: 'token', label: 'キューブ' },
    { name: '共有メモを作成', icon: 'article', label: 'ノート' },
    { name: 'マップマスクを作成', icon: 'layers', label: 'レイヤー' },
    { name: 'テーブル設定', icon: 'settings_applications', label: 'テーブル' },
  ];

  private findAction(name: string): ContextMenuAction | undefined {
    return this.actions.find(action => action.name === name);
  }
}
