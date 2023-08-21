import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSharedModule } from 'projects/shared/src/public-api';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { CashierComponent } from './cashier.component';
import { BonusComponent } from './components/bonus/bonus.component';
import { BonusesComponent } from './components/bonuses/bonuses.component';
import { CashComponent } from './components/cash/cash.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { CongratulationsDialogComponent } from './components/congratulations-dialog/congratulations-dialog.component';
import { HelpComponent } from './components/help/help.component';
import { KycPendingComponent } from './components/kyc-pending/kyc-pending.component';
import { MyTicketsAndOffersComponent } from './components/my-tickets-and-offers/my-tickets-and-offers.component';
import { RedeemVoutcherOrScratchCardComponent } from './components/redeem-voutcher-or-scratch-card/redeem-voutcher-or-scratch-card.component';
import { ReleaseUnitsPgpsComponent } from './components/release-units-pgps/release-units-pgps.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { TransactionFilterComponent } from './components/transaction-filter/transaction-filter.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { WithdrawalMethodsComponent } from './components/withdrawal-methods/withdrawal-methods.component';
import { WithheldDepositComponent } from './components/withheld-deposit/withheld-deposit.component';
import { AutocompleteOffDirective } from './directives/autocomplete-off.directive';
import { MaterialModule } from './material.module';
import PrimengModule from './primeng.module';
import { ShareModule } from './share/share.module';
import { KnowMoreComponent } from './components/know-more/know-more.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    CashierComponent,
    TransactionHistoryComponent,
    CashComponent,
    TransactionDetailsComponent,
    TransactionFilterComponent,
    TimelineComponent,
    ConfirmationDialogComponent,
    BonusComponent,
    TermsAndConditionsComponent,
    MyTicketsAndOffersComponent,
    RedeemVoutcherOrScratchCardComponent,
    ReleaseUnitsPgpsComponent,
    BonusesComponent,
    CongratulationsDialogComponent,
    HelpComponent,
    WithdrawComponent,
    KycPendingComponent,
    WithdrawalMethodsComponent,
    WithheldDepositComponent,
    AutocompleteOffDirective,
    KnowMoreComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    NgxSharedModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  exports: [CashierComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class NgxCashierModule {}
