import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCashierModule } from 'projects/cashier/src/public-api';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CashierComponent } from './cashier.component';

@NgModule({
  declarations: [CashierComponent],
  imports: [CommonModule, NgxCashierModule],
  exports: [CashierComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CashierModule {}
