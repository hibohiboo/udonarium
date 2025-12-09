import { Routes } from '@angular/router';
import { PluginSettingsComponent } from './component/plugin-settings.component';

/**
 * プラグイン設定画面のルート定義
 */
export const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: PluginSettingsComponent
  }
];
