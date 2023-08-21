import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import {
  EntryTable,
  PrizeTable,
  RankTable,
  Tournaments,
  TournamentsStatus
} from '../../models/tournaments.model';
import {
  TournamentsData,
  entryTableList,
  prizeTableList,
  rankTableList
} from '../../static/static-data';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  assetsImagePath = Paths.imagePath;

  prizeTableData: PrizeTable[] = prizeTableList;

  entryTableData: EntryTable[] = entryTableList;

  rankTableData: RankTable[] = rankTableList;

  TOURNAMENTS_STATUS: typeof TournamentsStatus = TournamentsStatus;

  tournamentsData: Tournaments[] = TournamentsData;

  equivalentAmountToINR = (amountInNum: number): string =>
    `₹ ${amountInNum.toLocaleString('en-IN', {
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
}
