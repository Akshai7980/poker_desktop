export interface CashierWithdrawRequest {
  amount: number;
  mode: string;
  source: string;
  bankDocId: number;
  tdsAmount: number;
}
