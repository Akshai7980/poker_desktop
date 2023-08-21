import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { HandHistoryRoutingModule } from './hand-history-routing.module';
import { HandHistoryComponent } from './hand-history.component';
import { CashGamesComponent } from './components/cash-games/cash-games.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { SngComponent } from './components/sng/sng.component';
import { ShareModule } from '../share/share.module';

@NgModule({
  declarations: [HandHistoryComponent, CashGamesComponent, TournamentsComponent, SngComponent],
  imports: [
    CommonModule,
    HandHistoryRoutingModule,
    PrimengModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ShareModule,
    NgxSharedModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class HandHistoryModule {}
