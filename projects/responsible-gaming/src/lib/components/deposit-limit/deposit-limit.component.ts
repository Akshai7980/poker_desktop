import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseResponse } from 'projects/shared/src/lib/models/common/base-response.model';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { Subscription, tap } from 'rxjs';
import { MessageConstant } from 'projects/shared/src/public-api';
import { Paths, RESPONSIBLE_GAMING, ResponsibleGameTab } from '../../constants/app-constants';
import { MAT_DIALOG } from '../../constants/dialog.constants';
import { DailyLimitComponent } from '../../dialogs/daily-limit/daily-limit.component';
import { PerTransactionLimitComponent } from '../../dialogs/per-transaction-limit/per-transaction-limit.component';
import { WeeklyLimitComponent } from '../../dialogs/weekly-limit/weekly-limit.component';
import { RhsImages } from '../../models/common/rhs-image.model';
import { UserDepositHistoryResponseModel } from '../../models/response/user-deposit-history.response.model';
import { RestrictTableTabModel } from '../../models/view/restrict-table-tab.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';
import { RestrictTableResponseModel } from '../../models/response/restrict-table.response.model';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { RestrictTableTabResponseModel } from '../../models/response/restrict-table-tab.response.model';

@Component({
  selector: 'app-deposit-limit',
  templateUrl: './deposit-limit.component.html',
  styleUrls: ['./deposit-limit.component.scss']
})
export class DepositLimitComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  isShowToast: boolean = false;
  isPeriodSet: boolean = false;
  depositLimitForm: FormGroup = new FormGroup({});
  perTransactionComponent = PerTransactionLimitComponent;
  dailyLimitComponent = DailyLimitComponent;
  weeklyLimitComponent = WeeklyLimitComponent;
  subscriptions: Subscription[] = [];
  selectedPeriod: string;
  rhsImages: RhsImages[] = [
    { id: 1, imgSrc: 'image1.png' },
    { id: 2, imgSrc: 'image2.png' },
    { id: 3, imgSrc: 'image3.png' }
  ];
  toastValue: ToastModel;
  dailyLimit: string = '';
  perTransaction: string = '';
  weeklyLimit: string = '';
  dailyLimitCount: string = '';
  weeklyLimitCount: string = '';
  remainingData: UserDepositHistoryResponseModel;
  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {}

  ngOnInit(): void {
    this.depositLimitForm = this.formBuilder.group({
      periods: ['', [Validators.required]]
    });

    this.getTableRestrictTabs();
    this.getDepositHistory();
  }

  getTableRestrictTabs() {
    const restrictTableViewModel = new RestrictTableTabModel();

    restrictTableViewModel.clear();

    restrictTableViewModel.clientTab = null;
    restrictTableViewModel.tab = ResponsibleGameTab.DEPOSIT_LIMIT;
    const restrictTableTab = this.responsibleGamingService
      .getRestrictTableTab(restrictTableViewModel)
      ?.pipe(
        tap(
          (res: CustomBaseResponse<RestrictTableTabResponseModel | RestrictTableResponseModel>) => {
            if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
              const respData = res.respData as RestrictTableResponseModel;
              this.dailyLimit = respData.subTabs?.dailylimit[0]?.selectedData ?? '0';
              this.perTransaction = respData.subTabs?.pertxnlimit[0]?.selectedData ?? '0';
              this.weeklyLimit = respData.subTabs?.weeklylimit[0]?.selectedData ?? '0';
              this.dailyLimitCount = respData.subTabs?.dailylimit[1]?.selectedData;
              this.weeklyLimitCount = respData.subTabs?.weeklylimit[1]?.selectedData;
            } else {
              this.showErrorToast();
            }
          }
        ),
        tap({
          error: () => {
            this.showErrorToast();
          }
        })
      )
      .subscribe();
    this.subscriptions.push(restrictTableTab);
  }

  showErrorToast() {
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.ApiError,
      flag: ResponsibleGameTab.ERROR_FLAG
    };
  }

  getDepositHistory() {
    const depositHistorySubscription = this.responsibleGamingService
      .getUserDepositHistory()
      ?.pipe(
        tap((res: BaseResponse<UserDepositHistoryResponseModel>) => {
          if (res.code === RESPONSIBLE_GAMING.SUCCESS) {
            this.remainingData = res.data;
          }
        }),
        tap({
          error: () => {
            this.showErrorToast();
          }
        })
      )
      .subscribe();
    this.subscriptions.push(depositHistorySubscription);
  }

  openDialog(component: any) {
    const dialogRef = this.dialog.open(component, {
      ...MAT_DIALOG.AnimatedResponsibleGamingDialog,
      data: {
        period: this.selectedPeriod,
        dailyLimit: this.dailyLimit,
        perTransactionLimit: this.perTransaction,
        weeklyLimit: this.weeklyLimit,
        dailyLimitCount: this.dailyLimitCount,
        weeklyLimitCount: this.weeklyLimitCount
      }
    });
    const dialog = dialogRef.afterClosed().subscribe((res) => {
      if (res.status === ResponsibleGameTab.SUCCESS_FLAG) {
        this.getTableRestrictTabs();
        this.isShowToast = true;

        let message: string = '';

        if (res.DEPOSIT_LIMIT_OPTIONS === ResponsibleGameTab.PER_TRANSACTION) {
          message = MessageConstant.perTransactionSuccess;
        } else if (res.DEPOSIT_LIMIT_OPTIONS === ResponsibleGameTab.DAILY) {
          message = MessageConstant.dailyLimitSuccess;
        } else if (res.DEPOSIT_LIMIT_OPTIONS === ResponsibleGameTab.WEEKLY) {
          message = MessageConstant.weeklyLimitSuccess;
        }

        this.toastValue = {
          message,
          flag: ResponsibleGameTab.SUCCESS_FLAG
        };
        this.isPeriodSet = true;
      }
    });
    this.subscriptions.push(dialog);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }
}
