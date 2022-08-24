import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveTVPageRoutingModule } from './live-tv-routing.module';

import { LiveTVPage } from './live-tv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveTVPageRoutingModule
  ],
  declarations: [LiveTVPage]
})
export class LiveTVPageModule {}
