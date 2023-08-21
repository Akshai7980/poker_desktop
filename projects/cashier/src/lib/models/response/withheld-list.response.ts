export interface WithheldListResponse {
  list: List[];
}

export interface List {
  amount: number;
  release_unit: number;
  withdrawableAmount: number;
  txn_date: number;
  is_settled: number;
  exp_date: string;
  Id: number;
  userId: number;
  crDr: string;
  remarks: string;
  transactionId: string;
  configId: string;
  remaningHoldAmount: number;
  UnitReleaseUnit: number;
  releaseUnit: number;
  transactionType: string;
  txnDate: string;
  wagerAmount: number;
  balBefore: number;
  balAfter: number;
  isSettled: number;
  expDate: string;
  bonusCode: string;
  requiredRu: number;
}
