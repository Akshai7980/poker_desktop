export interface RedeemScratchCardResponse {
  bonusAmount: number;
  bonusCode: string;
  bonusId: number;
  bonusTxnId: number;
  chipType: string;
  payoffBonus: number;
  pokerBalance: number;
  promoscheme: string;
  tktData: {
    count: number;
    ticketName: string;
  }[];
  txnDate: string;
  userName: string;
}
