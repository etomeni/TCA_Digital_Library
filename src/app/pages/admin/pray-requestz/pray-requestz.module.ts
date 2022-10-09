import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayRequestzPageRoutingModule } from './pray-requestz-routing.module';

import { PrayRequestzPage } from './pray-requestz.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayRequestzPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrayRequestzPage]
})
export class PrayRequestzPageModule {}
