export interface EarningsPointsResponse {
  totalReffered: number;
  lifeTimeEarning: number;
  active: number;
  inactive: number;
  dropped: number;
  refereeList: RefereeList[];
}

export interface RefereeList {
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
}
