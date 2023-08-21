import {
  AllTables,
  SngGamesDataResponse
} from 'projects/shared/src/lib/models/response/sng-game-data.response.model';
import {
  BlindStructureResponse,
  SngTableDetailsResponse,
  SngWinnerDataResponse
} from 'projects/shared/src/public-api';

export class SngListViewModel {
  joinedSNGTable: Array<SngList>;

  joinTicketSNGTable: Array<SngList>;

  runningOrFinishedSNGTable: Array<SngList>;

  registering: Array<SngList>;

  isUserLoggedIn: boolean = true;

  nameAscend: boolean = true;

  joinedPlayersAscend: boolean = true;

  prizesAscend: boolean = true;

  feeAscend: boolean = true;

  constructor(
    joinedSNGTable: Array<SngList> = [],
    joinTicketSNGTable: Array<SngList> = [],
    runningOrFinishedSNGTable: Array<SngList> = [],
    registering: Array<SngList> = []
  ) {
    this.joinTicketSNGTable = joinTicketSNGTable;
    this.joinedSNGTable = joinedSNGTable;
    this.runningOrFinishedSNGTable = runningOrFinishedSNGTable;
    this.registering = registering;
  }

  convertToViewModel(response: SngGamesDataResponse) {
    response.allTables.forEach((element: AllTables) => {
      const joinWithTicketGame = response.joinWithTickets.find((item) => item === element.tableId);

      const sngPlay: SngList = {
        name: element.name,
        minBuyIn: element.buyInArr[0].fee ? element.buyInArr[0].fee : 0,
        joinedPlayers: element.userCount,
        totalPlayers: element.maxPlayers,
        prizes: element.prize[0].amount,
        status: element.status.toLowerCase(),
        BettingRule: '',
        Blinds: '',
        Fee: '',
        Gametype: '',
        Id: element.tableId.toString(),
        maxPlayers: element.maxPlayers.toString(),
        Prize: '',
        PrizeType: '',
        Remarks: element.name,
        RingVariant: element.ringVariant,
        bTypeId: '',
        btime: '',
        buyInArr: element.buyInArr,
        amount: element.buyInArr[0].amount ? element.buyInArr[0].amount : 0,
        chipType: element.buyInArr[0].chipType,
        fee:
          element.buyInArr[0].fee && element.buyInArr[0].amount
            ? element.buyInArr[0].fee + element.buyInArr[0].amount
            : 0,
        buyInText: '',
        buyinAndFees: '',
        isVipMtt: '',
        isZoom: '',
        rv: ''
      };

      switch (sngPlay.status) {
        case 'registered':
        case 'playing':
          if (!joinWithTicketGame) this.joinedSNGTable.push(sngPlay);
          else this.joinTicketSNGTable.push(sngPlay);
          break;
        case 'registering':
          if (!joinWithTicketGame) this.registering.push(sngPlay);
          else this.joinTicketSNGTable.push(sngPlay);
          break;
        case 'running':
        case 'finished':
          if (!joinWithTicketGame) this.runningOrFinishedSNGTable.push(sngPlay);
          else this.joinTicketSNGTable.push(sngPlay);
          break;
        default:
          break;
      }
    });
  }

  getDefaultTable() {
    if (this.joinTicketSNGTable.length > 0) return this.joinTicketSNGTable[0];
    if (this.joinedSNGTable.length > 0) return this.joinedSNGTable[0];
    if (this.runningOrFinishedSNGTable.length > 0) return this.runningOrFinishedSNGTable[0];
    if (this.registering.length > 0) return this.registering[0];
    return undefined;
  }
}

export interface SngList {
  name: string;

  minBuyIn: number;

  joinedPlayers: number;

  totalPlayers: number;

  prizes: number;

  status: string;

  BettingRule: string;

  Blinds: string;

  Fee: string;

  Gametype: string;

  Id: string;

  maxPlayers: string;

  Prize: string;

  PrizeType: string;

  Remarks: string;

  RingVariant: string;

  bTypeId: string;

