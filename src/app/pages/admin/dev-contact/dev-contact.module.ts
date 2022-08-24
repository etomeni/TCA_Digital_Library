import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevContactPageRoutingModule } from './dev-contact-routing.module';

import { DevContactPage } from './dev-contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DevContactPageRoutingModule
  ],
  declarations: [DevContactPage]
})
export class DevContactPageModule {}
