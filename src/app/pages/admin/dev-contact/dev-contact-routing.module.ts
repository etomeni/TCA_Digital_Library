import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevContactPage } from './dev-contact.page';

const routes: Routes = [
  {
    path: '',
    component: DevContactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevContactPageRoutingModule {}
