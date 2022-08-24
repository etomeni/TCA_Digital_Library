import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoMessagesPageRoutingModule } from './videomessages-routing.module';

import { VideoMessagesPage } from './videomessages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoMessagesPageRoutingModule,
  ],
  declarations: [VideoMessagesPage]
})
export class VideoMessagesPageModule {}
