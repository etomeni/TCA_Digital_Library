import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { announcementPageRoutingModule } from './announcement-routing.module';

import { announcementPage } from './announcement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    announcementPageRoutingModule
  ],
  declarations: [announcementPage]
})
export class announcementPageModule {}
