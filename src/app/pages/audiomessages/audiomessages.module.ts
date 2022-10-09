import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AudioMessagesPageRoutingModule } from './audiomessages-routing.module';

import { AudioMessagesPage } from './audiomessages.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AudioMessagesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AudioMessagesPage]
})
export class AudioMessagesPageModule {}
