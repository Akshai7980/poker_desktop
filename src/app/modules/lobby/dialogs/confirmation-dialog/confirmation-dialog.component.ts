import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CashierService } from 'projects/cashier/src/lib/services/cashier.service';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import {
  Paths,
  BaseResponse,
  MessageConstant,
  CommonService
} from 'projects/shared/src/public-api';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: [
    '../../../../../assets/abstract/_core.scss',
    '../../../../../assets/components/cashier-common.scss',
    '../../../../../assets/theme/components/custom.scss'
  ]
})
export class ConfirmationDialogComponent implements OnInit {
  // Note This Component is similar to Cashier So For Any Integration
  // Related imports should be from "app" level not "cashier" project

  assetsImagePath = Paths.imagePath;

  YesClicked: boolean = false;

  totalAmount: any;

  ticketPrice: any;

  showInsufficientFlag: boolean;

  balanceNeeded: any;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  purchaseNow: any;

  userId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cashierService: CashierService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.commonService.getUserData();
    this.userId = user?.userId;
    this.totalAmount = this.data.totalAmount;
    this.ticketPrice = this.data.offerPrice;
    if (this.ticketPrice < this.totalAmount) {
      this.showInsufficientFlag = false;
    } else {
      this.balanceNeeded = this.ticketPrice - this.totalAmount;
      this.showInsufficientFlag = true;
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

  clickedYes() {
    this.YesClicked = true;
  }

  getPurchaseWithSufficientBalance() {
    this.cashierService.getPurchaseNowSufficientBalance(this.data.offerId).subscribe(
      (res: BaseResponse<any>) => {
        this.purchaseNow = res;
        this.dialogRef.close(this.purchaseNow);
      },
      () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    );
  }
}
