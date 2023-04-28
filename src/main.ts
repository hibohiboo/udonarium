import 'hammerjs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { SettingAppModule } from './settingApp/app.module';
import { pluginConfig } from './plugins/config';


{
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
