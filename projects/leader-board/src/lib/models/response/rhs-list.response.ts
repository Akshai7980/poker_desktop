export interface PrizePool {
  other_giveaways: string;
  bonus: number;
  crown: number;
  tickets: number;
  prize: number;
}

export class AdditionalInfo {
  leagueId: string;

  displayName: string;

  promoStartDate: string;

  promoEndDate: string;

  knowMoreContent: string;

  shortDescription: string;

  isJoined: boolean;

  status: string;

  lastUpdateDate: string;

  playStartDate: string;

  playEndDate: string;
}

export interface Cgclist {
  leagueType: string;
  contestType: string;
  leagueId: string;
  displayName: string;
  description: string;
  icon: string;
  prizePool: PrizePool;
  status: string;
  placesPaid: number;
  isJoined: boolean;
  myRank: number;
  startDate: Date;
  endDate: Date;
  availableOn: string[];
  point: number;
}

export interface RhsListResponse {
  CGCList: Cgclist[];
  additionalInfo: AdditionalInfo;
}
