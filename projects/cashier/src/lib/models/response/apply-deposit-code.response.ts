export interface ApplyDepositCodeResponse {
  bonusCodeInfo: BonusCodeInfo;
  benefits: Benefits;
  validTicketList: any;
}

export interface BonusCodeInfo {
  releaseUnit: number;
  timeBoundRedemption: number;
  redemptionExpiryTime: string;
  expiredAfter: number;
  releaseUnitType: string;
}

export interface Benefits {
  promo: number;
}
