import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  BaseResponse,
  CommonService,
  GlobalConstant,
  MessageConstant
} from 'projects/shared/src/public-api';
import { Subscription, combineLatest } from 'rxjs';
import { Cashier, CashierConstants, Paths } from '../../constants/app-constants';
import { MATDIALOG } from '../../constants/dialog.constants';
import { CalculateTDSResponse } from '../../models/response/calculate-tds.response';
import { CashierService } from '../../services/cashier.service';
import { KycPendingComponent } from '../kyc-pending/kyc-pending.component';
import { CashierServiceModel, CashierServiceTypeConst } from '../models/cashier.model';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { WithheldDepositComponent } from '../withheld-deposit/withheld-deposit.component';
import { CashierWithdrawModel } from '../../models/view/cashier-withdraw.model';

interface Bank {
  userBankId: number;
}

interface DialogData {
  cashierInitData: {
    minRedeemAmt: string;
  };
}

interface BankElement {
  isVerified: boolean;
  userBankId: number;
}
@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  isDualScreen: boolean = false;

  isKycPending: boolean = true;

  withdrawForm: FormGroup = new FormGroup({});

  calculateTDSClicked: boolean = false;

  withHeldAmount: number;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  enteredAmount: number;

  isAmountInputBlurred: boolean;

  defaultBank: Bank[] = [];

  subscriptions: Subscription[] = [];

  withdrawBalance: number;

  enableWithdrawButton: boolean;

  showCalculatedTds: boolean;

  withTdsAmounts: CalculateTDSResponse = {} as CalculateTDSResponse;

  showErrorMsg: boolean;

  disabledTds: boolean = false;

  nonTaxable: number;

  savedBanks: [
    {
      cardId: string;
      cardNumber: string;
      cardType: string;
      cardIssuer: string;
      cardBrand: string;
    }
  ];

  kycPendingDialogRef: DialogRef<unknown, KycPendingComponent>;

  // We are using here CDK Dialog
  constructor(
    private formBuilder: FormBuilder,
    public dialog: Dialog,
    private overlay: Overlay,
    public matDialog: MatDialog,
    public dialogWithdrawRef: MatDialogRef<WithdrawComponent>,
    private cashierService: CashierService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commonService: CommonService
  ) {
    if (this.isKycPending) {
      const cdkDialogRef = this.dialog.open(KycPendingComponent, {
        width: '414px',
        backdropClass: 'kyc-pending-backdrop',
        disableClose: true,
        positionStrategy: this.overlay.position().global().bottom().right(),
        data: { data: '' }
      });
      this.kycPendingDialogRef = cdkDialogRef;
      const cdkDialog = cdkDialogRef.closed.subscribe((res: string | unknown) => {
        if (res === CashierConstants.kycCompleted) {
          this.isKycPending = false;
          if (!this.isKycPending) {
            this.isDualScreen = true;
          }
        }
      });
      this.subscriptions.push(cdkDialog);
    }
  }

  ngOnInit(): void {
    this.withdrawForm = this.formBuilder.group({
      enteredAmount: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]]
    });

    this.getCardsAndBalance();
  }

  getCardsAndBalance() {
    const allSubscriptions$ = combineLatest([
      this.cashierService.getReedmableBalance(),
      this.cashierService.getSavedCards(),
      this.cashierService.getBankList()
    ]);
    const allSubscriptions: Subscription = allSubscriptions$.subscribe({
      next: (res: any) => {
        if (res[0].code === Cashier.SUCCESS) {
          this.withdrawBalance = res[0].data.withAmt;
          this.withHeldAmount = res[0].data.usersHoldAmount;
          this.nonTaxable = res[0].data.currInvestment;
        }

        if (res[1].code === Cashier.SUCCESS) {
          this.savedBanks = res[1].data.list;
        }

        if (res[2].code === Cashier.SUCCESS) {
          const bankListData: BankElement[] = res[2].data;

          bankListData.forEach((element) => {
            if (element.isVerified) {
              this.defaultBank.push(element);
            }
          });
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(allSubscriptions);
  }

  onVerifyAmount(event: Event) {
    const target = event.target as HTMLInputElement;
    let amount = target.value ? target.value : '';

    amount = amount.replace(/[^0-9]/g, '');
    const parsedAmount = parseInt(amount, 10);

    const minRedeemAmt = Number(this.data.cashierInitData?.minRedeemAmt);
    if (parsedAmount >= minRedeemAmt && parsedAmount <= this.withdrawBalance) {
      this.disabledTds = false;
      this.showErrorMsg = false;
      this.enableWithdrawButton = false;
    } else if (parsedAmount < minRedeemAmt) {
      this.disabledTds = true;
      this.showErrorMsg = false;
      this.enableWithdrawButton = false;
    } else if (parsedAmount > this.withdrawBalance) {
      this.disabledTds = true;
      this.showErrorMsg = true;
      this.enableWithdrawButton = false;
    } else {
      this.enableWithdrawButton = false;
      this.disabledTds = false;
      this.showErrorMsg = false;
    }

    if (amount.trim() === '') {
      this.withdrawForm.controls['enteredAmount'].setValue('');
    }
    if (!Number.isNaN(parsedAmount) && parsedAmount >= 0) {
      const formattedAmount = `₹ ${parsedAmount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`;

      this.withdrawForm.controls['enteredAmount'].setValue(formattedAmount);
    }
  }

  onClickEdit() {
    this.calculateTDSClicked = false;
    this.enableWithdrawButton = false;
  }

  calculateTDS() {
    this.calculateTDSClicked = true;
    this.enteredAmount = parseInt(
      this.withdrawForm.controls['enteredAmount'].value.replace(/[^0-9.-]+/g, ''),
      10
    );
    const calculateTds$ = this.cashierService.calculateTds(this.enteredAmount, '');
    const calculateTds: Subscription = calculateTds$.subscribe({
      next: (res: BaseResponse<CalculateTDSResponse>) => {
        if (res.code === Cashier.SUCCESS) {
          this.withTdsAmounts = res.data;
          this.showCalculatedTds = true;
          this.enableWithdrawButton = true;
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(calculateTds);
  }

  openInNewWindow(value: string) {
    if (value === 'withdrawal') {
      window.open('https://www.adda52.com/compliance');
    } else {
      window.open('https://www.adda52.com/faq/tds');
    }
  }

  openTransactionHistoryDialog(type: string) {
    this.matDialog.open(TransactionHistoryComponent, {
      ...MATDIALOG.animatedDualScreenDialog,
      data: { from: type, subTab: 'Withdrawal' }
    });
    this.cashierService.txnHistoryFrom = 'Withdraw';
  }

  openWithheldDepositDialog() {
    this.matDialog.closeAll();
    const dialogRef = this.matDialog.open(WithheldDepositComponent, {
      ...MATDIALOG.animatedDualScreenDialog,
      data: { withHeldAmt: this.withHeldAmount }
    });
    dialogRef.afterClosed().subscribe((resp: string) => {
      const { BACK_BUTTON_CLICK } = GlobalConstant.CASHIER;
      if (resp === BACK_BUTTON_CLICK) {
        const cashierModel: CashierServiceModel = {
          type: CashierServiceTypeConst.WITHDRAWAL_BACK
        };
        this.cashierService.cashierCommonSubject.next(cashierModel);
      }
    });
  }

  onClickWithdraw() {
    const { ngnxPokerDesktop, modeOfPayment } = CashierConstants;
    const cashierWithdraw = new CashierWithdrawModel();

    cashierWithdraw.clear();

    cashierWithdraw.amount = this.enteredAmount;
    cashierWithdraw.mode = modeOfPayment;
    cashierWithdraw.source = ngnxPokerDesktop;
    cashierWithdraw.bankDocId = this.defaultBank[0]?.userBankId;
    cashierWithdraw.tdsAmount = this.withTdsAmounts.tds;

    const withdrawAmount$ = this.cashierService.withdrawAmount(cashierWithdraw);
    const withdrawAmount: Subscription = withdrawAmount$.subscribe({
      next: (res) => {
        if (res.code === Cashier.SUCCESS) {
          this.isShowToast = true;

          const withdrawalMessage = MessageConstant.WithdrawalMessage;
          const { redeemAmt } = this.withTdsAmounts;
          this.toastValue = {
            message: `${withdrawalMessage} ₹ ${this.commonService.formatAmount(redeemAmt)}.`,
            flag: 'success'
          };
          this.withdrawForm.reset();
          this.enableWithdrawButton = false;
          this.showCalculatedTds = false;
          this.calculateTDSClicked = false;
        } else {
          this.withdrawForm.reset();
          this.enableWithdrawButton = false;
          this.showCalculatedTds = false;
          this.calculateTDSClicked = false;

          this.isShowToast = true;

          this.toastValue = {
            message: res.message,
            flag: 'error'
          };
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(withdrawAmount);
  }

  onClose() {
    this.matDialog.closeAll();
  }

  backToCashier() {
    this.cashierService.toggleAnimationDialog(this.dialogWithdrawRef);
    if (this.isKycPending) {
      this.kycPendingDialogRef.close();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
