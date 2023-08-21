import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import PrimengModule from 'src/app/primeng.module';
import { MaterialModule } from 'src/app/material.module';
import { NgxSharedModule } from 'projects/shared/src/public-api';
import { RafComponent } from './raf.component';
import { KnowMoreComponent } from './dialogs/know-more/know-more.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { LeaderBoardComponent } from './components/leader-board/leader-board.component';
import { EarningSummaryComponent } from './dialogs/earning-summary/earning-summary.component';
import { ReferFriendComponent } from './components/refer-friend/refer-friend.component';
import { ReferralPointsComponent } from './components/referral-points/referral-points.component';
import { ActiveComponent } from './components/earnings/active/active.component';
import { InActiveComponent } from './components/earnings/in-active/in-active.component';
import { DroppedComponent } from './components/earnings/dropped/dropped.component';
import { ViewSummaryComponent } from './dialogs/view-summary/view-summary.component';
import { FiltersComponent } from './dialogs/filters/filters.component';
import { UnclaimedPayoutComponent } from './dialogs/unclaimed-payout/unclaimed-payout.component';
import { CongratulationsComponent } from './dialogs/congratulations/congratulations.component';
import { ReferNowComponent } from './dialogs/refer-now/refer-now.component';
import { OtherPrizesComponent } from './dialogs/other-prizes/other-prizes.component';

const routes: Routes = [
  {
    path: '',
    component: RafComponent,
    children: [
      { path: '', redirectTo: 'refer-friend', pathMatch: 'full' },
      { path: 'refer-friend', component: ReferFriendComponent, pathMatch: 'full' },
      {
        path: 'referral-points',
        component: ReferralPointsComponent,
        children: [
          { path: '', redirectTo: 'earnings', pathMatch: 'full' },
          { path: 'earnings', component: EarningsComponent, pathMatch: 'full' },
          { path: 'leader-board', component: LeaderBoardComponent, pathMatch: 'full' }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    RafComponent,
    KnowMoreComponent,
    EarningsComponent,
    LeaderBoardComponent,
    EarningSummaryComponent,
    ReferFriendComponent,
    KnowMoreComponent,
    ReferralPointsComponent,
    ActiveComponent,
    InActiveComponent,
    DroppedComponent,
    ViewSummaryComponent,
    FiltersComponent,
    UnclaimedPayoutComponent,
    CongratulationsComponent,
    ReferNowComponent,
    OtherPrizesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    MaterialModule,
    NgxSharedModule
  ],
  exports: [RafComponent]
})
export class NgxRafModule {}
