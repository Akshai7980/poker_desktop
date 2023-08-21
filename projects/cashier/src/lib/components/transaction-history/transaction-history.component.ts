import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Paths } from '../../constants/app-constants';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class TransactionHistoryComponent {
  assetsImagePath = Paths.imagePath;

  selectedTabMain: string;

  tabMain: string[] = ['Cash', 'Bonus'];

  isDualScreen: boolean = false;

  activeComponent: any;

  transactionDetails = TransactionDetailsComponent;

  transactionFilter = TransactionFilterComponent;

  txnData: any;

  filterValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public readonly cashierService: CashierService,
    private dialogRef: MatDialogRef<TransactionHistoryComponent>
  ) {
    this.selectedTabMain = data.from;
  }

  onSelectTabMain(event: any, mTab: string) {
    this.filterValue = '15';
    const { innerText, target } = event;
    if (innerText === 'Cash') {
      target.id = 'transaction-history-cash-btn';
    } else if (innerText === 'Bonus') {
      target.id = 'transaction-history-bonus-btn';
    } else {
      target.id = 'transaction-history-ledger-btn';
    }
    this.selectedTabMain = mTab;
    this.closeFilter('close');
  }

  detectedDualScreen(event: any) {
    if (event.data && event.data === 'close') {
      this.closeFilter(event.data);
      return;
    }
    this.isDualScreen = true;
    if (event.component === 'TransactionDetailsComponent') {
      this.activeComponent = this.transactionDetails;
    } else {
      this.activeComponent = this.transactionFilter;
    }
    this.txnData = event;
  }

  onBack() {
    this.dialog.closeAll();
  }

  closeFilter(event: any) {
    if (event === 'close') {
      this.isDualScreen = false;
    }
  }

  backToCashier() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
  }
}
