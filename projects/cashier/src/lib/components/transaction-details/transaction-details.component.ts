import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { colors } from 'projects/cashier/src/assets/abstract/colorsConfig';
import { MessageConstant, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import {
  Cashier,
  CashierConstants,
  ContactUsConstants,
  Paths
} from '../../constants/app-constants';
import { MATDIALOG } from '../../constants/dialog.constants';
import { CashierService } from '../../services/cashier.service';
import { CashComponent } from '../cash/cash.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { HelpComponent } from '../help/help.component';
import { CustomTimeLineModel } from '../models/cashier.model';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnChanges, OnDestroy {
  @Input() txnData: any;

  colors = colors;

  assetsImagePath = Paths.imagePath;

  cashComponent = CashComponent;

  currentStatus: string = '';

  showCancelRequest: boolean = false;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  netTransferred: string = '0';

  tdsDeducted: string = '0';

  subscriptions: Subscription[] = [];

  constructor(
    public readonly dialog: MatDialog,
    private readonly cashierService: CashierService,
    private readonly clipBoard: Clipboard
  ) {}

  ngOnChanges(changes: any) {
    this.txnData = changes.txnData.currentValue;
    this.netTransferred = (
      parseInt(this.txnData.data.amount, 10) - this.txnData.data.tdsDeducted
    ).toString();
    this.tdsDeducted = this.txnData.data.tdsDeducted.toString();

    if (this.txnData?.from === this.cashComponent) {
      this.getTransactionData();
    }
  }

  txnTimeLine: CustomTimeLineModel = new CustomTimeLineModel([], undefined);

  openTnCDialog() {
    this.dialog.open(TermsAndConditionsComponent, MATDIALOG.profileDialog);
  }

  openHelpDialog() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(HelpComponent, MATDIALOG.helpDialog);
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === ContactUsConstants.successFlag) {
        this.toastMessageShow(
          ContactUsConstants.successFlag,
          MessageConstant.contactUsTicketSuccessMsg
        );
      }
    });
  }

  toastMessageShow(flag: string, message: string) {
    this.isShowToast = true;
    this.toastValue = {
      message,
      flag
    };
  }

  copyToClipboard() {
    this.clipBoard.copy(this.txnData.data.referenceCode);
  }

  cancelRequest() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...MATDIALOG.confirmationDialog,
      data: { from: CashierConstants.confirmDialogFrom, redeemId: this.txnData.data.referenceCode }
    });
    const dialog = dialogRef.afterClosed().subscribe((result) => {
      if (result.code === Cashier.SUCCESS) {
        this.getTransactionData();
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.withdrawalCancelled,
          flag: CashierConstants.successFlag
        };
      } else if (result.code === Cashier.FAILED) {
        this.isShowToast = true;

        this.toastValue = {
          message: result.message,
          flag: CashierConstants.errorFlag
        };
      } else {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: CashierConstants.errorFlag
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  getTransactionData() {
    const getStatusOfTransaction = this.cashierService
      .getStatusOfTransaction(this.txnData.data.id)
      .subscribe((resp) => {
        this.currentStatus = resp.data.currentStatus;

        if (resp.data.redeemStatusArr.length === 1) {
          this.showCancelRequest = true;
        } else {
          this.showCancelRequest = false;
        }

        this.txnTimeLine = new CustomTimeLineModel(undefined, resp);
      });
    this.subscriptions.push(getStatusOfTransaction);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
