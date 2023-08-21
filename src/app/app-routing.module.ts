import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCashModule } from 'projects/cashier/src/lib/add-cash/add-cash.module';
import { NgxLeaderBoardModule } from 'projects/leader-board/src/lib/leader-board.module';
import { AuthGuard, ScreenId } from 'projects/shared/src/public-api';
import { NgxResponsibleGamingModule } from 'projects/responsible-gaming/src/lib/responsible-gaming.module';
import { NgxRafModule } from 'projects/raf/src/lib/raf.module';
import { LayoutComponent } from './core/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: ScreenId.LOBBY,
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: ScreenId.SETTINGS,
    loadChildren: () => import('./modules/settings/settings.module').then((m) => m.SettingsModule)
  },
  {
    path: ScreenId.GAME_TABLE,
    loadChildren: () =>
      import('./modules/game-table/game-table.module').then((m) => m.GameTableModule)
  },
  {
    path: ScreenId.ADD_CASH,
    loadChildren: () => AddCashModule
  },
  {
    path: ScreenId.TOURNAMENTS,
    loadChildren: () =>
      import('./modules/tournaments/tournaments.module').then((m) => m.TournamentsModule)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: ScreenId.LOBBY,
        loadChildren: () => import('./modules/lobby/lobby.module').then((m) => m.LobbyMainModule)
      },
      {
        path: ScreenId.TROPHY,
        loadChildren: () => import('./modules/trophy/trophy.module').then((m) => m.TrophyModule)
      },
      {
        path: ScreenId.PROMOTIONS,
        loadChildren: () =>
          import('./modules/promotions/promotions.module').then((m) => m.PromotionsModule)
      },
      {
        path: ScreenId.MY_STATS,
        loadChildren: () =>
          import('./modules/my-stats/my-stats.module').then((m) => m.MyStatsModule)
      },
      {
        path: ScreenId.HAND_HISTORY,
        loadChildren: () =>
          import('./modules/hand-history/hand-history.module').then((m) => m.HandHistoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: ScreenId.REPLAYER,
        loadChildren: () =>
          import('./modules/replayer/replayer.module').then((m) => m.ReplayerModule)
      },
      {
        path: ScreenId.HOW_TO_PLAY,
        loadChildren: () =>
          import('./modules/how-to-play/how-to-play.module').then((m) => m.HowToPlayModule)
      },
      {
        path: ScreenId.CONTACT_US,
        loadChildren: () =>
          import('./modules/contact-us/contact-us.module').then((m) => m.ContactUsModule)
      },
      {
        path: 'search-player',
        loadChildren: () =>
          import('./modules/search-player/search-player.module').then((m) => m.SearchPlayerModule)
      },
      {
        path: ScreenId.LEADERBOARD,
        loadChildren: () => NgxLeaderBoardModule,
        canActivate: [AuthGuard]
      },
      {
        path: ScreenId.RESPONSIBLE_GAMING,
        loadChildren: () => NgxResponsibleGamingModule,
        canActivate: [AuthGuard]
      },
      {
        path: ScreenId.INVITE,
        loadChildren: () => NgxRafModule
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
