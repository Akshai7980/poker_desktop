import { Component, HostBinding, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseResponse, MessageConstant, Paths } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';
import { PayoutStatement } from '../../models/models';
import { payoutStatementData } from '../../static/data';
import { RAFService } from '../../services/raf.service';
import { RAF, RAF_CONSTANTS } from '../../constants/app-constants';
import { PayoffHistoryModel } from '../../models/view/payoff-history.model';
import {
  CreditedToWallet,
  DateWiseHistory,
  LifetimeEarnings,
  PayoffHistoryResponse
} from '../../models/response/payoff-history.response';
import { UnclaimedPayoutResponse } from '../../models/response/unclaimed-payout.response';

@Component({
  selector: 'app-view-summary',
  templateUrl: './view-summary.component.html',
  styleUrls: ['./view-summary.component.scss']
})
export class ViewSummaryComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100';

  assetsImagePath = Paths.imagePath;

  isDualScreen: boolean = false;

  activeDualScreenComponent: string;

  payoutStatementData: PayoutStatement[] = payoutStatementData;

  payoffHistory: PayoffHistoryResponse;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  @Output() creditedToWallet: CreditedToWallet = {} as CreditedToWallet;

  lifetimeEarnings: LifetimeEarnings = {} as LifetimeEarnings;

  dateWiseHistory: DateWiseHistory[];

  unclaimedPayout: number;

  fromDateFilter: string | Date;

  toDateFilter: string;

  valueFilter: string = 'Last 3 Months';

  @Output() unclaimedList: UnclaimedPayoutResponse[] = [];

  constructor(
    private rafService: RAFService,
    private readonly dialogRef: MatDialogRef<ViewSummaryComponent>
  ) {}

  ngOnInit(): void {
    this.toDateFilter = moment().format('YYYY-MM-DD');
    this.fromDateFilter = moment().subtract(30, 'days').format('YYYY-MM-DD');
    this.getPayoffHistory();
    this.getUnclaimedPayout();
  }

  toggleFilterScreen(val: string) {
    this.isDualScreen = !this.isDualScreen;
    if (this.isDualScreen) {
      this.activeDualScreenComponent = val;
    }
  }

  onClickClaimPayout(val: string) {
    this.isDualScreen = true;
    this.activeDualScreenComponent = val;
  }

  openOtherPrizes(val: string) {
    this.isDualScreen = true;
    this.activeDualScreenComponent = val;
  }

  openEarningSummary(val: string) {
    this.isDualScreen = true;
    this.activeDualScreenComponent = val;
  }

  getPayoffHistory() {
    const register = new PayoffHistoryModel();
    register.clear();
    register.fromDate = this.fromDateFilter;
    register.toDate = this.toDateFilter;
    const registerData$ = this.rafService.getPayoffHistory(register);
    const registerData: Subscription = registerData$.subscribe({
      next: (res: BaseResponse<PayoffHistoryResponse>) => {
        if (res.code === RAF.SUCCESS) {
          this.payoffHistory = res.data;
          this.creditedToWallet = this.payoffHistory.creditedToWallet;
          this.lifetimeEarnings = this.payoffHistory.lifetimeEarnings;
          this.dateWiseHistory = this.payoffHistory.dateWiseHistory;
          this.unclaimedPayout = this.payoffHistory.unclaimedPayout;
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(registerData);
  }

  getUnclaimedPayout() {
    const getEarningPoints$ = this.rafService.getUnclaimedPayout();
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<UnclaimedPayoutResponse[]>) => {
        if (res.code === RAF.SUCCESS) {
          this.unclaimedList = res.data;
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getEarningPoints);
  }

  fromDate(fromDate: string | Date) {
    this.fromDateFilter = fromDate;
  }

  toDate(toDate: string) {
    this.toDateFilter = toDate;
  }

  dualScreen(val: boolean) {
    this.isDualScreen = val;
  }

  value(val: string) {
    if (val) {
      this.valueFilter = val;
      this.getPayoffHistory();
    }
  }

  onClose(): void {
    this.rafService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
