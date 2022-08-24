import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoMsgPage } from './video-msg.page';

const routes: Routes = [
  {
    path: '',
    component: VideoMsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoMsgPageRoutingModule {}
