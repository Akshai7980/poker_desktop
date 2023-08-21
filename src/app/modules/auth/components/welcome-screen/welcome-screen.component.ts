import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistrationSuccessfulResponse } from 'projects/shared/src/lib/models/response/registration-sucessfull.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  BaseResponse,
  CommonService,
  MATDIALOG,
  MessageConstant,
  Paths,
  ScreenId,
  ToastModel,
  ToastTime
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html'
})
export class WelcomeScreenComponent implements OnInit, OnDestroy {
  showOnBoardScreen: boolean = true;

  assetsImagePath = Paths.imagePath;

  subscriptions: Subscription[] = [];

  avatar = AvatarComponent;

  toastValue: ToastModel = {} as ToastModel;

  isShowToast: boolean = false;

  navigationTime = ToastTime.FOURSECOND;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<WelcomeScreenComponent>
  ) {}

  ngOnInit(): void {
    const getBonusDetails$ = this.authService.getBonusDetails();
    const getBonusDetails: Subscription = getBonusDetails$.subscribe({
      next: (resp: BaseResponse<RegistrationSuccessfulResponse>) => {
        this.setBounceDetails(resp.data);
        const timeoutId = setTimeout(() => {
          this.dialog.closeAll();
          this.dialog.open(this.avatar, MATDIALOG.avatarDialog);
          clearTimeout(timeoutId);
        }, this.navigationTime);
      },
      error: () => {
        this.setBounceDetails();
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(getBonusDetails);
  }

  onClose() {
    this.dialogRef.close();
  }

  setBounceDetails(data?: RegistrationSuccessfulResponse) {
    const bonusDetails = {
      bonus: (data?.ib_amt ?? 0) + (data?.tb_amt ?? 0) + (data?.payoff_bonus_amt ?? 0),
      ib: data?.ib_amt ?? 0,
      tb: data?.tb_amt ?? 0,
      bb: data?.payoff_bonus_amt ?? 0,
      sngTicket:
        data?.ticket_data && JSON.parse(data.ticket_data).length > 0
          ? JSON.parse(data.ticket_data)[0]?.count
          : 0,
      freeRoll: data?.freeroll ?? 0
    };
    if (this.authService.bonusDetails) {
      this.authService.bonusDetails.next(bonusDetails);
    }
  }

  goToLobby() {
    this.dialog.closeAll();
    this.commonService.navigateTo(ScreenId.LOBBY);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
