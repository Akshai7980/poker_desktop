export interface EarningTabs {
  title: string;
  dotColor: string;
  chipCount: number;
}
export interface HeaderType {
  title: string;
  isSorting: boolean;
}
export interface ReferralTable {
  icon: string;
  username: string;
  isCampaign: boolean;
  name: string;
  mobile_number: string;
  registered_on: string;
  pgp_earned?: string;
  last_played?: string;
  hands_played?: string;
  total_hands?: string;
  status: string;
  remind?: boolean;
}
export interface PayoutStatement {
  cash?: string;
  bonus?: string;
  bonusType?: string;
  tickets?: string;
  crowns?: string;
  isInfo?: boolean;
  date: string;
}
export interface Languages {
  name: string;
  shortCode: string;
}
export interface LeaderBoardMonthData {
  rank: number;
  username: string;
  points: number;
}
