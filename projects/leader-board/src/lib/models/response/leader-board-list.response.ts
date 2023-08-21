export interface PrizePool {
  other_giveaways: string;
  prize: number;
  bonus: number;
  crown: number;
  tickets: number;
}

export interface LeaderBoardListResponse {
  leagueId: string;
  leagueType: string;
  displayName: string;
  contestType: string;
  createdAt: string;
  description: string;
  icon: string;
  prizePool: PrizePool;
  status: string;
  isJoined: boolean;
  myRank: number;
  availableOn: string[];
  startDate: Date;
  endDate: Date;
  point: number;
  placesPaid: number;
}
