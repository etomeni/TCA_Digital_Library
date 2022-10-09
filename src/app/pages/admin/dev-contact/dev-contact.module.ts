import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevContactPageRoutingModule } from './dev-contact-routing.module';

import { DevContactPage } from './dev-contact.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DevContactPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DevContactPage]
})
export class DevContactPageModule {}
