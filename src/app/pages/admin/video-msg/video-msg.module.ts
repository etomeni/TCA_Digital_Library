import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoMsgPageRoutingModule } from './video-msg-routing.module';

import { VideoMsgPage } from './video-msg.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VideoMsgPageRoutingModule,
    ComponentsModule
  ],
  declarations: [VideoMsgPage]
})
export class VideoMsgPageModule {}
