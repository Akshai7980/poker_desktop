export interface PreTransactionCheckResponse {
  minAmt: number;
  maxAmt: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  isMobileVerified: number;
  isEmailVerified: number;
  amount: number;
  bonusCode: string;
  status: boolean;
  intentFlow: boolean;
  ftd: boolean;
  responsibleGaming: ResponsibleGaming;
}

export interface ResponsibleGaming {
  isExcluded: boolean;
  dailyCount: number;
  dailyAmt: number;
  weeklyCount: number;
  weeklyAmt: number;
  pertxnAmt: number;
  msg: string;
  expirationEnds: number;
}
