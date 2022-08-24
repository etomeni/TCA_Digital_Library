import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayRequestzPageRoutingModule } from './pray-requestz-routing.module';

import { PrayRequestzPage } from './pray-requestz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayRequestzPageRoutingModule
  ],
  declarations: [PrayRequestzPage]
})
export class PrayRequestzPageModule {}
