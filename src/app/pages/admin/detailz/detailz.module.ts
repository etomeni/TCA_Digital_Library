import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailzPageRoutingModule } from './detailz-routing.module';

import { DetailzPage } from './detailz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetailzPageRoutingModule
  ],
  declarations: [DetailzPage]
})
export class DetailzPageModule {}
