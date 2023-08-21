export interface EarningsInactiveResponse {
  userId: number;
  userName: string;
  fullName: string;
  status: string;
  mobile: string;
  signupTime: string;
  pgpEarned: number;
  depositAmount: number;
  noOfHands: number;
  lastPlayed: string;
  maxHandsLimit: number;
  remind: boolean;
  enrollCampaignId: number;
  currCampaignId: number;
  avatarName: string;
  compaignName: string;
}
