import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionsComponent } from './promotions.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: PromotionsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionsRoutingModule {}
