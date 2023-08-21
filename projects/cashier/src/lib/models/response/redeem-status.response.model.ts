export interface RedeemStatusResponse {
  id: number;
  addedOn: string;
  currentStatus: string;
  redeemStatus: string;
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
