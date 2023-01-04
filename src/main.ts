import 'hammerjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { SettingAppModule } from './settingApp/app.module';
import { pluginConfig } from './plugins/config';

if (environment.production) {
  enableProdMode();
}

if (pluginConfig.isSettingsPage) {
  platformBrowserDynamic().bootstrapModule(SettingAppModule)
} else {

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
