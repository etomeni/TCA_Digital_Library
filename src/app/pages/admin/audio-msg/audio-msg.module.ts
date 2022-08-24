import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AudioMsgPageRoutingModule } from './audio-msg-routing.module';

import { AudioMsgPage } from './audio-msg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AudioMsgPageRoutingModule
  ],
  declarations: [AudioMsgPage]
})
export class AudioMsgPageModule {}
