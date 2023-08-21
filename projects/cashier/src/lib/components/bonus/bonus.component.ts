import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';

import { BaseResponse, MessageConstant, ToastModel } from 'projects/shared/src/public-api';
import { Paths } from '../../constants/app-constants';
import { DualScreenModeModel } from '../../models/common/output-parameter-model';
import { CashierService } from '../../services/cashier.service';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class BonusComponent implements OnChanges, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1';

  isShowToast: boolean = false;

  toastValue: ToastModel;

  bonusData: any;

  @Input() filter: string;

  subscriptions: Subscription[] = [];

  assetsImagePath = Paths.imagePath;

  @Output() dualScreenMode: EventEmitter<DualScreenModeModel> =
    new EventEmitter<DualScreenModeModel>();

  constructor(public cashierService: CashierService) {
    const bonusData = this.cashierService
      .bonusHistoryData(this.filter)
      .subscribe((resp: BaseResponse<any>) => {
        this.bonusData = resp.data.data;
      });
    this.subscriptions.push(bonusData);
  }

  openFilter() {
    this.dualScreenMode.emit({ component: TransactionFilterComponent, data: 'filter' });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.filter = changes['filter'].currentValue;
      const bonusHistoryData$ = this.cashierService.bonusHistoryData(this.filter);
      const bonusHistoryData: Subscription = bonusHistoryData$.subscribe({
        next: (resp: BaseResponse<any>) => {
          this.bonusData = resp.data.data;
        },
        error: () => {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      });
      this.subscriptions.push(bonusHistoryData);
    }
  }

  downloadCSV() {
    this.cashierService.downloadBonusCSV(this.filter);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
