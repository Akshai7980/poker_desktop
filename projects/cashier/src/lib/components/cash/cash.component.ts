import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';

import { BaseResponse } from 'projects/shared/src/public-api';
import { CashierConstants, Paths } from '../../constants/app-constants';
import { DualScreenModeModel } from '../../models/common/output-parameter-model';
import { TransactionHistoryCash } from '../../models/response/transaction-history.model';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.scss']
})
export class CashComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1';

  assetsImagePath = Paths.imagePath;

  selectedTab: string;

  subTab: string[] = ['All', 'Deposit', 'Withdrawal'];

  cashTxnLists: CashTHViewModel = new CashTHViewModel([]);

  @Input() filter: string;

  type: string = CashierConstants.type;

  subscriptions: Subscription[] = [];

  @Output() dualScreenMode: EventEmitter<DualScreenModeModel> =
    new EventEmitter<DualScreenModeModel>();

  selectedCashTxn: any;

  constructor(public cashierService: CashierService, private clipBoard: Clipboard) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.filter = changes['filter'].currentValue;
      const getTransactionHistoryCash = this.cashierService
        .getTransactionHistoryCash(this.filter, this.type)
        .subscribe((resp: BaseResponse<Array<TransactionHistoryCash>>) => {
          this.cashTxnLists = new CashTHViewModel(undefined, resp.data);
        });
      this.subscriptions.push(getTransactionHistoryCash);
    }

    if (changes['type']) {
      const getTransactionHistoryCash = this.cashierService
        .getTransactionHistoryCash(this.filter, this.type)
        .subscribe((resp: BaseResponse<Array<TransactionHistoryCash>>) => {
          this.cashTxnLists = new CashTHViewModel(undefined, resp.data);
        });
      this.subscriptions.push(getTransactionHistoryCash);
    }
  }

  ngOnInit(): void {
    if (this.cashierService?.txnHistoryFrom?.toLocaleLowerCase() === 'cash') {
      [this.selectedTab] = this.subTab;
    } else {
      [, , this.selectedTab] = this.subTab;
    }
    this.selectedTab = CashierConstants.default_tab;
  }

  onSelectTab(sTab: string) {
    this.selectedTab = sTab;
    this.type = sTab;
    const getTransactionHistoryCash = this.cashierService
      .getTransactionHistoryCash(this.filter, this.selectedTab.toLowerCase())
      .subscribe((resp: BaseResponse<Array<TransactionHistoryCash>>) => {
        this.cashTxnLists = new CashTHViewModel(undefined, resp.data);
      });
    this.dualScreenMode.emit({
      component: CashierConstants.component,
      data: CashierConstants.close,
      from: CashComponent
    });
    this.subscriptions.push(getTransactionHistoryCash);
  }

  onSelectCashTxn(event: any) {
    this.selectedCashTxn = event;

    if (this.cashTxnLists.cashTxnHistory) {
      this.cashTxnLists.cashTxnHistory.forEach((item) => {
        const newItem = item;
        newItem.isSelected = false;
      });
    }

    this.selectedCashTxn.isSelected = true;
    this.dualScreenMode.emit({
      component: CashierConstants.component,
      data: event,
      from: CashComponent
    });
  }

  openFilter() {
    this.dualScreenMode.emit({
      component: CashierConstants.component2,
      data: CashierConstants.filter
    });
  }

  downloadCSV() {
    this.cashierService.downloadCSV('user/history/transaction', this.filter, this.type);
  }

  copyToClipboard(copiedText: string) {
    this.clipBoard.copy(copiedText);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

export class CashTHViewModel {
  cashTxnHistory: Array<CashTHModel>;

  constructor(cashTxnHistory?: Array<CashTHModel>, apiResponse?: Array<TransactionHistoryCash>) {
    if (cashTxnHistory) {
      this.cashTxnHistory = cashTxnHistory;
    } else {
      this.cashTxnHistory = this.getViewModelFromResponse(apiResponse);
    }
  }

  getViewModelFromResponse(apiResponse: Array<any> | undefined) {
    const result: Array<CashTHModel> = [];
    if (apiResponse && apiResponse.length > 0) {
      apiResponse.forEach((item: any) => {
        const cashTxn: CashTHModel = {
          referenceCode: `${item.id}`,
          date: item.addedOn,
          time: item.addedOn,
          bankUPI: `XXXX${item.accountNumber}`,
          amount: `${item.amount}`,
          paymentMethod:
            item.type === CashierConstants.withdraw
              ? `XXXX${item.accountNumber}`
              : `${item.paymentMode.replace('_', ' ')}`,
          status: item.type === CashierConstants.withdraw ? `${item.status}` : `${item.status}`,
          tdsDeducted: item.tdsDeducted,
          type: item.type,
          id: item.id.toString(),
          bonusCode: item.bonusCode,
          isSelected: false,
          currentStatus: item.currentStatus
        };
        result.push(cashTxn);
      });
    }

    return result;
  }
}

export interface CashTHModel {
  referenceCode: string;
  date: string;
  time: string;
  bankUPI: string;
  amount: string;
  paymentMethod: string;
  status: string;
  tdsDeducted: string;
  type: string;
  id: string;
  bonusCode: string;
  isSelected: boolean;
  currentStatus?: string;
}
