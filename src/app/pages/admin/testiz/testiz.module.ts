import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestizPageRoutingModule } from './testiz-routing.module';

import { TestizPage } from './testiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TestizPageRoutingModule
  ],
  declarations: [TestizPage]
})
export class TestizPageModule {}
