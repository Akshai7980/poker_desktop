export interface AdditionalInfos {
  playEndDate: string;
  playStartDate: string;
  promoStartDate: string;
  promoEndDate: string;
  leagueType: string;
  shortDescription: string;
  knowMoreContent: string;
  isJoined: boolean;
  status: string;
  lastUpdateDate: string;
  leagueId: string;
  displayName: string;
}

export interface TotalPrizePool {
  bonus: number;
  prize: number;
  crown: number;
  tickets: number;
  other_giveaways: number;
}

export interface RankData {
  ib: number;
  bb: number;
  tb: number;
  real: number;
  crown: number;
  rank: number;
  tickets: number;
  other_giveaways: number;
}

export interface VariableRankData {
  maxCap: string;
  prizePercent: string;
  rank: number;
}

export interface PrizePool {
  ib: number;
  bb: number;
  tb: number;
  real: number;
  crown: number;
  rank: number;
  tickets: number;
  other_giveaways: number;
}

export interface Player {
  leagueId: string;
  userName: string;
  userId: number;
  points: number;
  rank: number;
  status: string;
  prizePool: PrizePool;
}

export interface Total {
  placesPaid: number;
  totalPrizePool: TotalPrizePool;
}

export interface PriceStructure {
  total: Total;
  rankData: RankData[];
  variableRankData: VariableRankData[];
}

export class RankingListResponse {
  additionalInfo: AdditionalInfos;

  priceStructure: PriceStructure;

  players: Player[];

  leagueHeader: string;

  leagueInfo: string;
}
