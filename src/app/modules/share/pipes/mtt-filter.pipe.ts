import { Pipe, PipeTransform } from '@angular/core';
import { KeyValuePair, TableTournament } from 'projects/shared/src/lib/models/common/lobby.model';
import { FilterConstant, LobbyMtt, LobbyService } from 'projects/shared/src/public-api';

@Pipe({
  name: 'mttFilter'
})
export class MttFilterPipe implements PipeTransform {
  constructor(private lobbyService: LobbyService) {}

  transform(
    tables: TableTournament[],
    status: string,
    sortOptions: any,
    filters: any
  ): TableTournament[] | undefined {
    let newTables: TableTournament[] = [];
    const statuses = status.split('|');
    if (tables && tables.length > 0) {
      tables.forEach((val: TableTournament) => {
        const element = val;
        if (val.prizeArr && val.prizeArr.length === 1) {
          element.tempPrize = Number(val.prize);
        } else if (val.prizeArr && val.prizeArr.length > 1) {
          element.tempPrize = Number(val.prizeArr[0].amount);
        } else if (!val.prizeArr || !element.tempPrize) {
          element.tempPrize = 0;
        }
        if (val.buyIn && val.buyIn.length > 0) {
          element.tempBuyIn = Number(val.buyIn[0].entry_amount);
        } else if (!val.buyIn) {
          element.tempBuyIn = 0;
        }
        if (statuses.length > 1) {
          if (
            val.status.toLowerCase() === statuses[0].trim() ||
            val.status.toLowerCase() === statuses[1].trim() ||
            val.status.toLowerCase() === statuses[2].trim()
          ) {
            newTables.push(val);
          }
        } else if (val.status.toLowerCase() === statuses[0].trim()) {
          newTables.push(val);
        }
      });
    }

    newTables = newTables.sort((a: any, b: any) => {
      const c = a;
      const d = b;
      c[sortOptions.key] = c[sortOptions.key] ?? '';
      d[sortOptions.key] = d[sortOptions.key] ?? '';
      if (
        sortOptions.key === LobbyMtt.USER_COUNT ||
        sortOptions.key === LobbyMtt.PRIZE_ARR ||
        sortOptions.key === LobbyMtt.BUY_IN
      ) {
        let { key } = sortOptions;
        if (sortOptions.key === LobbyMtt.PRIZE_ARR) {
          key = LobbyMtt.TEMP_PRIZE;
        } else if (sortOptions.key === LobbyMtt.BUY_IN) {
          key = LobbyMtt.TEMP_BUY_IN;
        }
        if (sortOptions.sortOrder === 'asc') {
          return Number(c[key]) - Number(d[key]);
        }
        return Number(d[key]) - Number(c[key]);
      }
      if (sortOptions.sortOrder === 'asc') {
        if (sortOptions.key === LobbyMtt.START_DATE) {
          const data1: any = new Date(c[sortOptions.key]);
          const data2: any = new Date(d[sortOptions.key]);
          return data1 - data2;
        }
        return c[sortOptions.key].toString().localeCompare(d[sortOptions.key].toString());
      }
      if (sortOptions.sortOrder === 'desc') {
        if (sortOptions.key === LobbyMtt.START_DATE) {
          const data1: any = new Date(c[sortOptions.key]);
          const data2: any = new Date(d[sortOptions.key]);
          return data2 - data1;
        }
        return d[sortOptions.key].toString().localeCompare(c[sortOptions.key].toString());
      }
      return false;
    });

    const tempTables: TableTournament[] = [];

    newTables.forEach((element: any) => {
      let check: number = 0;

      filters.selectedGameType.forEach((val: KeyValuePair) => {
        if (element.ringVariant === val.key) {
          check += 1;
        }
      });

      filters.selectedStatus.forEach((val: KeyValuePair) => {
        if (element.status.toLowerCase() === val.key.toLowerCase()) {
          check += 1;
        }
      });

      filters.selectedBuyInTournament.forEach((val: KeyValuePair) => {
        if (val.key === LobbyMtt.HUNDRED && Number(element.tempBuyIn) <= 100) {
          check += 1;
        } else if (
          val.key === LobbyMtt.HUNDRED_AND_ONE_TO_FIVE_HUNDRED &&
          Number(element.tempBuyIn) > 100 &&
          Number(element.tempBuyIn) <= 500
        ) {
          check += 1;
        } else if (
          val.key === LobbyMtt.FIVE_HUNDRED_AND_ONE_TO_THOUSAND &&
          Number(element.tempBuyIn) > 500 &&
          Number(element.tempBuyIn) <= 1000
        ) {
          check += 1;
        } else if (
          val.key === LobbyMtt.THOUSAND_AND_ONE_TO_FIVE_THOUSAND &&
          Number(element.tempBuyIn) > 1000 &&
          Number(element.tempBuyIn) <= 5000
        ) {
          check += 1;
        } else if (val.key === LobbyMtt.FIVE_THOUSAND && Number(element.tempBuyIn) >= 5000) {
          check += 1;
        } else if (
          val.key === FilterConstant.ticket &&
          element.buyIn &&
          element.buyIn.length > 0 &&
          element.buyIn[0].entry_chip_type.toLowerCase() === FilterConstant.ticket.toLowerCase()
        ) {
          check += 1;
        } else if (
          val.key === FilterConstant.freeroll &&
          element.buyIn &&
          element.buyIn.length > 0 &&
          element.buyIn[0].entry_chip_type.toLowerCase() === FilterConstant.freeroll.toLowerCase()
        ) {
          check += 1;
        }
      });

      filters.selectedFormat.forEach((val: KeyValuePair) => {
        if (element[val.name] === FilterConstant.freeroll.toLowerCase()) {
          if (
            element.isRentry !== 'true' ||
            element.isRebuy !== 'true' ||
            element.addOnAllowed !== 'true'
          ) {
            check += 1;
          }
        } else if (element[val.name] === 'true') {
          check += 1;
        }
      });

      let limit: number = 0;
      if (filters.selectedGameType.length > 0) {
        limit += 1;
      }
      if (filters.selectedStatus.length > 0) {
        limit += 1;
      }
      if (filters.selectedBuyInTournament.length > 0) {
        limit += 1;
      }
      if (filters.selectedFormat.length > 0) {
        limit += 1;
      }

      if (check === limit) {
        tempTables.push(element);
      }
    });

    if (
      filters.selectedGameType.length > 0 ||
      filters.selectedStatus.length > 0 ||
      filters.selectedBuyInTournament.length > 0 ||
      filters.selectedFormat.length > 0
    ) {
      this.lobbyService.isTournamentFilterSelected.next(true);
    } else {
      this.lobbyService.isTournamentFilterSelected.next(false);
    }

    this.lobbyService.tournamentMttListount += tempTables.length;

    return tempTables;
  }
}
