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

  // 直近でプリセット適用直後の設定値スナップショット（プリセット未編集かどうかの判定に使う）
  private presetSnapshot: Record<string, boolean | string> | null = null;

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
    // 読み込んだ設定がプリセットそのまま（未編集）かどうかを判定するためのスナップショットを再計算
    this.presetSnapshot = this.computePresetSettings(this.roomType);
  }

  /**
   * 指定した部屋タイプについて、プリセット適用＋依存関係解決後の設定値を計算する
   * （空の状態から適用するため、現在編集中の `this.settings` には影響しない）
   */
  private computePresetSettings(roomType: string): Record<string, boolean | string> | null {
    if (!roomType || !ROOM_PRESETS[roomType]) return null;

    const settings: Record<string, boolean | string> = {};
    for (const setting of BOOLEAN_SETTINGS) settings[setting.key] = false;
    for (const setting of STRING_SETTINGS) settings[setting.key] = '';

    const preset = ROOM_PRESETS[roomType];
    for (const [key, value] of Object.entries(preset)) {
      settings[key] = value;
    }
    applySettingDependencies(settings, Object.keys(preset));

    return settings;
  }

  /**
   * プリセット変更時（スキーマベース）
   * 「なし」を選んだ場合も含め、切り替えのたびに一旦設定をリセットしてから
   * 選択されたプリセットを反映する（前のプリセットの値が混ざらないようにする）
   */
  onPresetChange() {
    this.initializeSettings();

    const presetSettings = this.computePresetSettings(this.roomType);
    this.presetSnapshot = presetSettings;

    if (!presetSettings) {
      return; // 「なし」の場合はリセットのみ
    }

    Object.assign(this.settings, presetSettings);
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

    // 部屋設定: `room=<プリセット名>` は起動時にconfig.ts側で個々のクエリパラメータより
    // 優先して上書きされる（部屋別設定で上書き、参照: config.tsのpluginConfig定義）。
    // そのため、プリセット選択後にチェックボックスを個別に編集した状態のまま room を
    // 付けてしまうと、その編集が起動時に無効化されてしまう（例: 「全機能を有効化」から
    // 「カウンターボード」だけ外しても、room=all が優先されて結局ONに戻る）。
    // プリセットから一切変更していない場合のみ room を付与する
    // （vsrank/hollowはfirst-fetch-zip-room機能がroomの値をZIPファイル名として使うため、
    // 未編集時は room を残しておく必要がある）。
    if (this.roomType && this.isUnmodifiedFromPreset()) {
      params.set('room', this.roomType);
    }

    return params.toString();
  }

  /**
   * 現在の設定値が、選択中のプリセットから一切変更されていないかどうか
   */
  private isUnmodifiedFromPreset(): boolean {
    if (!this.presetSnapshot) return false;
    return BOOLEAN_SETTINGS.every(s => this.settings[s.key] === this.presetSnapshot![s.key])
      && STRING_SETTINGS.every(s => this.settings[s.key] === this.presetSnapshot![s.key]);
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
    this.presetSnapshot = null;
  }
}
