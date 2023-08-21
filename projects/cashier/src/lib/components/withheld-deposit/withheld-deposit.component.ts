import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse, GlobalConstant, MessageConstant } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { Paths } from '../../constants/app-constants';
import { List, WithheldListResponse } from '../../models/response/withheld-list.response';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-withheld-deposit',
  templateUrl: './withheld-deposit.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss',
    '../../../assets/components/buttons.scss'
  ]
})
export class WithheldDepositComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  isDualScreen: boolean = false;

  withheldList: List[];

  withHeldAmt: any;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  withHeldAmount: any;

  subscriptions: Subscription[] = [];

  isKnowMore: boolean = false;

  constructor(
    public cashierService: CashierService,
    private dialogRef: MatDialogRef<WithheldDepositComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.withHeldAmount = this.data.withHeldAmt;
    this.getWithheldDepositList();
  }

  openReleaseUnitsPGPDialog() {
    this.isKnowMore = false;
    this.isDualScreen = !this.isDualScreen;
  }

  getWithheldDepositList() {
    const getWithheldDepositList$ = this.cashierService.getWithheldDepositList(1);
    const getWithheldDepositList: Subscription = getWithheldDepositList$.subscribe({
      next: (res: BaseResponse<WithheldListResponse>) => {
        this.withheldList = res.data.list;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(getWithheldDepositList);
  }

  openKnowMoreLink() {
    this.isDualScreen = true;
    this.isKnowMore = true;
  }

  onBackButtonClick() {
    const { BACK_BUTTON_CLICK } = GlobalConstant.CASHIER;
    this.dialogRef.close(BACK_BUTTON_CLICK);
  }

  close() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
