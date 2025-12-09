import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import pluginModules from '../plugins/extends/modules';

const routes: Routes = [
  ...pluginModules.routes,
  // 他のルートはAppComponentにフォールバック（既存のゲーム画面）
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
