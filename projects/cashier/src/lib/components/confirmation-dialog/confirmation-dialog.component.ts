import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  BaseResponse,
  CommonService,
  DataStorage,
  LocalStorageService,
  MessageConstant,
  ToastModel
} from 'projects/shared/src/public-api';
import * as SFS2X from 'sfs2x-api';
import { CashierConstants, Paths, ScreenId } from '../../constants/app-constants';
import { WindowManagerConstant } from '../../constants/window-manager-constant';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss',
    '../../../assets/components/buttons.scss'
  ]
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  yesClicked: boolean = false;

  totalAmount: number;

  ticketPrice: number;

  showInsufficientFlag: boolean;

  balanceNeeded: number;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  purchaseNow: any;

  userId: number;

  subscriptions: Subscription[] = [];

  userLoggedIn: number;

  addCashWindow: any;

  private dataStorage = DataStorage.getInstance();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cashierService: CashierService,
    public readonly localStorageService: LocalStorageService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public commonService: CommonService,
    public dialog: MatDialog,
    private userPreferencesService: UserPreferencesService
  ) {}

  ngOnInit(): void {
    const user = this.commonService.getUserData();
    this.userLoggedIn = this.localStorageService.getItem('token');
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
    this.yesClicked = true;
  }

  onClickProceed() {
    this.cashierService.cancelRequest(this.data.redeemId).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }

  getPurchaseWithSufficientBalance() {
    const getPurchaseNowSufficientBalance$ = this.cashierService.getPurchaseNowSufficientBalance(
      this.data.offerId
    );
    const getPurchaseNowSufficientBalance: Subscription =
      getPurchaseNowSufficientBalance$.subscribe({
        next: (res: BaseResponse<any>) => {
          this.purchaseNow = res;
          this.dialogRef.close(this.purchaseNow);
        },
        error: () => {
          this.isShowToast = true;

          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      });
    this.subscriptions.push(getPurchaseNowSufficientBalance);
  }

  openAddCash() {
    this.localStorageService.setItem('flow', 'addCash');
    if (this.userLoggedIn) {
      if (this.addCashWindow && !this.addCashWindow.closed) {
        this.addCashWindow.focus();
        let isWindFocused: boolean = false;
        this.addCashWindow.onfocus = () => {
          isWindFocused = true;
        };
        const winTimeout = setTimeout(() => {
          if (!isWindFocused) {
            this.addCashWindow = window.open(
              ScreenId.ADD_CASH,
              MessageConstant.AddCash,
              `width=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[0]}px,
              height=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[1]}px`
            );
          }
          clearTimeout(winTimeout);
        }, 500);
        return;
      }

      const dataToPass = {
        dialog: JSON.stringify({
          offerPrice: this.balanceNeeded,
          from: CashierConstants.myOffers,
          totalAmount: this.data.totalAmount
        })
      };

      const queryParams = new URLSearchParams(dataToPass).toString();

      this.addCashWindow = window.open(
        `${ScreenId.ADD_CASH}?${queryParams}`,
        MessageConstant.AddCash,
        `width=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[0]}px,
        height=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[1]}px`
      );
      this.addCashWindow?.addEventListener('resize', () => {
        this.addCashWindow?.resizeTo(376, 668);
      });
      window.allWindow?.set(ScreenId.ADD_CASH, this.addCashWindow);
      const timeoutVar = setTimeout(() => {
        const { addCashChildWindow } = this.addCashWindow;
        addCashChildWindow?.setData(this.dataStorage);
        addCashChildWindow?.setCashData(this.totalAmount);

        addCashChildWindow?.setSmartFox(this.dataStorage.sfs, SFS2X);
        addCashChildWindow?.setUserPreference(this.userPreferencesService);
        this.addCashWindow?.postMessage({ totalAmount: this.totalAmount }, '*');
        clearTimeout(timeoutVar);
      }, 1000);
      this.dialogClose();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
