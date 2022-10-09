import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { announcementPageRoutingModule } from './announcement-routing.module';

import { announcementPage } from './announcement.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    announcementPageRoutingModule,
    ComponentsModule
  ],
  declarations: [announcementPage]
})
export class announcementPageModule {}
