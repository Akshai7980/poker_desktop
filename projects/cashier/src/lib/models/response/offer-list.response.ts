export interface OfferListResponse {
  bonusCodesForYou: BonusCodesForYou[];
  bonusCodesForAll: any[];
  amountOption: number[];
}

export interface BonusCodesForYou {
  msg: string;
  bonusCode: string;
  offerText: string;
  minAmount: number;
  visibleBuyChips: number;
  promotion_text: string;
}
