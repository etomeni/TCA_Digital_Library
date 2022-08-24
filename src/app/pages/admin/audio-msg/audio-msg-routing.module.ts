import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AudioMsgPage } from './audio-msg.page';

const routes: Routes = [
  {
    path: '',
    component: AudioMsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudioMsgPageRoutingModule {}
