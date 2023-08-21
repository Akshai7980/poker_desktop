import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './lobby.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cash-games',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LobbyComponent,
    children: [
      {
        path: 'cash-games',
        loadChildren: () =>
          import('./components/cash-games/cash-games.module').then((m) => m.CashGamesModule)
      },
      {
        path: 'tournaments',
        loadChildren: () =>
          import('./components/tournaments/tournaments.module').then((m) => m.TournamentsModule)
      },
      {
        path: 'sitandgo',
        loadChildren: () =>
          import('./components/sit-n-go/sit-n-go.module').then((m) => m.SitNGoModule)
      },
      {
        path: 'private-tables',
        loadChildren: () =>
          import('./components/private-tables/private-tables.module').then(
            (m) => m.PrivateTablesModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbyRoutingModule {}
