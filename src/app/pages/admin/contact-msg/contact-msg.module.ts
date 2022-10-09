import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactMsgPageRoutingModule } from './contact-msg-routing.module';

import { ContactMsgPage } from './contact-msg.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactMsgPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ContactMsgPage]
})
export class ContactMsgPageModule {}
