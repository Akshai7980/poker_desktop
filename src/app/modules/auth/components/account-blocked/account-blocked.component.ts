import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  APIResponseCode,
  AppConstants,
  Paths
} from 'projects/shared/src/lib/constants/app-constants';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BaseResponse, RaiseDisputeResponseModel } from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-account-blocked',
  templateUrl: './account-blocked.component.html'
})
export class AccountBlockedComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  isAccountTemparyBlocked: boolean = false;

  showDisputeOption: boolean = false;

  disputeRaised: boolean = false;

  isShowToast: boolean = false;

  message: string = '';

  toastValue: ToastModel;

  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AccountBlockedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const dialogData = this.data.data;
    this.showDisputeOption = Number(dialogData.showDisputeOption) === 0;
    this.disputeRaised = Number(dialogData.disputeRaised) === 1;
    this.message = this.data.message;
    this.isAccountTemparyBlocked =
      dialogData?.type.toString() === AppConstants.TEMP_BLOCK_USER ||
      (dialogData?.type.toString() === AppConstants.FIXED &&
        this.getMilliSecondsOfValidity(dialogData?.validity) > 0);
  }

  onClose() {
    this.dialog.closeAll();
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  raiseDispute() {
    const raiseDispute = this.authService
      .raiseDispute(this.data.data.token)
      .subscribe((resp: BaseResponse<RaiseDisputeResponseModel>) => {
        if (resp.code === APIResponseCode.AUTH.DISPUTE_RAISED_SUCESS) {
          this.disputeRaised = true;
        } else {
          this.disputeRaised = false;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
        }
      });
    this.subscriptions.push(raiseDispute);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getMilliSecondsOfValidity(validity: string) {
    const dateParts = validity.split(/-|\s|:/);
    const [day, month, year, hours, minutes, meridiem] = dateParts;

    let hours24 = parseInt(hours, 10);
    if (meridiem === 'PM' && hours24 < 12) {
      hours24 += 12;
    }

    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      hours24,
      parseInt(minutes, 10)
    );

    return date.getTime();
  }
}
