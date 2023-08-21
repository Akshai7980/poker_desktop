import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  BaseResponse,
  DataStorage,
  LocalStorageService,
  MessageConstant,
  ToastModel
} from 'projects/shared/src/public-api';
import { combineLatest, Subscription } from 'rxjs';
import * as SFS2X from 'sfs2x-api';

import { BonusesComponent } from './components/bonuses/bonuses.component';
import { CongratulationsDialogComponent } from './components/congratulations-dialog/congratulations-dialog.component';
import { CashierServiceModel, CashierServiceTypeConst } from './components/models/cashier.model';
import { MyTicketsAndOffersComponent } from './components/my-tickets-and-offers/my-tickets-and-offers.component';
import { RedeemVoutcherOrScratchCardComponent } from './components/redeem-voutcher-or-scratch-card/redeem-voutcher-or-scratch-card.component';
import { ReleaseUnitsPgpsComponent } from './components/release-units-pgps/release-units-pgps.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { Cashier, CashierConstants, Paths, ScreenId, ToastTime } from './constants/app-constants';
import { MATDIALOG } from './constants/dialog.constants';
import { WindowManagerConstant } from './constants/window-manager-constant';
import { CasiherDataResponse } from './models/response/cashierdetails.response.model';
import { CashierInitDataResponse } from './models/response/cashierInItData.response.model';
import { FreeRollChipsResponse } from './models/response/freeClaimChips.reponse.model';
import { RedeemableBalanceResponse } from './models/response/redeemanleBalance.responce.model';
import { CashierService } from './services/cashier.service';

