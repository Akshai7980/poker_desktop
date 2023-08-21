import { CashierConstants } from '../../constants/app-constants';
import { InitiatePurchaseRequest } from '../request/initiate-purchase.request';

export class InitiatePurchaseModel {
  amount: number;

  bonusCode: string;

  purchaseFrom: string;

  redirectUrl: string;

  referralUrl: string;

  url2: string;

  userId: number;

  clear() {
    this.amount = 0;
    this.bonusCode = '';
    this.purchaseFrom = '';
    this.redirectUrl = '';
    this.url2 = '';
    this.referralUrl = '';
    this.userId = 0;
  }

  getRequestModel(): InitiatePurchaseRequest {
    const { ngnxPokerDesktop } = CashierConstants;
    const initiatePurchase: InitiatePurchaseRequest = {
      amount: this.amount,
      purchaseFrom: ngnxPokerDesktop,
      redirectUrl: `${window.location.href}/payment-complete/`,
      userId: this.userId,
      bonusCode: this.bonusCode
    };

    return initiatePurchase;
  }
}
