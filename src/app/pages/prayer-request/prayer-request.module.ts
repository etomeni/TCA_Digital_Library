import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayerRequestPageRoutingModule } from './prayer-request-routing.module';

import { PrayerRequestPage } from './prayer-request.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PrayerRequestPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrayerRequestPage]
})
export class PrayerRequestPageModule {}