@Component({
  selector: 'ngx-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  claimButtonCLicked: boolean = false;

  transactionHistory = TransactionHistoryComponent;

  myTicketsAndOffers = MyTicketsAndOffersComponent;

  redeemVoutchersOrScratchCard = RedeemVoutcherOrScratchCardComponent;

  releaseUnitespgps = ReleaseUnitsPgpsComponent;

  bonuses = BonusesComponent;

  congratulations = CongratulationsDialogComponent;

  withdraw = WithdrawComponent;

  cashierData: any;

  redeemData: RedeemableBalanceResponse;

  cashierInitData: CashierInitDataResponse;

  interval: ReturnType<typeof setInterval> | undefined;

  toastValue: ToastModel;

  isShowToast: boolean = false;

  time: number;

  remainingHoursFormat: string = '0h : 0m : 0s';

  remainingTime: number;

  totalAmount: number;

  addCashWindow: any;

  userLoggedIn: boolean;

  subscriptions: Subscription[] = [];

  private dataStorage = DataStorage.getInstance();

  constructor(
    public dialog: MatDialog,
    public cashierService: CashierService,
    private localStorageService: LocalStorageService,
    private userPreferencesService: UserPreferencesService,
    public router: Router,
    private dialogRef: MatDialogRef<CashierComponent>
  ) {}

  ngOnInit(): void {
    this.userLoggedIn = this.localStorageService.getItem('token');
    if (this.cashierService.subscribeToCashierSubject()) {
      this.cashierService.cashierCommonSubject.subscribe((data: CashierServiceModel) => {
        if (data.type === CashierServiceTypeConst.WITHDRAWAL_BACK) {
          this.openWithdrawDialog();
        }
      });
    }
    this.getCashierData();
    if (!this.userLoggedIn) {
      this.dialog.closeAll();
    }
  }

  openTransactionHistoryDialog(type: string) {
    this.dialog.open(TransactionHistoryComponent, {
      ...MATDIALOG.animatedDualScreenDialog,
      data: { from: type }
    });
    this.cashierService.txnHistoryFrom = type;
  }

  openTicketsAndOffersDialog() {
    this.dialog.open(MyTicketsAndOffersComponent, {
      data: { totalAmount: this.totalAmount, from: CashierConstants.cashier },
      ...MATDIALOG.animatedSingleDialog
    });
  }

  openRedeemVoucherScratchCardDialog() {
    this.dialog.open(RedeemVoutcherOrScratchCardComponent, MATDIALOG.animatedSingleDialog);
  }

  openReleaseUnitsPgpsDialog() {
    this.dialog.open(ReleaseUnitsPgpsComponent, MATDIALOG.animatedSingleDialog);
  }

  openBonusesDialog() {
    this.dialog.open(BonusesComponent, MATDIALOG.bonusesDialog);
  }

  openCongratulationsDialog() {
    const getFreeClaimChips$ = this.cashierService.getFreeClaimChips();
    const getFreeClaimChips: Subscription = getFreeClaimChips$.subscribe({
      next: (res: BaseResponse<FreeRollChipsResponse>) => {
        if (res.code === Cashier.SUCCESS) {
          this.claimButtonCLicked = true;
          const text = res.message;
          const regex = /\d+/;
          const match = text.match(regex);
          const number = match ? parseInt(match[0], 10) : 0;

          this.getCashierData();

          const dialogRef = this.dialog.open(CongratulationsDialogComponent, {
            ...MATDIALOG.congratulationsDialog,
            data: {
              from: CashierConstants.cashier,
              cause: CashierConstants.claim_free_chips,
              chipsCount: number
            }
          });

          const timeoutId = setTimeout(() => {
            dialogRef.close();
            clearInterval(timeoutId);
          }, ToastTime.TOAST_TIMER);
        } else {
          this.claimButtonCLicked = false;
          this.isShowToast = true;

          this.toastValue = {
            message: res.message,
            flag: CashierConstants.errorFlag
          };
        }
      },
      error: () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.SomeThingWentWrong,
          flag: CashierConstants.errorFlag
        };
      }
    });
    this.subscriptions.push(getFreeClaimChips);
  }

  openWithdrawDialog() {
    this.dialog.open(WithdrawComponent, {
      data: this.cashierInitData,
      ...MATDIALOG.animatedDualScreenDialog
    });
  }

  getCashierData() {
    const getCashierData$ = combineLatest([
      this.cashierService.getCashierData(),
      this.cashierService.getReedmableBalance(),
      this.cashierService.getCashierInITData()
    ]);
    const getCashierData: Subscription = getCashierData$.subscribe({
      next: (
        res: [
          BaseResponse<CasiherDataResponse>,
          BaseResponse<RedeemableBalanceResponse>,
          BaseResponse<CashierInitDataResponse>
        ]
      ) => {
        if (res[0].code === Cashier.SUCCESS) {
          this.cashierData = res[0].data;

          this.totalAmount = this.cashierData.total;
          if (this.cashierData?.remainingTime > 0) {
            this.claimButtonCLicked = true;

            this.cashierData.remainingTime -= 1;
            this.remainingHoursFormat = this.formatCountdown(this.cashierData?.remainingTime);

            const timer = setInterval(() => {
              this.cashierData.remainingTime -= 1;
              this.remainingHoursFormat = this.formatCountdown(this.cashierData?.remainingTime);
              if (this.cashierData?.remainingTime <= 0) {
                clearInterval(timer);
              }
            }, ToastTime.COUNT_DOWN_TIMER);
          }

          this.redeemData = res[1].data;
          this.cashierInitData = res[2].data;
        }
      },
      error: () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: CashierConstants.errorFlag
        };
      }
    });
    this.subscriptions.push(getCashierData);
  }

  formatCountdown(seconds: number) {
    let remainingTime = seconds * 1000;
    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    remainingTime -= hours * 60 * 60 * 1000;
    const minutes = Math.floor(remainingTime / (60 * 1000));
    remainingTime -= minutes * 60 * 1000;
    const remainingSeconds = Math.floor(remainingTime / 1000);
    return `${hours.toString().padStart(2, '0')}h : ${minutes
      .toString()
      .padStart(2, '0')}m : ${remainingSeconds.toString().padStart(2, '0')}s`;
  }

  openAddCashDialog() {
    if (this.userLoggedIn) {
      this.dialog.closeAll();

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
          clearInterval(winTimeout);
        }, 500);
        return;
      }

      this.addCashWindow = window.open(
        ScreenId.ADD_CASH,
        MessageConstant.AddCash,
        `width=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[0]}px,
        height=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[1]}px`
      );
      this.addCashWindow?.addEventListener('resize', () => {
        const maxWidth = WindowManagerConstant.WINDOW_SIZE.ADD_CASH[1];
        const maxHeight = WindowManagerConstant.WINDOW_SIZE.ADD_CASH[0];

        this.addCashWindow?.resizeTo(maxWidth, maxHeight);
      });

      window.allWindow?.set(ScreenId.ADD_CASH, this.addCashWindow);
      const timeoutVar = setTimeout(() => {
        this.addCashWindow?.addEventListener(
          'ngLoad',
          () => {
            const { addCashChildWindow } = this.addCashWindow;
            addCashChildWindow?.setData(this.dataStorage);
            addCashChildWindow?.setCashData(this.totalAmount);
            addCashChildWindow?.setSmartFox(this.dataStorage.sfs, SFS2X);
            addCashChildWindow?.setUserPreference(this.userPreferencesService);
            window.addEventListener('message', () => {
              this.getCashierData();
            });
            window.allWindow.set('cahier', this.addCashWindow);
            clearInterval(timeoutVar);
          },
          1000
        );
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  closeDialog() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('?dialog=cashier', '');
    this.router.navigateByUrl(newUrl);
  }
}