  btime: string;

  buyInArr: Array<BuyInArray>;

  amount: number;

  chipType: string;

  fee: number;

  buyInText: string;

  buyinAndFees: string;

  isVipMtt: string;

  isZoom: string;

  rv: string;

  hasTicket?: boolean;

  userBalance?: number;
}

export interface BuyInArray {
  chipType: string;
  amount: number;
  fee?: number;
  ticket?: string;
}

export class BlindStructureViewModel {
  blindStructure: Array<Blind>;

  constructor(blindStructure: Array<Blind>) {
    this.blindStructure = blindStructure;
  }

  convertToViewModel(response: BlindStructureResponse) {
    this.blindStructure = [];
    response?.blindStructure.forEach((item) => {
      const blind: Blind = {
        level: item.level,
        smallBlind: item.sb,
        bigBlind: item.bb,
        ante: item.ante
      };
      this.blindStructure.push(blind);
    });
  }
}

export interface Blind {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
}

export class LeaderBoardViewModel {
  boardDetails: Array<BoardDetails>;

  constructor(boardDetails: Array<BoardDetails>) {
    this.boardDetails = boardDetails;
  }

  convertToViewModel(response: SngWinnerDataResponse) {
    response?.winners.forEach((item) => {
      let icon = '';
      if (item.rank === 1) {
        icon = 'first-prize-medal.png';
      } else if (item.rank === 2) {
        icon = 'second-prize-medal.png';
      }
      const prize = item.winningAmount[0]?.winningAmount || 0;
      const board: BoardDetails = {
        rank: item.rank,
        players: item.userName,
        icon,
        prize
      };
      this.boardDetails.push(board);
    });
  }
}

export type BoardDetails = {
  rank: number;
  players: string;
  icon: string;
  prize: number;
};

export class TableInfoViewModel {
  name: string;

  maxPlayers: number;

  userCount: number;

  startingStack: number;

  prizePoolAmount: number;

  prizeBreakUp: Array<Prize>;

  buyInData: BuyIn;

  availableTickets: Array<BuyIn>;

  players: Array<string>;

  blindInterval: number;

  status: string;

  currentBlindLevel: number;

  percentage: number;

  details?: RegisterDetails;

  constructor() {
    this.resetToDefaults();
  }

  resetToDefaults() {
    this.name = '';
    this.maxPlayers = 0;
    this.userCount = 0;
    this.startingStack = 0;
    this.prizePoolAmount = 0;
    this.prizeBreakUp = [];
    this.currentBlindLevel = 0;
    this.buyInData = {
      chipType: '',
      amount: 0,
      fee: 0,
      bounty: 0
    };
    this.availableTickets = [];
    this.players = [];
    this.blindInterval = 0;
    this.status = '';
    this.percentage = 0;
  }

  convertToViewModel(response: SngTableDetailsResponse) {
    this.resetToDefaults();
    if (response) {
      this.name = response.name;
      this.maxPlayers = response.maxPlayers;
      this.userCount = response.userCount;
      this.startingStack = response.startingStack;
      this.prizePoolAmount = response?.prizePool[0]?.amount;

      this.prizeBreakUp = response?.prizeBreakup.map((item) => ({
        rank: item?.rank,
        amount: item?.amount
      }));
      [this.buyInData] = response.buyInArr;
      this.availableTickets = response.buyInArr.filter((item) => item.chipType === 'TICKET');
      this.blindInterval = 0;
      this.currentBlindLevel = response.currentBlindLevel;
      this.status = response.status;
      this.players = response.players;
      this.percentage = (this.userCount / this.maxPlayers) * 100;
    }
  }
}

export interface Prize {
  rank: number;
  amount: number;
}

export interface BuyIn {
  chipType: string;
  amount: number;
  fee?: number;
  bounty?: number;
  ticketName?: string;
}

export interface RegisterDetails {
  userBalance?: number;
  minBuyIn?: number;
  hasTicket?: boolean;
  hasTicketForSNG?: boolean;
}
