import {
  BlindStructure,
  EntryTable,
  PrizeStructure,
  PrizeTable,
  PrizesTabTable,
  RankTable,
  Tab,
  Tournaments,
  TournamentsStatus
} from '../models/tournaments.model';

export const tournamentTab: Tab[] = [
  { title: 'Registration', path: 'registration' },
  { title: 'Prizes', path: 'prizes' },
  { title: 'Rules', path: 'rules' },
  { title: 'Prize Structure', path: 'prize-structure' },
  { title: 'Blind Structure', path: 'blind-structure' },
  { title: 'Rebuy Info', path: 'rebuy-info' },
  { title: 'Bounty Info', path: 'bounty-info' },
  { title: 'Target Tourney', path: 'target-tourney' }
];

export const prizeTableList: PrizeTable[] = [
  { rank: 1, prize: 45054 },
  { rank: 2, prize: 20054 },
  { rank: 3, prize: 15050 },
  { rank: 4, prize: 10054 },
  { rank: 5, prize: 5054 },
  { rank: 6, prize: 2054 },
  { rank: 7, prize: 1554 },
  { rank: 8, prize: 1054 }
];

export const prizesTableList: PrizeTable[] = [
  { rank: 1, prize: 45054, bonus: 'IB 2000', tickets: 2 },
  { rank: 2, prize: 20054, bonus: 'IB 1,800' },
  { rank: 3, prize: 15050, bonus: 'IB 150' },
  { rank: 4, prize: 10054 },
  { rank: 5, prize: 5054 },
  { rank: 6, prize: 2054 },
  { rank: 7, prize: 1554 },
  { rank: 8, prize: 1054 }
];
export const entryTableList: EntryTable[] = [
  { serialNumber: 1, players: 'coastlineoutmost', chips: 2000 },
  { serialNumber: 2, players: 'sticksmeat', chips: 1900 },
  { serialNumber: 3, players: 'sycamorevanquished', chips: 1900 },
  { serialNumber: 4, players: 'minlunch', chips: 1900 },
  { serialNumber: 5, players: 'stagnanttrolley', chips: 1900 },
  { serialNumber: 6, players: 'rashvigilante', chips: 1900 },
  { serialNumber: 7, players: 'districtunguided', chips: 1900 },
  { serialNumber: 8, players: 'overtonecallisto', chips: 1900 },
  { serialNumber: 9, players: 'excretorysupplier', chips: 1900 },
  { serialNumber: 10, players: 'hazardfaceplate', chips: 1900 }
];
export const rankTableList: RankTable[] = [
  {
    rank: 1,
    players: 'coastlineoutmost',
    chips: 15000,
    bounty: 2889,
    playersCount: 1,
    bountyCount: 2
  },
  { rank: 2, players: 'sticksmeat', chips: 26000, bounty: 20054, bountyCount: 15 },
  { rank: 3, players: 'sycamorevanquished', chips: 22054, bounty: 15000, bountyCount: 14 },
  { rank: 4, players: 'minlunch', chips: 19000, bounty: 15000, bountyCount: 12 },
  { rank: 5, players: 'stagnanttrolley', chips: 18900, bounty: 15000, bountyCount: 14 },
  {
    rank: 6,
    players: 'rashvigilante',
    chips: 18500,
    bounty: 15000,
    playersCount: 2,
    bountyCount: 12
  },
  { rank: 7, players: 'districtunguided', chips: 18500, bounty: 15000, bountyCount: 4 },
  { rank: 8, players: 'overtonecallisto', chips: 0, bounty: 15000, bountyCount: 4 },
  { rank: 9, players: 'excretorysupplier', chips: 0, bounty: 15000, bountyCount: 4 }
];
export const TournamentsData: Tournaments[] = [
  { data: [], status: TournamentsStatus.REGISTRATION_STARTING_IN },
  { data: [], status: TournamentsStatus.REGISTERING },
  { data: [], status: TournamentsStatus.LATE_REGISTRATION },
  { data: [], status: TournamentsStatus.RUNNING },
  { data: [], status: TournamentsStatus.JOINED_FINISHED },
  { data: [], status: TournamentsStatus.CANCELLED },
  { data: [], status: TournamentsStatus.REGISTERING_SATELLITE }
];

export const prizesTablesList: PrizesTabTable[] = [
  { tableId: 1557, players: 8, minChips: 60543, maxChips: 15090 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 },
  { tableId: 1784, players: 7, minChips: 8490, maxChips: 19450 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 },
  { tableId: 5626, players: 8, minChips: 26699, maxChips: 17742 }
];
export const blindStructureList: BlindStructure[] = [
  { level: 1, smallBind: 10, bigBlind: 20, ante: 0 },
  { level: 2, smallBind: 20, bigBlind: 40, ante: 0 },
  { level: 3, smallBind: 30, bigBlind: 60, ante: 0 },
  { level: 4, smallBind: 40, bigBlind: 80, ante: 0 },
  { level: 4, smallBind: 40, bigBlind: 80, ante: 0 },
  { level: 4, smallBind: 40, bigBlind: 80, ante: 0 },
  { level: 4, smallBind: 40, bigBlind: 80, ante: 0 },
  { level: 4, smallBind: 40, bigBlind: 80, ante: 0 },
  { level: 4, smallBind: 40, bigBlind: 80, ante: 0 }
];
export const prizeStructureList: PrizeStructure[] = [
  { registeredPlayers: 1, range1: 100, range2: 65, range3: 50.97, range4: 47.91, range5: 34.91 },
  { registeredPlayers: 2, range2: 65, range3: 50.97, range4: 47.91, range5: 34.91 },
  { registeredPlayers: 3, range3: 50.97, range4: 47.91, range5: 34.91 },
  { registeredPlayers: 4, range4: 47.91, range5: 34.91 },
  { registeredPlayers: 5, range5: 34.91 },
  { registeredPlayers: 5 },
  { registeredPlayers: 6 },
  { registeredPlayers: 7 },
  { registeredPlayers: 8 },
  { registeredPlayers: 9 },
  { registeredPlayers: 10 },
  { registeredPlayers: '11-25' },
  { registeredPlayers: '26-40' }
];
