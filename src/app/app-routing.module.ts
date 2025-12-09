import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PluginSettingsComponent } from '../component/plugin-settings/plugin-settings.component';

const routes: Routes = [
  {
    path: 'settings',
    component: PluginSettingsComponent
  },
  // 他のルートはAppComponentにフォールバック（既存のゲーム画面）
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
