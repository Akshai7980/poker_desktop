import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { MessageConstant } from 'projects/shared/src/public-api';
import { WithdrawalMethodsProfileComponent } from 'projects/shared/src/lib/components/withdrawal-methods/withdrawal-methods.component';
import { Paths } from '../../constants/app-constants';
import { MATDIALOG } from '../../constants/dialog.constants';

@Component({
  selector: 'app-withdrawal-methods',
  templateUrl: './withdrawal-methods.component.html',
  styleUrls: ['../../../assets/abstract/_utilities.scss', '../../../assets/components/buttons.scss']
})
export class WithdrawalMethodsComponent implements OnDestroy, OnChanges {
  assetsImagePath = Paths.imagePath;

  isAddUPI: boolean = false;

  isAddBank: boolean = false;

  isShowToast: boolean = false;

  wdrMethodsForm: FormGroup = new FormGroup({});

  @Input() bankListData: any = [];

  toastValue: { message: string; flag: string };

  selectedRadioIndex: string = '0';

  subscriptions: Subscription[] = [];

  constructor(private readonly formBuilder: FormBuilder, public readonly matDialog: MatDialog) {
    this.wdrMethodsForm = this.formBuilder.group({
      withdrawalMethod: []
    });
  }

  ngOnChanges(): void {
    this.bankListData.forEach((element: any, index: number) => {
      if (element.isDefault) {
        this.selectedRadioIndex = index.toString();
      }
    });
  }

  onSelectRadio(event: any, index: string) {
    this.selectedRadioIndex = index;
  }

  add(value: string) {
    if (value === 'upi') {
      this.openAddUpiDialog();
    } else {
      this.openAddBankDialog();
    }
  }

  openAddBankDialog() {
    const dialogRef = this.matDialog.open(WithdrawalMethodsProfileComponent, {
      ...MATDIALOG.animatedDualScreenDialog,
      data: { data: { isComingFromList: 'ADD_BANK_SECTION' } }
    });
    const dialog = dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res === 'pending') {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.BankAccountPending,
          flag: 'pending'
        };

        this.isAddUPI = false;
        this.isAddBank = false;
      } else if (res && res === 'verified') {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.BankAccountAdded,
          flag: 'success'
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  openAddUpiDialog() {
    const dialogRef = this.matDialog.open(WithdrawalMethodsProfileComponent, {
      ...MATDIALOG.animatedDualScreenDialog,
      data: { data: { isComingFromList: 'ADD_UPI_SECTION' } }
    });
    const dialog = dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.isAddUPI = false;
        this.isAddBank = false;

        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.BankAccountAdded,
          flag: 'success'
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  openWithdrawMethod() {
    this.matDialog.open(WithdrawalMethodsProfileComponent, {
      ...MATDIALOG.animatedDualScreenDialog,
      data: { data: { isComingFromList: 'withdraw_methods' } }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
