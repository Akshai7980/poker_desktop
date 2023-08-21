import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import environment from 'projects/shared/src/environments/environment';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  BaseResponse,
  CommonService,
  DataStorage,
  GlobalConstant,
  LocalStorageService,
  MessageConstant,
  SfsCommService,
  SfsRequestService,
  SpinnerService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs/internal/Subscription';
import { Cashier, CashierConstants, Paths, ScreenId, ToastTime } from '../constants/app-constants';
import { ApplyDepositCodeResponse } from '../models/response/apply-deposit-code.response';
import { CasiherDataResponse } from '../models/response/cashierdetails.response.model';
import { InitiatePurchaseResponse } from '../models/response/initiate-purchase.reponse';
import { OfferListResponse } from '../models/response/offer-list.response';
import { PreTransactionCheckResponse } from '../models/response/pre-transaction-check.response';
import { PurchaseAmountOptionsResponse } from '../models/response/purchase-amount-options.response';
import { InitiatePurchaseModel } from '../models/view/initiate-purchase.model';
import { CashierService } from '../services/cashier.service';
import { ViewAppliedSuccessfullyComponent } from './view-applied-successfully/view-applied-successfully.component';

interface PurchaseData {
  code: number;
  data: Object;
  message: string;
}

interface ListElement {
  hot: boolean;
  value: number;
}

@Component({
  selector: 'app-add-cash',
  templateUrl: './add-cash.component.html',
  styleUrls: ['./add-cash.component.scss']
})
export class AddCashComponent implements OnInit, OnDestroy {
  applied: boolean = false;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  purchaseAmountOptionsList: Array<any>;

  preTransactionCheckList: PreTransactionCheckResponse;

  private dataStorage = DataStorage.getInstance();

  sidedatasts: string;

  appliedCode: string;

  appliedPromotionTxt: string;

  appliedMsg: string;

  appliedOfferTxt: string;

  assetsImagePath = Paths.imagePath;

  addCashForm: FormGroup = new FormGroup({});

  addDepositForm: FormGroup = new FormGroup({});

  addDepositForms: FormGroup = new FormGroup({});

  selectedAmount: number;

  disableAddMoney: boolean = false;

  totalAmount: number = 0;

  userId: number;

  offerList: any;

  yourOffers: any;

  enteredCode: string;

  enableApply: boolean = false;

  viewBonusCode: string;

  viewOfferTxt: string;

  viewMsg: string;

  viewPromotionTxt: string;

  invalidError: boolean = false;

  showViewOfferSection: boolean;

  allOffers: any;

  depositCodeRes: any;

  changeAppliedCode: string;

  showApply: boolean;

  applyClicked: boolean = false;

  subscriptions: Subscription[] = [];

  showNotAllowed: boolean = false;

  invalidMessage: string;

  initiatePurchaseData: PurchaseData;

  selectedAmountBox: number;

  isValid: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    public readonly dialog: MatDialog,
    public readonly cashierService: CashierService,
    private readonly sfsRequestService: SfsRequestService,
    public userPreferencesService: UserPreferencesService,
    private readonly sfsCommService: SfsCommService,
    private readonly spinnerService: SpinnerService,
    private readonly localStorageService: LocalStorageService,
    private readonly commonService: CommonService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.addCashForm = this.formBuilder.group({
      enteredAmount: [GlobalConstant.CASHIER.ADD_CASH_AMOUNT, [Validators.required]]
    });

    this.addDepositForm = this.formBuilder.group({
      enteredCode: ['', [Validators.required]]
    });

    this.addDepositForms = this.formBuilder.group({
      enteredCode: ['', [Validators.required]]
    });

    const userData = this.localStorageService.getItem('uname');
    this.userId = userData?.userId;
    this.spinnerService.open();
    window.addCashChildWindow = {
      setData: this.setData.bind(this),
      setCashData: this.setCashData.bind(this),
      setUserPreference: this.setUserPreference.bind(this),
      setSmartFox: this.setSmartFox.bind(this)
    };
    this.getPurchaseAmountOptions();
    this.getOfferLists();
    this.triggerLoadEventToParent();

    const openerUrl = window.opener ? window.opener.location.href : null;
    const param = this.activatedRoute?.snapshot?.queryParams['dialog'];
    const { myOffers } = CashierConstants;

