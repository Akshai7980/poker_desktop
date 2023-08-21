import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReplayerComponent } from './replayer/replayer.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: ReplayerComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplayerRoutingModule {}
