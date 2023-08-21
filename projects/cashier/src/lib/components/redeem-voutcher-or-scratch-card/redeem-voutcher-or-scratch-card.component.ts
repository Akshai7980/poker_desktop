import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RedeemScratchCodeModel } from 'projects/cashier/src/lib/models/view/redeem-scratch-code-model';
import { BaseResponse, MessageConstant, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { Cashier, CashierConstants, Paths, ToastTime } from '../../constants/app-constants';
import { MATDIALOG } from '../../constants/dialog.constants';
import { RedeemScratchCardResponse } from '../../models/response/redeem-scratch-code.response.model';
import { CashierService } from '../../services/cashier.service';
import { CongratulationsDialogComponent } from '../congratulations-dialog/congratulations-dialog.component';

interface FaqItem {
  title: string;
  collapsed: boolean;
  answer: string;
}

interface FaqList extends Array<FaqItem> {}

@Component({
  selector: 'app-redeem-voutcher-or-scratch-card',
  templateUrl: './redeem-voutcher-or-scratch-card.component.html',
  styleUrls: [
    '../../../assets/components/cashier-common.scss',
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/buttons.scss'
  ]
})
export class RedeemVoutcherOrScratchCardComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;
  voucherForm: FormGroup = new FormGroup({});
  isScratchCardValid: boolean = false;
  isShowToast: boolean = false;
  scratchCardInputStatus: string = '';
  isValidCode: boolean = false;
  subscriptions: Subscription[] = [];
  toastValue: ToastModel;
  faqList: FaqList;
  openFAQIndex: number = -1;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly cashierService: CashierService,
    private readonly dialogref: DialogRef,
    private dialogRef: MatDialogRef<RedeemVoutcherOrScratchCardComponent>
  ) {}

  ngOnInit(): void {
    this.voucherForm = this.formBuilder.group({
      voucherCode: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.scratchCardInputStatus = '';
    this.getFaqData();
  }

  getFaqData() {
    const getFaqData$ = this.cashierService.getFaqData('scratch_card');
    const getFaqData: Subscription = getFaqData$.subscribe({
      next: (res: any) => {
        if (res.code === Cashier.SUCCESS) {
          this.faqList = res.data.reverse();

          this.faqList = this.faqList.map((element: FaqItem, i: number) => ({
            ...element,
            collapsed: i !== 0
          }));
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
    this.subscriptions.push(getFaqData);
  }

  OnChangeCode() {
    this.isScratchCardValid = false;
    this.isValidCode = false;
    this.scratchCardInputStatus = '';
  }

  onSubmitVoucher() {
    const redeemScratchCard = new RedeemScratchCodeModel();

    redeemScratchCard.clear();

    redeemScratchCard.code = this.voucherForm.controls['voucherCode'].value;

    const verifyScratchCard$ = this.cashierService.verifyScratchCard(redeemScratchCard);
    const verifyScratchCard: Subscription = verifyScratchCard$.subscribe({
      next: (res: BaseResponse<RedeemScratchCardResponse>) => {
        if (res.code === Cashier.SUCCESS) {
          this.isScratchCardValid = true;
          this.scratchCardInputStatus = CashierConstants.successFlag;
          this.isValidCode = true;
          this.dialogref.close();
          this.openCongratulationsDialog(res.data);
        } else if (res.code === Cashier.COUPON_ALREADY_USED) {
          this.scratchCardInputStatus = CashierConstants.failed;

          this.isScratchCardValid = false;

          this.isShowToast = true;

          this.toastValue = {
            message: res.message,
            flag: CashierConstants.errorFlag
          };
        } else {
          this.scratchCardInputStatus = CashierConstants.failed;

          this.isScratchCardValid = false;

          this.isShowToast = true;
          this.isValidCode = false;

          this.toastValue = {
            message: res.message,
            flag: CashierConstants.errorFlag
          };
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
    this.subscriptions.push(verifyScratchCard);
  }

  openCongratulationsDialog(data: RedeemScratchCardResponse) {
    const dialogRef = this.dialog.open(CongratulationsDialogComponent, {
      ...MATDIALOG.congratulationsDialog,
      data: { from: CashierConstants.redeemVoucher, cause: '', details: data }
    });

    const timeoutId = setTimeout(() => {
      dialogRef.close();
      clearTimeout(timeoutId);
    }, ToastTime.TOAST_TIMER);
  }

  onBack() {
    this.dialog.closeAll();
  }

  backToCashier() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
