export interface UnclaimedPayoutResponse {
  pgpEarned: number;
  campaignName: string;
  campaignId: number;
  minPgp: number;
  needPgp: number;
  criteriaPgp: number;
  criteriaAmt: number;
  criteriaType: string;
  earningAmt: number;
  earningType: string;
  claimAllow: boolean;
}