    if (openerUrl && openerUrl.includes('dialog') && param) {
      const data = JSON.parse(param);

      if (data && data.from === myOffers) {
        const offerAmount = this.commonService.formatAmount(data.offerPrice);

        this.addCashForm = this.formBuilder.group({
          enteredAmount: [offerAmount]
        });
        this.addCashForm.controls['enteredAmount'].setValue(offerAmount);
      }
    } else {
      this.getCashierData();
      this.getPreTransactionCheck();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const overlay = clickedElement.classList.contains('open-survey-track');
    if (overlay) {
      this.renderer.removeClass(document.body, 'open-survey-track');
    }
  }

  triggerLoadEventToParent() {
    const loadEvent = new CustomEvent('ngLoad');
    window.dispatchEvent(loadEvent);
  }

  setData(dataStorage: DataStorage) {
    this.sfsRequestService.setDataStorageObject(dataStorage);
    this.dataStorage = dataStorage;
  }

  setCashData(amount: number) {
    this.totalAmount = amount;
  }

  private setSmartFox(smartfox: any, childSFS2X: any) {
    this.dataStorage.sfs2X = childSFS2X;
    this.sfsCommService.removeSfsListeners();
    this.sfsCommService.sfs = smartfox;
    this.dataStorage.sfs = smartfox;
    this.sfsCommService.addSfsListeners();

    const timeoutVar = setTimeout(() => {
      this.sfsRequestService.getHotKeysData();
      this.spinnerService.close();
      this.spinnerService.resetSpinnerData();
      clearTimeout(timeoutVar);
    }, 1000);
  }

  setUserPreference(userPreferencesService: UserPreferencesService) {
    this.userPreferencesService = userPreferencesService;
  }

  onClickAmount(amount: number, amountIndex: number) {
    this.selectedAmountBox = amountIndex;
    this.selectedAmount = amount;
    this.addCashForm.controls['enteredAmount'].setValue(this.selectedAmount);
    if (
      this.selectedAmount < GlobalConstant.CASHIER.ADD_CASH_MIN_VAL ||
      this.selectedAmount > GlobalConstant.CASHIER.ADD_CASH_MAX_VAL
    ) {
      this.disableAddMoney = true;
    } else {
      this.disableAddMoney = false;
    }
  }

  viewOffers(code?: string) {
    this.enteredCode = '';
    this.invalidError = false;
    this.showViewOfferSection = true;
    this.changeAppliedCode = code ?? '';
    this.showApply = false;
    this.getOfferLists();
  }

  viewStatus() {
    this.router.navigate(['/addcash/view-status']);
  }

