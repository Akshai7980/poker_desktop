import { CashierWithdrawRequest } from '../request/cashier-withdraw.request.model';

export class CashierWithdrawModel {
  amount: number;

  mode: string;

  source: string;

  bankDocId: number;

  tdsAmount: number;

  clear() {
    this.amount = 0;
    this.mode = '';
    this.source = '';
    this.bankDocId = 0;
    this.tdsAmount = 0;
  }

  getRequestModel(): CashierWithdrawRequest {
    const cashierWithdraw: CashierWithdrawRequest = {
      amount: this.amount,
      mode: this.mode,
      source: this.source,
      bankDocId: this.bankDocId,
      tdsAmount: this.tdsAmount
    };

    return cashierWithdraw;
  }
}
