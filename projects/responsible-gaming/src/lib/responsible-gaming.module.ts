import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { CashComponent } from './components/cash/cash.component';
import { DepositLimitComponent } from './components/deposit-limit/deposit-limit.component';
import { OtpInputComponent } from './components/otp-input/otp-input.component';
import { SelfExclusionComponent } from './components/self-exclusion/self-exclusion.component';
import { SitNGoComponent } from './components/sit-n-go/sit-n-go.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { BuyInLimitComponent } from './dialogs/buy-in-limit/buy-in-limit.component';
import { DailyLimitComponent } from './dialogs/daily-limit/daily-limit.component';
import { PerTransactionLimitComponent } from './dialogs/per-transaction-limit/per-transaction-limit.component';
import { RestrictTableLimitComponent } from './dialogs/restrict-table-limit/restrict-table-limit.component';
import { SelfExclusionFromPlayingComponent } from './dialogs/self-exclusion-from-playing/self-exclusion-from-playing.component';
import { WeeklyLimitComponent } from './dialogs/weekly-limit/weekly-limit.component';
import { MaterialModule } from './material.module';
import PrimengModule from './primeng.module';
import { ResponsibleGamingComponent } from './responsible-gaming.component';
import { AutocompleteOffDirective } from './directives/autocomplete-off.directive';
import { NumberDirective } from './directives/numbers-only.directive';

const routes: Routes = [
  {
    path: '',
    component: ResponsibleGamingComponent,
    children: [
      { path: '', redirectTo: 'cash', pathMatch: 'full' },
      { path: 'cash', component: CashComponent, pathMatch: 'full' },
      { path: 'tournament', component: TournamentComponent, pathMatch: 'full' },
      { path: 'sit-n-go', component: SitNGoComponent, pathMatch: 'full' },
      { path: 'self-exclusion', component: SelfExclusionComponent, pathMatch: 'full' },
      { path: 'deposit-limit', component: DepositLimitComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    ResponsibleGamingComponent,
    CashComponent,
    TournamentComponent,
    SitNGoComponent,
    RestrictTableLimitComponent,
    OtpInputComponent,
    BuyInLimitComponent,
    SelfExclusionComponent,
    SelfExclusionFromPlayingComponent,
    DepositLimitComponent,
    PerTransactionLimitComponent,
    DailyLimitComponent,
    WeeklyLimitComponent,
    AutocompleteOffDirective,
    NumberDirective
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
  exports: [ResponsibleGamingComponent, OtpInputComponent]
})
export class NgxResponsibleGamingModule {}
