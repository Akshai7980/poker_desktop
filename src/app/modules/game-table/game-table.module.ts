import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import PrimengModule from 'src/app/primeng.module';
import { MathPipe } from 'src/app/core/pipes/math.pipe';
import { ToFixedPipe } from 'projects/shared/src/lib/pipe/to-fixed.pipe';
import { BuyInComponent } from './components/buy-in/buy-in.component';
import { AntiBankingComponent } from './components/anti-banking/anti-banking.component';
import { PostBbComponent } from './components/post-bb/post-bb.component';
import { GameTableComponent } from './game-table.component';
import { InfoComponent } from './components/info/info.component';
import { TopUpComponent } from './components/top-up/top-up.component';
import { WaitListComponent } from './components/wait-list/wait-list.component';
import { LeaderboardContestDialogComponent } from './components/leaderboard-contest-dialog/leaderboard-contest-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: GameTableComponent,
    children: [
      {
        path: '',
        redirectTo: 'game-table',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    GameTableComponent,
    BuyInComponent,
    PostBbComponent,
    AntiBankingComponent,
    InfoComponent,
    TopUpComponent,
    WaitListComponent,
    LeaderboardContestDialogComponent,
    ToFixedPipe,
    MathPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    OverlayPanelModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MathPipe]
})
export class GameTableModule {}
