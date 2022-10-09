import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnouncezPageRoutingModule } from './announcez-routing.module';

import { AnnouncezPage } from './announcez.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AnnouncezPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AnnouncezPage]
})
export class AnnouncezPageModule {}
