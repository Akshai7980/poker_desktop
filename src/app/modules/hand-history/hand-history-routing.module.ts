import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandHistoryComponent } from './hand-history.component';
import { SngComponent } from './components/sng/sng.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { CashGamesComponent } from './components/cash-games/cash-games.component';

const routes: Routes = [
  {
    path: '',
    component: HandHistoryComponent,
    children: [
      { path: '', redirectTo: 'cash-games', pathMatch: 'full' },
      { path: 'cash-games', component: CashGamesComponent, pathMatch: 'full' },
      {
        path: 'tournaments',
        component: TournamentsComponent,
        pathMatch: 'full'
      },
      { path: 'sng', component: SngComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandHistoryRoutingModule {}
