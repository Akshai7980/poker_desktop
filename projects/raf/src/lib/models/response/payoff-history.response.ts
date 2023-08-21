export interface PayoffHistoryResponse {
  creditedToWallet: CreditedToWallet;
  lifetimeEarnings: LifetimeEarnings;
  userId: number;
  dateWiseHistory: DateWiseHistory[];
  unclaimedPayout: number;
}

export interface CreditedToWallet {
  ib: number;
  real: number;
  crown: number;
  ticket: number;
  others: string[];
  bb: number;
  tb: number;
}

export interface LifetimeEarnings {
  ib: number;
  bb: number;
  tb: number;
  crown: number;
  voucher: number;
  ticket: number;
  real: number;
}

export interface DateWiseHistory {
  date: string;
  chipTypeAmount: ChipTypeAmount[];
}

export interface ChipTypeAmount {
  id: number;
  chiptype: string;
  amount: number;
}
