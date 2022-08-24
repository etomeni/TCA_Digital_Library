import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailzPage } from './detailz.page';

const routes: Routes = [
  {
    path: '',
    component: DetailzPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailzPageRoutingModule {}
