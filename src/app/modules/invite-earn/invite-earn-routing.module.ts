import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteEarnComponent } from './invite-earn.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: InviteEarnComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteEarnRoutingModule {}
