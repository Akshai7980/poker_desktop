export interface Tab {
  title: string;
  path: string;
}
export interface PrizeTable {
  rank: number;
  prize: number;
  bonus?: string;
  tickets?: number;
}
export interface EntryTable {
  serialNumber: number;
  players: string;
  chips: number;
}
export enum TournamentsStatus {
  REGISTRATION_STARTING_IN = 'REGISTRATION_STARTING_IN',
  REGISTERING = 'REGISTERING',
  REGISTERING_SATELLITE = 'REGISTERING_SATELLITE',
  LATE_REGISTRATION = 'LATE_REGISTRATION',
  RUNNING = 'RUNNING',
  CANCELLED = 'CANCELLED',
  JOINED_FINISHED = 'JOINED_FINISHED'
}
export interface Tournaments {
  data: object;
  status: TournamentsStatus;
}
export interface RankTable {
  rank: number;
  players: string;
  chips: number;
  bounty: number;
  playersCount?: number;
  bountyCount?: number;
}
export interface TournamentsDialogData {
  from: string;
  component: string;
}
export interface PrizesTabTable {
  tableId: number;
  players: number;
  minChips: number;
  maxChips: number;
}
export interface BlindStructure {
  level: number;
  smallBind: number;
  bigBlind: number;
  ante: number;
}
export interface PrizeStructure {
  registeredPlayers: number | string;
  range1?: number;
  range2?: number;
  range3?: number;
  range4?: number;
  range5?: number;
  range6?: number;
}
