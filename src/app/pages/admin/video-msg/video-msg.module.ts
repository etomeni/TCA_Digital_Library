import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoMsgPageRoutingModule } from './video-msg-routing.module';

import { VideoMsgPage } from './video-msg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VideoMsgPageRoutingModule
  ],
  declarations: [VideoMsgPage]
})
export class VideoMsgPageModule {}
