import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveTVPage } from './live-tv.page';

const routes: Routes = [
  {
    path: '',
    component: LiveTVPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveTVPageRoutingModule {}
