import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestimonyPageRoutingModule } from './testimony-routing.module';

import { TestimonyPage } from './testimony.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TestimonyPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TestimonyPage]
})
export class TestimonyPageModule {}
