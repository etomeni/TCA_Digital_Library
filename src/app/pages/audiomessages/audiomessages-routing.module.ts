import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AudioMessagesPage } from './audiomessages.page';

const routes: Routes = [
  {
    path: '',
    component: AudioMessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudioMessagesPageRoutingModule {}
