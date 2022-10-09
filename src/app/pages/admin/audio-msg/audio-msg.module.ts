import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AudioMsgPageRoutingModule } from './audio-msg-routing.module';

import { AudioMsgPage } from './audio-msg.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AudioMsgPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AudioMsgPage]
})
export class AudioMsgPageModule {}
