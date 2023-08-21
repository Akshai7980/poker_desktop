export interface RafLeaderboardResponse {
  shortDescription: string;
  readMoreText: string;
  startDate: string;
  endDate: string;
  lastUpdated: string;
  currentLeaderboardId: number;
  currentLeaderboardName: string;
  previousLeaderboardId: number;
  previousLeaderboardName: string;
  leaderboardUsersDTO: LeaderboardUsersDto[];
}

export interface LeaderboardUsersDto {
  _id: string;
  leaderboardId: number;
  userId: number;
  userName: string;
  lastUpdated: string;
  rank: number;
  pgp: number;
  accumulatedPgp: number;
}
