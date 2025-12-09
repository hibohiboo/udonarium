import { Component } from '@angular/core';

/**
 * プラグイン設定ページコンポーネント
 * クエリパラメータを視覚的に設定してゲームを起動
 */
@Component({
  selector: 'app-plugin-settings',
  templateUrl: './plugin-settings.component.html',
  styleUrls: ['./plugin-settings.component.css']
})
export class PluginSettingsComponent {
  // windowオブジェクトへの参照（テンプレートで使用）
  window = window;

  // 表示モード
  is2d = false;
  isTutorial = false;

  // カード操作
  isTapCard = false;
  isCardShuffleNormalPosition = false;

  // UI機能
  isUseKeyboardShortcut = false;
  isAddCounterBoard = false;
  isChangeDefaultTerrain = false;

  // チャット・手札
  useChatCommand = false;
  isUseHandStorage = false;

  // カメラ座標
  cameraZ = '';
  cameraX = '';
  cameraY = '';
  cameraRX = '';
  cameraRY = '';
  cameraRZ = '';

  // 部屋設定
  roomType = '';

  // プリセット設定
  presets = [
    { value: '', label: 'なし' },
    { value: 'vsrank', label: 'VSRank用設定' },
    { value: 'hollow', label: 'Hollow用設定' },
  ];

  constructor() {
    this.loadFromCurrentParams();
  }

  /**
   * 現在のURLパラメータから設定を読み込む
   */
  private loadFromCurrentParams() {
    const params = new URLSearchParams(window.location.search);

    // 表示モード
    this.is2d = params.has('2d');
    this.isTutorial = params.has('tutorial');

    // カード操作
    this.isTapCard = params.has('tap-card');
    this.isCardShuffleNormalPosition = params.has('shuffle-normal');

    // UI機能
    this.isUseKeyboardShortcut = params.has('key-shortcut');
    this.isAddCounterBoard = params.has('counter-board');
    this.isChangeDefaultTerrain = params.has('change-default-terrain');

    // チャット・手札
    this.useChatCommand = params.has('use-chat-command');
    this.isUseHandStorage = params.has('use-hand-storage');

    // カメラ座標
    this.cameraZ = params.get('z') ?? '';
    this.cameraX = params.get('x') ?? '';
    this.cameraY = params.get('y') ?? '';
    this.cameraRX = params.get('rx') ?? '';
    this.cameraRY = params.get('ry') ?? '';
    this.cameraRZ = params.get('rz') ?? '';

    // 部屋設定
    this.roomType = params.get('room') ?? '';
  }

  /**
   * プリセット変更時
   */
  onPresetChange() {
    // プリセット適用時のデフォルト値設定
    switch (this.roomType) {
      case 'vsrank':
        this.isTapCard = true;
        this.isUseKeyboardShortcut = true;
        this.isCardShuffleNormalPosition = true;
        this.isAddCounterBoard = true;
        this.isChangeDefaultTerrain = false;
        break;
      case 'hollow':
        this.isTapCard = true;
        this.isUseKeyboardShortcut = true;
        this.isCardShuffleNormalPosition = true;
        this.isChangeDefaultTerrain = false;
        break;
      case '':
        // プリセットなし - 現在の設定を維持
        break;
    }
  }

  /**
   * クエリパラメータ文字列を生成
   */
  generateQueryString(): string {
    const params = new URLSearchParams();

    // 表示モード
    if (this.is2d) params.set('2d', '');
    if (this.isTutorial) params.set('tutorial', '');

    // カード操作
    if (this.isTapCard) params.set('tap-card', '');
    if (this.isCardShuffleNormalPosition) params.set('shuffle-normal', '');

    // UI機能
    if (this.isUseKeyboardShortcut) params.set('key-shortcut', '');
    if (this.isAddCounterBoard) params.set('counter-board', '');
    if (this.isChangeDefaultTerrain) params.set('change-default-terrain', '');

    // チャット・手札
    if (this.useChatCommand) params.set('use-chat-command', '');
    if (this.isUseHandStorage) params.set('use-hand-storage', '');

    // カメラ座標
    if (this.cameraZ) params.set('z', this.cameraZ);
    if (this.cameraX) params.set('x', this.cameraX);
    if (this.cameraY) params.set('y', this.cameraY);
    if (this.cameraRX) params.set('rx', this.cameraRX);
    if (this.cameraRY) params.set('ry', this.cameraRY);
    if (this.cameraRZ) params.set('rz', this.cameraRZ);

    // 部屋設定
    if (this.roomType) params.set('room', this.roomType);

    return params.toString();
  }

  /**
   * URLをコピー
   */
  copyUrl() {
    const queryString = this.generateQueryString();
    const url = `${window.location.origin}/${queryString ? '?' + queryString : ''}`;
    navigator.clipboard.writeText(url);
    alert('URLをクリップボードにコピーしました');
  }

  /**
   * ゲームを起動
   */
  launchGame() {
    const queryString = this.generateQueryString();
    window.location.href = `/${queryString ? '?' + queryString : ''}`;
  }

  /**
   * 設定をリセット
   */
  reset() {
    this.is2d = false;
    this.isTutorial = false;
    this.isTapCard = false;
    this.isCardShuffleNormalPosition = false;
    this.isUseKeyboardShortcut = false;
    this.isAddCounterBoard = false;
    this.isChangeDefaultTerrain = false;
    this.useChatCommand = false;
    this.isUseHandStorage = false;
    this.cameraZ = '';
    this.cameraX = '';
    this.cameraY = '';
    this.cameraRX = '';
    this.cameraRY = '';
    this.cameraRZ = '';
    this.roomType = '';
  }
}
