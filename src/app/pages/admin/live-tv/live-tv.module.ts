import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveTVPageRoutingModule } from './live-tv-routing.module';

import { LiveTVPage } from './live-tv.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LiveTVPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LiveTVPage]
})
export class LiveTVPageModule {}
