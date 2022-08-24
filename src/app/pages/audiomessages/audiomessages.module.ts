import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AudioMessagesPageRoutingModule } from './audiomessages-routing.module';

import { AudioMessagesPage } from './audiomessages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AudioMessagesPageRoutingModule
  ],
  declarations: [AudioMessagesPage]
})
export class AudioMessagesPageModule {}
