import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestimonyPage } from './testimony.page';

const routes: Routes = [
  {
    path: '',
    component: TestimonyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestimonyPageRoutingModule {}
