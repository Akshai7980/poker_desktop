import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrophyComponent } from './trophy.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: TrophyComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrophyRoutingModule {}
