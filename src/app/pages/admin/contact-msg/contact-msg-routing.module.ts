import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactMsgPage } from './contact-msg.page';

const routes: Routes = [
  {
    path: '',
    component: ContactMsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactMsgPageRoutingModule {}
