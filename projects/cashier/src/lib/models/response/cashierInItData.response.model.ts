export interface CashierInitDataResponse {
  cashierInitData: CashierInitData;
}

export interface CashierInitData {
  appInfoFlag: boolean;
  deviceInfoFlag: boolean;
  networkInfoFlag: boolean;
  minRedeemAmt: string;
}
