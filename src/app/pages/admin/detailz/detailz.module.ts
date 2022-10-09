import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailzPageRoutingModule } from './detailz-routing.module';

import { DetailzPage } from './detailz.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetailzPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DetailzPage]
})
export class DetailzPageModule {}
