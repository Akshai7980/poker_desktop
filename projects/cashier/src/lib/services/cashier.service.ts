import { Injectable } from '@angular/core';
import { RedeemScratchCodeModel } from 'projects/cashier/src/lib/models/view/redeem-scratch-code-model';
import environment from 'projects/shared/src/environments/environment';
import { APIMethod } from 'projects/shared/src/lib/constants/api-enum.constants';
import { BankListResponse } from 'projects/shared/src/lib/models/response/bank-list-response';
import {
  BaseResponse,
  CommonService,
  LocalStorageService,
  NetworkService
} from 'projects/shared/src/public-api';
import { Subject } from 'rxjs/internal/Subject';

import { KnowMoreResponse } from 'projects/shared/src/lib/models/response/know-more.response';
import { MatDialogRef } from '@angular/material/dialog';
import { CashierServiceModel } from '../components/models/cashier.model';
import { CASHIER } from '../constants/app-url.constants';
import { InitiatePurchaseRequest } from '../models/request/initiate-purchase.request';
import { RedeemScratchCardRequest } from '../models/request/redeem-scrtch-code.request.model';
import { ApplyDepositCodeResponse } from '../models/response/apply-deposit-code.response';
import { BonusHistoryResponse } from '../models/response/bonus-history.response.model';
import { BonusInfoData } from '../models/response/bonusInfoResponse.model';
import { CalculateTDSResponse } from '../models/response/calculate-tds.response';
import { CasiherDataResponse } from '../models/response/cashierdetails.response.model';
import { CashierInitDataResponse } from '../models/response/cashierInItData.response.model';
import { FreeRollChipsResponse } from '../models/response/freeClaimChips.reponse.model';
import { GetSavedCardsRes } from '../models/response/get-saved-cards-response';
import { InitiatePurchaseResponse } from '../models/response/initiate-purchase.reponse';
import { NewProfileResponseModel } from '../models/response/new-profile-response';
import { OfferListResponse } from '../models/response/offer-list.response';
import { OffersResponse } from '../models/response/offers.response.model';
import { PreTransactionCheckResponse } from '../models/response/pre-transaction-check.response';
import { PurchaseAmountOptionsResponse } from '../models/response/purchase-amount-options.response';
import { RedeemScratchCardResponse } from '../models/response/redeem-scratch-code.response.model';
import { RedeemableBalanceResponse } from '../models/response/redeemanleBalance.responce.model';
import { TicketInfoResponse } from '../models/response/ticket-info.response.model';
import { TransactionHistoryCash } from '../models/response/transaction-history.model';
import { WithheldListResponse } from '../models/response/withheld-list.response';
import { CashierWithdrawModel } from '../models/view/cashier-withdraw.model';
import { InitiatePurchaseModel } from '../models/view/initiate-purchase.model';
import { ReleaseUnite } from '../models/view/releaseunit.model';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  cashierCommonSubject = new Subject<CashierServiceModel>();

  private _hasSubscriber: boolean = false;

  deleteRequestStatus = new Subject();

  private pvtTxnHistoryFrom: string;

  private pvtRazorPayUrl: string;

  constructor(
    private readonly networkService: NetworkService,
    private readonly localStorageService: LocalStorageService,
    private commonService: CommonService
  ) {}

  public get txnHistoryFrom() {
    return this.pvtTxnHistoryFrom;
  }

  public set txnHistoryFrom(value: string) {
    this.pvtTxnHistoryFrom = value;
  }

  public get razorPayUrl() {
    return this.pvtRazorPayUrl;
  }

  public set razorPayUrl(url: string) {
    this.pvtRazorPayUrl = url;
  }

  subscribeToCashierSubject(): Subject<any> | undefined {
    if (!this._hasSubscriber) {
      this._hasSubscriber = true;
      return this.cashierCommonSubject;
    }
    return undefined;
  }

  // get Cashier data
  getCashierData() {
    return this.networkService.call<BaseResponse<CasiherDataResponse>>(
      environment.config.TOMCAT_HOST + CASHIER.CASHIER_DETAILS,
      APIMethod.GET
    );
  }

  // get releaseunitpgps data
  getReedmableBalance() {
    return this.networkService.call<BaseResponse<RedeemableBalanceResponse>>(
      environment.config.TOMCAT_HOST + CASHIER.REDEEMABLE_BALANCE,
      APIMethod.GET
    );
  }

  // To get Bonuses Info Details
  getBonusesInfo() {
    return this.networkService.call<BaseResponse<BonusInfoData>>(
      environment.config.TOMCAT_HOST + CASHIER.BONUSES_INFO,
      APIMethod.GET
    );
  }

  getCashierInITData() {
    return this.networkService.call<BaseResponse<CashierInitDataResponse>>(
      environment.config.TOMCAT_HOST + CASHIER.CASHIER_INIT_DATA,
      APIMethod.GET
    );
  }

  // get releaseunitpgps data
  getReleaseUnitPgpsData(viewModel: ReleaseUnite) {
    const bodyData = viewModel;
    const userData = this.commonService.getUserData();
    bodyData.userId = userData.userId;

    const url =
      `${environment.config.TOMCAT_HOST + CASHIER.USER_RELEASE_UNIT}?` +
      `userId=${bodyData.userId} &startDate=${bodyData.startDate}&endDate=${bodyData.endDate}`;
    return this.networkService.call<BaseResponse<CashierInitDataResponse>>(url, APIMethod.GET);
  }

  // get FAQ list
  getFaqData(section: string) {
    const url = `${environment.config.TOMCAT_HOST + CASHIER.FAQ_LIST}?section=${section}`;
    return this.networkService.call<BaseResponse<CashierInitDataResponse[]>>(url, APIMethod.GET);
  }

  // To get User FreeClaim Chips in Cashier
  getFreeClaimChips() {
    return this.networkService.call<BaseResponse<FreeRollChipsResponse>>(
      `${environment.config.TOMCAT_HOST + CASHIER.RELOAD_FREE_ROLL}?platform=web`,
      APIMethod.GET
    );
  }

  verifyScratchCard(viewModel: RedeemScratchCodeModel) {
    const bodyData = viewModel.getRequestModel();
    const redeemScratchCard = this.networkService.call<
      RedeemScratchCardRequest,
      BaseResponse<RedeemScratchCardResponse>
    >(
      environment.config.TOMCAT_HOST + CASHIER.SCRATCH_CODE_APPLY,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return redeemScratchCard;
  }

  getTransactionHistoryCash(dateRange = '15', type = 'all') {
    let updatedType = type;

    if (type.toLowerCase() === 'withdrawal') {
      updatedType = 'withdraw';
    }

    const url = `${
      environment.config.TOMCAT_HOST + CASHIER.TRANSACTION_HISTORY_CASH
    }?dateRange=${dateRange}&type=${updatedType.toLowerCase()}`;
    return this.networkService.call<BaseResponse<Array<TransactionHistoryCash>>>(
      url,
      APIMethod.GET,
      new Map<string, string>()
    );
  }

  getStatusOfTransaction(transactionId: string) {
    const url =
      environment.config.TOMCAT_HOST +
      CASHIER.TRANSACTION_STATUS.replace('{redeemId}', transactionId);
    return this.networkService.call<any>(url, APIMethod.GET, new Map<string, string>());
  }

  downloadCSV(val: string, rang: string, type?: string) {
    let fileType = type;
    let fileRange = rang;

    if (type === undefined) {
      fileType = 'all';
    }

    if (rang === undefined) {
      fileRange = '15';
    }

    fileType = fileType ? fileType.toLowerCase() : '';

    if (fileType === 'withdrawal') {
      fileType = 'withdraw';
    }

    this.networkService.downloadFile(
      environment.config.TOMCAT_HOST +
        CASHIER.DOWNLOAD_URL.replace('{val}', val)
          .replace('{range}', fileRange)
          .replace('{type}', fileType)
          .replace('{token}', this.localStorageService.getItem('token'))
    );
  }

  cancelRequest(redeemId: string) {
    const bodyData = { redeemId };
    return this.networkService.call<any, BaseResponse<any>>(
      environment.config.TOMCAT_HOST + CASHIER.CANCEL_REQUEST,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
  }

  // get offers data
  getTicketOffers() {
    return this.networkService.call<BaseResponse<OffersResponse[]>>(
      environment.config.TOMCAT_HOST + CASHIER.TICKET_OFFERS,
      APIMethod.GET
    );
  }

  // get ticket info
  getTicketInfo() {
    const url = 'https://fullhouseadminpanel.adda52poker.com/adminPanelService';
    return this.networkService.call<BaseResponse<TicketInfoResponse>>(
      url + CASHIER.TICKET_INFO,
      APIMethod.GET
    );
  }

  // bonus history data
  bonusHistoryData(dateRange = '15') {
    return this.networkService.call<BaseResponse<BonusHistoryResponse[]>>(
      `${environment.config.TOMCAT_HOST + CASHIER.BONUS_HISTORY}?dateRange=${dateRange}`,
      APIMethod.GET
    );
  }

  getPurchaseNowSufficientBalance(offerId: any) {
    return this.networkService.call<BaseResponse<any>>(
      `${
        environment.config.TOMCAT_HOST + CASHIER.PURCHASE_NOW_WITH_SUFFICIENT_BALANCE
      }?offerId=${offerId}`,
      APIMethod.GET
    );
  }

  downloadBonusCSV(rang: any) {
    let updatedRang = rang;
    if (updatedRang === undefined) {
      updatedRang = '15';
    }
    this.networkService.downloadFile(
      environment.config.TOMCAT_HOST +
        CASHIER.DOWNLOAD_BONUS_URL.replace('{range}', updatedRang).replace(
          '{token}',
          this.localStorageService.getItem('token')
        )
    );
  }

  // get purchase amount options
  getPurchaseAmountOptions() {
    return this.networkService.call<BaseResponse<PurchaseAmountOptionsResponse>>(
      environment.config.TOMCAT_HOST + CASHIER.PURCHASE_AMOUNT_OPTIONS,
      APIMethod.GET
    );
  }

  calculateTds(amt: any, redeemId: any) {
    if (redeemId) {
      return this.networkService.call<BaseResponse<CalculateTDSResponse>>(
        `${
          environment.config.TOMCAT_HOST + CASHIER.WITHDRAWAL_INFO_TDS_CALC
        }?amt=${amt}&redeemId=${redeemId}`,
        APIMethod.GET
      );
    }
    return this.networkService.call<BaseResponse<CalculateTDSResponse>>(
      `${environment.config.TOMCAT_HOST + CASHIER.WITHDRAWAL_INFO_TDS_CALC}?amt=${amt}`,
      APIMethod.GET
    );
  }

  withdrawAmount(viewModel: CashierWithdrawModel) {
    const bodyData = viewModel.getRequestModel();
    const withdrawAmount = this.networkService.call<any, BaseResponse<any>>(
      environment.config.TOMCAT_HOST + CASHIER.REDEEM_BANK_PROCESS,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return withdrawAmount;
  }

  getDefaultBank() {
    return this.networkService.call<BaseResponse<any>>(
      environment.config.TOMCAT_HOST + CASHIER.DEFAULT_BANK,
      APIMethod.GET
    );
  }

  // get withheld deposit list
  getWithheldDepositList(page: any) {
    return this.networkService.call<BaseResponse<WithheldListResponse>>(
      `${environment.config.TOMCAT_HOST + CASHIER.WITHHELD_DEPOSIT_LIST}?page=${page}`,
      APIMethod.GET
    );
  }

  // New Profile API
  createNewProfile() {
    return this.networkService.call<BaseResponse<NewProfileResponseModel>>(
      environment.config.TOMCAT_HOST + CASHIER.NEW_PROFILE,
      APIMethod.GET
    );
  }

  getKycDetails() {
    return this.networkService.call<BaseResponse<NewProfileResponseModel>>(
      environment.config.TOMCAT_HOST + CASHIER.KYC_DETAILS,
      APIMethod.GET
    );
  }

  // get pre transaction check
  getPreTransactionCheck() {
    return this.networkService.call<BaseResponse<PreTransactionCheckResponse>>(
      environment.config.TOMCAT_HOST + CASHIER.PRE_TRANSACTION_CHECK,
      APIMethod.GET
    );
  }

  // initiate purchase
  initiatePurchase(viewModel: InitiatePurchaseModel) {
    const bodyData = viewModel.getRequestModel();
    const initiatePurchase = this.networkService.call<
      InitiatePurchaseRequest,
      BaseResponse<InitiatePurchaseResponse>
    >(
      environment.config.TOMCAT_HOST + CASHIER.INITIATE_PURCHASE,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return initiatePurchase;
  }

  // get offer list
  getOfferList(amount: any) {
    return this.networkService.call<BaseResponse<OfferListResponse>>(
      `${environment.config.TOMCAT_HOST + CASHIER.OFFER_LIST}?amount=${amount}`,
      APIMethod.GET
    );
  }

  applyDepositCode(bonusCode: any, amount: any, txnHistoryId: any, purchaseFrom: any) {
    return this.networkService.call<BaseResponse<ApplyDepositCodeResponse>>(
      `${
        environment.config.TOMCAT_HOST + CASHIER.APPLY_DEPOSIT_CODE
      }?bonusCode=${bonusCode}&amount=${amount}&txnHistoryId=${txnHistoryId}&purchaseFrom=${purchaseFrom}`,
      APIMethod.GET
    );
  }

  getPaymentTransactionStatus(id: any) {
    return this.networkService.call<BaseResponse<any>>(
      `${environment.config.TOMCAT_HOST + CASHIER.PAYMENT_TXN_STATUS}?txnId=${id}`,
      APIMethod.GET,
      new Map<string, string>()
    );
  }

  // To get Saved Card details fo the user
  getSavedCards() {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<GetSavedCardsRes>>(
      environment.config.TOMCAT_HOST + CASHIER.GET_SAVED_CARDS,
      APIMethod.GET,
      token
    );
  }

  // bank-list
  getBankList() {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<BankListResponse>>(
      environment.config.TOMCAT_HOST + CASHIER.BANK_LIST,
      APIMethod.GET,
      token
    );
  }

  // know more
  getKnowMoreData() {
    return this.networkService.call<BaseResponse<Array<KnowMoreResponse>>>(
      environment.config.TOMCAT_HOST + CASHIER.KNOW_MORE,
      APIMethod.GET
    );
  }

  // Add/Remove Animation Class on/and Dialog Close
  toggleAnimationDialog<T>(dialogRef: MatDialogRef<T>) {
    dialogRef.addPanelClass('dialog-slide-out-right');
    dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      dialogRef.close();
    }, 350);
  }
}
