export interface TransactionHistoryCash {
  id: number;
  userId: number;
  nameOnCard: string;
  amount: number;
  discount: number;
  chipType: string;
  status: string;
  gatewayId: number;
  paymentMode: string;
  bankId: number;
  cardType: string;
  transactionId: string;
  remarks: string;
  orderId: number;
  version: number;
  txnFromSite: string;
  expiredPromoAwardedChips: number;
  bonusCode: string;
  redirectUrl: string;
  refTxnId?: number;
  cardnumber?: string;
  packId: any;
  purchaseToken: any;
  addedOn: string;
  linuxAddedOn: number;
  juspayOrderId: string;
  modifiedOn: string;
  linuxModifiedOn: number;
  ip: string;
  city: string;
  state: string;
  country: string;
  deviceId: any;
  cronStatus: string;
  completeStatus: string;
  type: string;
  classStatus: string;
}

export interface TransactionStatusModel {
  id: number;
  addedOn: string;
  blockReason: string;
  currentStatus: string;
  redeemStatus: string;
  cancelReason: any;
  failedReason: any;
  redeemStatusArr: RedeemStatusArr[];
}

export interface RedeemStatusArr {
  id: number;
  redeemId: number;
  userId: number;
  status: string;
  remarks: string;
  modifiedOn: string;
}
