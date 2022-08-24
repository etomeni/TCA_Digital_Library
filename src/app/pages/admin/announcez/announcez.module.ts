import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnouncezPageRoutingModule } from './announcez-routing.module';

import { AnnouncezPage } from './announcez.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AnnouncezPageRoutingModule,
  ],
  declarations: [AnnouncezPage]
})
export class AnnouncezPageModule {}
