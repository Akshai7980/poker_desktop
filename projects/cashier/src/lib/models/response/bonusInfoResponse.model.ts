export interface BonusInfoResponse {
  bonusInfoData: BonusInfoData;
}

export interface BonusInfoData {
  pageData: {
    HoldAmountInfo: string[];
    boosterBonusInfo: string[];
    freerollInfo: string[];
    ibInfo: string[];
    investmentConsideredCallout: string;
    isTBVisible: string;
    isVipPartialEnable: string;
    nonTaxedWinningsCallout: string;
    pokerWalletInfo: string[];
    realToVip: string[];
    tbInfo: string[];
    tdsInfo: string[];
    tdsLiabilitiesCallout: string;
    vipChipsInfo: string[];
    vipToReal: string[];
  };
}
