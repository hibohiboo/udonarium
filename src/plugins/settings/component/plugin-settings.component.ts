import { Component } from '@angular/core';
import {
  BOOLEAN_SETTINGS,
  STRING_SETTINGS,
  ROOM_PRESETS,
  PRESET_OPTIONS,
  CATEGORIES,
  SettingItem,
  applySettingDependencies,
} from '../../config-schema';

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

  // 設定値を格納するオブジェクト（スキーマから動的に初期化）
  settings: Record<string, boolean | string> = {};

  // 部屋設定
  roomType = '';

  // プリセット設定（スキーマから取得）
  presets = PRESET_OPTIONS;

  // カテゴリ情報（テンプレートで使用）
  categories = CATEGORIES;

  // カメラ設定（テンプレートで使用）
  cameraSettings = STRING_SETTINGS;

  constructor() {
    this.initializeSettings();
    this.loadFromCurrentParams();
  }

  /**
   * カテゴリに属する設定項目を取得
   */
  getSettingsByCategory(categoryId: string): SettingItem[] {
    return BOOLEAN_SETTINGS.filter(s => s.category === categoryId);
  }

  /**
   * チェックボックス変更時（Boolean設定用）
   * 値を反映した上で、設定間の依存関係（DEPENDENCIES）を連動させる
   */
  onBooleanSettingChange(key: string, value: boolean) {
    this.settings[key] = value;
    applySettingDependencies(this.settings, [key]);
  }

  /**
   * 設定を初期化（スキーマから動的に初期化）
   */
  private initializeSettings() {
    // Boolean設定を初期化
    for (const setting of BOOLEAN_SETTINGS) {
      this.settings[setting.key] = false;
    }

    // String設定を初期化
    for (const setting of STRING_SETTINGS) {
      this.settings[setting.key] = '';
    }
  }

  /**
   * 現在のURLパラメータから設定を読み込む（スキーマベース）
   */
  private loadFromCurrentParams() {
    const params = new URLSearchParams(window.location.search);

    // Boolean設定を読み込み
    for (const setting of BOOLEAN_SETTINGS) {
      this.settings[setting.key] = params.has(setting.param);
    }

    // String設定を読み込み
    for (const setting of STRING_SETTINGS) {
      this.settings[setting.key] = params.get(setting.param) ?? '';
    }

    // 部屋設定
    this.roomType = params.get('room') ?? '';
  }

  /**
   * プリセット変更時（スキーマベース）
   * 「なし」を選んだ場合も含め、切り替えのたびに一旦設定をリセットしてから
   * 選択されたプリセットを反映する（前のプリセットの値が混ざらないようにする）
   */
  onPresetChange() {
    this.initializeSettings();

    if (!this.roomType || !ROOM_PRESETS[this.roomType]) {
      return; // 「なし」の場合はリセットのみ
    }

    // プリセット設定を適用
    const preset = ROOM_PRESETS[this.roomType];
    for (const [key, value] of Object.entries(preset)) {
      this.settings[key] = value;
    }

    // プリセット適用後も設定間の依存関係を反映する
    applySettingDependencies(this.settings, Object.keys(preset));
  }

  /**
   * クエリパラメータ文字列を生成（スキーマベース）
   */
  generateQueryString(): string {
    const params = new URLSearchParams();

    // Boolean設定をパラメータ化
    for (const setting of BOOLEAN_SETTINGS) {
      if (this.settings[setting.key]) {
        params.set(setting.param, '');
      }
    }

    // String設定をパラメータ化
    for (const setting of STRING_SETTINGS) {
      const value = this.settings[setting.key];
      if (value) {
        params.set(setting.param, String(value));
      }
    }

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
   * 設定をリセット（スキーマベース）
   */
  reset() {
    this.initializeSettings();
    this.roomType = '';
  }
}
