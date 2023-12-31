export interface TransactionHistoryResponse {
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
  refTxnId: number;
  cardnumber: string;
  packId: string;
  purchaseToken: string;
  addedOn: string;
  linuxAddedOn: number;
  juspayOrderId: string;
  modifiedOn: string;
  linuxModifiedOn: number;
  ip: string;
  city: string;
  state: string;
  country: string;
  deviceId: string;
  cronStatus: string;
  completeStatus: string;
  type: string;
  classStatus: string;
}
