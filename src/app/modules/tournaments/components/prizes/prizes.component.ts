import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import { prizesTableList, prizesTablesList } from '../../static/static-data';
import { PrizeTable, PrizesTabTable } from '../../models/tournaments.model';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['../../styles/_shared.scss']
})
export class PrizesComponent {
  assetsImagePath = Paths.imagePath;

  prizeTableData: PrizeTable[] = prizesTableList;

  tablesData: PrizesTabTable[] = prizesTablesList;

  equivalentAmountToINR = (amountInNum: number): string =>
    `₹ ${amountInNum.toLocaleString('en-IN', {
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
}