  viewAppliedSuccessfully(code?: string) {
    this.appliedCode = code ?? '';
    this.changeAppliedCode = code ?? '';
    const dialogRef = this.dialog.open(ViewAppliedSuccessfullyComponent, {
      data: { bonusCode: code },
      disableClose: true,
      width: '300px',
      height: '242px',
      panelClass: 'custom-dialog-success'
    });
    const dialogData = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applied = true;
      }
    });
    this.subscriptions.push(dialogData);

    const timeoutVar = setTimeout(() => {
      dialogRef.close();
      clearTimeout(timeoutVar);
    }, ToastTime.NOTIFICATION);
  }

  onAmountChange(event: Event) {
    const { enteredAmount } = CashierConstants;
    const amountStr: string = (event.target as HTMLInputElement).value?.toString() ?? '0';
    const amount: number = Number(amountStr?.split(',').join(''));
    const amt = this.commonService.formatAmount(parseInt(amount.toString(), 10));

    if (!amountStr) {
      this.isValid = false;
      this.addCashForm.controls['enteredAmount'].setValue('');
    } else if (amount <= GlobalConstant.CASHIER.ADD_CASH_MAX_VAL) {
      this.isValid = true;
      this.addCashForm.controls['enteredAmount'].setValue(amt);
    }

    if (
      amount < GlobalConstant.CASHIER.ADD_CASH_MIN_VAL ||
      amount > GlobalConstant.CASHIER.ADD_CASH_MAX_VAL
    ) {
      if (amount > GlobalConstant.CASHIER.ADD_CASH_MAX_VAL) {
        this.addCashForm.controls['enteredAmount'].setValue(enteredAmount);
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.TransactionMaxDepositLimit.replace('{{amount}}', enteredAmount),
          flag: CashierConstants.errorFlag
        };
        this.disableAddMoney = false;
        return;
      }
      this.disableAddMoney = true;
    } else {
      this.disableAddMoney = false;
    }
  }

  getCashierData() {
    const getCashierData$ = this.cashierService.getCashierData();
    const getCashierData: Subscription = getCashierData$.subscribe({
      next: (res: BaseResponse<CasiherDataResponse>) => {
        this.totalAmount = res.data.total;
        window.opener.postMessage('Call Cahier', window.location.origin);
      },
      error: () => {
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: CashierConstants.errorFlag
        };
      }
    });
    this.subscriptions.push(getCashierData);
  }

  getPurchaseAmountOptions() {
    const getPurchaseAmountOptionsData$ = this.cashierService.getPurchaseAmountOptions();
    const getPurchaseAmountOptionsData: Subscription = getPurchaseAmountOptionsData$.subscribe({
      next: (res: BaseResponse<PurchaseAmountOptionsResponse>) => {
        const amount = res.data.list;
        const purchaseAmountOptionsList: ListElement[] = [];
        amount.forEach((element) => {
          if (element.hot) {
            purchaseAmountOptionsList.push({
              value: element.value,
              hot: element.hot
            });
          }
        });
        this.purchaseAmountOptionsList = purchaseAmountOptionsList;
        this.selectedAmountBox = this.purchaseAmountOptionsList.findIndex(
          (value: ListElement) => value.hot
        );
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: CashierConstants.errorFlag
        };
      }
    });

    this.subscriptions.push(getPurchaseAmountOptionsData);
  }

  getPreTransactionCheck() {
    const getPreTransactionCheckData$ = this.cashierService.getPreTransactionCheck();
    const getPreTransactionCheckData: Subscription = getPreTransactionCheckData$.subscribe({
      next: (res: BaseResponse<PreTransactionCheckResponse>) => {
        this.preTransactionCheckList = res.data;
        this.selectedAmount = this.preTransactionCheckList.amount;
        const amount = this.commonService.formatAmount(this.selectedAmount);
        this.addCashForm.controls['enteredAmount'].setValue(amount);
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: CashierConstants.errorFlag
        };
      }
    });

    this.subscriptions.push(getPreTransactionCheckData);
  }

  onAddCash() {
    if (this.preTransactionCheckList?.responsibleGaming?.isExcluded) {
      const respMessage = this.preTransactionCheckList?.responsibleGaming?.msg;
      this.showNotAllowed = true;
      this.renderer.addClass(document.body, 'open-survey-track');
      this.invalidMessage = respMessage;
      this.viewMsg = '';
      this.sidedatasts = '';
      return;
    }

    this.showNotAllowed = false;
    const initiatePurchase = new InitiatePurchaseModel();

    initiatePurchase.clear();

    const typeOfVal: string = typeof this.addCashForm.controls['enteredAmount'].value;
    initiatePurchase.amount =
      typeOfVal !== 'number'
        ? this.addCashForm.controls['enteredAmount'].value.split(',').join('')
        : this.addCashForm.controls['enteredAmount'].value;
    initiatePurchase.userId = this.userId;
    initiatePurchase.bonusCode = this.appliedCode;

    const initiatePurchaseData$ = this.cashierService.initiatePurchase(initiatePurchase);
    const initiatePurchaseData: Subscription = initiatePurchaseData$.subscribe({
      next: (res: BaseResponse<InitiatePurchaseResponse>) => {
        this.initiatePurchaseData = res;
        if (res.code === Cashier.SUCCESS) {
          this.showNotAllowed = false;
          this.localStorageService.setItem('flow', 'addCash');
          this.cashierService.razorPayUrl = res.data.payload.payment_links.web;
          this.commonService.navigateTo(ScreenId.RAZOR_PAY);
        } else {
          this.showNotAllowed = true;
          this.renderer.addClass(document.body, 'open-survey-track');
          this.invalidMessage = res.message;
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
    this.subscriptions.push(initiatePurchaseData);
  }

  showModal(bonusCode: string, offerTxt: string, msg: string, promotionTxt: string) {
    if (bonusCode) {
      this.viewBonusCode = bonusCode;
      this.viewOfferTxt = offerTxt;
      this.viewMsg = msg;
      this.viewPromotionTxt = promotionTxt;
      this.invalidMessage = '';
      this.showNotAllowed = false;
      this.renderer.addClass(document.body, 'open-survey-track');
    }
  }

  closeModal() {
    this.renderer.removeClass(document.body, 'open-survey-track');
  }

  getOfferLists() {
    const typeOfVal: string = typeof this.addCashForm.controls['enteredAmount'].value;
    const getOfferListData$ = this.cashierService.getOfferList(
      typeOfVal !== 'number'
        ? this.addCashForm.controls['enteredAmount'].value.split(',').join('')
        : this.addCashForm.controls['enteredAmount'].value
    );
    const getOfferListData: Subscription = getOfferListData$.subscribe({
      next: (res: BaseResponse<OfferListResponse>) => {
        this.offerList = res.data;
        this.yourOffers = this.offerList?.bonusCodesForYou;
        this.allOffers = this.offerList.bonusCodesForAll;
        if (res.data?.amountOption) {
          res.data?.amountOption.forEach((element) => {
            const isDuplicate = this.purchaseAmountOptionsList.some(
              (item) => item.value === element
            );

            if (!isDuplicate) {
              this.purchaseAmountOptionsList.push({
                value: element,
                hot: false
              });
            }
          });
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
    this.subscriptions.push(getOfferListData);
  }

  applyDepositCode(code?: string, promotionTxt?: string, msg?: string, offerTxt?: string) {
    this.appliedMsg = msg ?? '';
    this.appliedOfferTxt = offerTxt ?? '';
    if (code === CashierConstants.enterCode || code === CashierConstants.offerList) {
      this.applyClicked = false;
    } else {
      this.applyClicked = true;
    }
    const typeOfVal: string = typeof this.addCashForm.controls['enteredAmount'].value;
    const applyDepositCodeData$ = this.cashierService.applyDepositCode(
      code === CashierConstants.enterCode || code === CashierConstants.offerList
        ? this.enteredCode
        : code,
      typeOfVal !== 'number'
        ? this.addCashForm.controls['enteredAmount'].value.split(',').join('')
        : this.addCashForm.controls['enteredAmount'].value,
      -1,
      environment.config.DESK_APP_NAME
    );
    const applyDepositCodeData: Subscription = applyDepositCodeData$.subscribe({
      next: (res: BaseResponse<ApplyDepositCodeResponse>) => {
        if (res.code === Cashier.SUCCESS) {
          this.showViewOfferSection = false;
          this.viewAppliedSuccessfully(
            code === CashierConstants.enterCode || code === CashierConstants.offerList
              ? this.enteredCode
              : code
          );
          this.depositCodeRes = res.data;
          this.applied = true;
          this.invalidError = false;
          this.appliedCode = this.enteredCode ? this.enteredCode : code ?? '';
          this.appliedPromotionTxt = promotionTxt ?? '';
          const tempArr = [...this.yourOffers, ...this.allOffers];
          for (let i = 0; i < tempArr.length; i += 1) {
            const element = tempArr[i];
            if (element.bonusCode.toLowerCase() === this.appliedCode.toLowerCase()) {
              this.appliedPromotionTxt = element.promotion_text;
              break;
            }
          }
        } else if (res.message === 'Invalid promo code.') {
          this.isShowToast = false;
          this.invalidError = true;
        } else if (res.code === Cashier.AMOUNT_INSUFFICIENT) {
          this.applied = false;
          this.invalidError = false;
          this.isShowToast = true;
          this.toastValue = {
            message: res?.message,
            flag: CashierConstants.errorFlag
          };
        } else {
          this.applied = false;
          this.invalidError = false;
          this.isShowToast = true;
          this.toastValue = {
            message: res?.message,
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
    this.subscriptions.push(applyDepositCodeData);
  }

  changeCode() {
    this.enteredCode = '';
    this.applied = false;
    this.appliedCode = '';
  }

  enterCode(event: Event) {
    this.invalidError = false;
    if ((event.target as HTMLInputElement).value.length > 0) {
      this.enableApply = true;
      this.applyClicked = false;
    }
  }

  backTo() {
    this.enteredCode = '';
    this.showViewOfferSection = false;
    this.invalidError = false;
  }

  gotoUpdate() {
    this.showNotAllowed = false;
    this.renderer.removeClass(document.body, 'open-survey-track');
    const event = new Event('windowClosing');
    window.dispatchEvent(event);
    const url = window.location.href;
    const path = url.replace('/addcash', '');

    if (this.preTransactionCheckList?.responsibleGaming?.isExcluded && window.opener) {
      window.opener.location.href = `${path}/responsible-gaming/self-exclusion`;
      window.close();
    } else if (this.initiatePurchaseData.code === Cashier.MAX_LIMIT_EXCEED && window.opener) {
      window.opener.location.href = `${path}/responsible-gaming/deposit-limit`;
      window.close();
    } else {
      window.opener.location.href = `${path}/responsible-gaming/deposit-limit`;
      window.close();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
