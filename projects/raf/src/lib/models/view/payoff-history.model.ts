import { PayoffHistoryRequest } from '../request/payoff-history.request';

export class PayoffHistoryModel {
  fromDate: string | Date;

  toDate: string;

  clear() {
    this.fromDate = '';
    this.toDate = '';
  }

  getRequestModel(): PayoffHistoryRequest {
    const payOffHistory: PayoffHistoryRequest = {
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    return payOffHistory;
  }
}
