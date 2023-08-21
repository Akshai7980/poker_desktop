import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyStatsComponent } from './my-stats/my-stats.component';
import { CashComponent } from './cash/cash.component';
import { TournamentComponent } from './tournament/tournament.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MyStatsComponent },
      { path: 'cash', component: CashComponent },
      { path: 'tournament', component: TournamentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyStatsRoutingModule {}
