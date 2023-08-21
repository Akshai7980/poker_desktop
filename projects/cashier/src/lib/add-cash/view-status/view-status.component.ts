import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { CommonService } from 'projects/shared/src/lib/services/common.service';
import { Cashier } from '../../constants/app-constants';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class ViewStatusComponent implements OnInit, OnDestroy {
  trnxInfoAmount: number;

  trnxInfo: any = {};

  additionalMsg: any = {};

  bonusInfo: any = {};

  promoInfo: any = {};

  vipConMsg: any;

  trnxRefId: any;

  trnxTime: any;

  paymentMethod: any;

  subscriptions: Subscription[] = [];

  index: number = Cashier.STATIC_INDEX;

  constructor(
    private route: ActivatedRoute,
    private cashierService: CashierService,
    private router: Router,
    private clipBoard: Clipboard,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.clearFlow();
    const routeData = this.route.paramMap.subscribe((params: ParamMap) => {
      const paramValue = params.get('id');
      this.getTransactionStatus(paramValue);
    });
    this.subscriptions.push(routeData);
  }

  getTransactionStatus(idValue: any) {
    const transactionStatus = this.cashierService
      .getPaymentTransactionStatus(idValue)
      .subscribe((resp) => {
        this.trnxInfo = resp.data.transaction_info;
        this.trnxInfoAmount = this.trnxInfo.amount;
        this.trnxRefId = this.trnxInfo.refTxnId;
        this.trnxTime = this.trnxInfo.addedOn;
        this.paymentMethod = this.trnxInfo.paymentMode;
        this.additionalMsg = resp.data.additional_msg;
        this.bonusInfo = resp.data.bonus_info;
        this.promoInfo = resp.data.promo_bonus_info;
        this.vipConMsg = resp.data.vipConversionMsg;
      });
    this.subscriptions.push(transactionStatus);
  }

  onClickBack() {
    this.router.navigate(['/addcash']);
  }

  retryPayment() {
    this.router.navigate(['/addcash']);
  }

  copyToClipboard(copiedText: string) {
    this.clipBoard.copy(copiedText);
  }

  goToLobby() {
    if (window.opener) {
      const url = window.location.href;
      const redirectUrl = this.removeDynamicPath(url);
      window.opener.location.href = `${redirectUrl}/lobby/cash-games`;
    }
    window.close();
  }

  removeDynamicPath(url: string) {
    const dynamicPathRegex = /\/addcash\/payment-complete\/\d+/;
    const path = url.replace(dynamicPathRegex, '');
    return path;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
