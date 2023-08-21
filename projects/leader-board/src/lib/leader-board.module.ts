import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { LeaderboardRhsContainerComponent } from './components/leaderboard-rhs-container/leaderboard-rhs-container.component';
import { FaqDialogComponent } from './components/dialogs/faq-dialog/faq-dialog.component';
import { CashGamesComponent } from './components/cash-games/cash-games.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { MaterialModule } from './material.module';
import PrimengModule from './primeng.module';
import { LeaderBoardComponent } from './leader-board.component';
import { RulesDialogComponent } from './components/dialogs/rules-dialog/rules-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: LeaderBoardComponent,
    children: [
      { path: '', redirectTo: 'cash-games', pathMatch: 'full' },
      { path: 'cash-games', component: CashGamesComponent, pathMatch: 'full' },
      { path: 'tournaments', component: TournamentsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    LeaderBoardComponent,
    RulesDialogComponent,
    LeaderboardRhsContainerComponent,
    FaqDialogComponent,
    CashGamesComponent,
    TournamentsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimengModule,
    NgxSharedModule,
    HttpClientModule
  ],
  exports: [LeaderBoardComponent, RulesDialogComponent]
})
export class NgxLeaderBoardModule {}
