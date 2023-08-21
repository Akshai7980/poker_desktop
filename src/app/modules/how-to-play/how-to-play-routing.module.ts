import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: HowToPlayComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HowToPlayRoutingModule {}
