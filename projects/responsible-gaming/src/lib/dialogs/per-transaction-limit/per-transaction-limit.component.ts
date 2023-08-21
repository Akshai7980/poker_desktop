import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse } from 'projects/shared/src/lib/models/common/base-response.model';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { FLAG, MessageConstant, ToastTime } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import {
  Paths,
  REGEX_EXPRESSIONS,
  RegexToUnFormatAmount,
  RESPONSIBLE_GAMING,
  ResponsibleGameTab,
  RG_SIT_N_GO
} from '../../constants/app-constants';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { DepositLimitOptions } from '../../models/core-model';
import { SendConfirmationOtpResponse } from '../../models/response/send-confirmation-otp.response.model';
import { ValidateSavedDataResponseModel } from '../../models/response/validate-save-data.response.model';
import { VerifyEnteredOtpResponse } from '../../models/response/verify-entered-otp.response.model';
import { SendConfirmationOtpModel } from '../../models/view/send-confirmation-otp.view.model';
import { ValidateSaveDataModel } from '../../models/view/validate-save-data.view.model';
import { VerifyEnteredOtpModel } from '../../models/view/verify-entered-otp.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

interface DialogData {
  dailyLimit: number;
  dailyLimitCount: string;
  dailyLimitAmount: number;
  weeklyLimit: string;
  weeklyLimitCount: string;
  perTransactionLimit: string;
}
@Component({
  selector: 'app-per-transaction-limit',
  templateUrl: './per-transaction-limit.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class PerTransactionLimitComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  activeTemplate = ResponsibleGameTab.ACTIVE_TEMPLATE;
  showOtpButton: boolean;
  isDisabledResend: boolean = true;
  isResetOtpForm: boolean = false;
  showResendOtpButton: boolean = false;
  timeLeft: number = ToastTime.TIME_LEFT_300;
  min: string | number;
  sec: string | number;
  perTransaction: string = '';
  @ViewChild('yesBtn') yesBtn: ElementRef<HTMLButtonElement>;
  isShowToast: boolean;
  toastValue: ToastModel;
  subscriptions: Subscription[] = [];
  maskedPhoneNumber: string;
  isClickedResend: boolean = false;
  showError: boolean = false;
  isValidAmount: boolean = false;
  parsedAmount: number;
  otpNumber: string = '';
  existingAmount: string;
  otpTimer: ReturnType<typeof setInterval> | undefined;
  disableApply: boolean = false;
  isErrorFlag: boolean | undefined;
  amount: number = 0;
  resendEnablingTime: number = ToastTime.TIME_LEFT_290;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: DialogData,
    private readonly dialogRef: MatDialogRef<PerTransactionLimitComponent>,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {
    const perTransaction = `₹ ${Number(data.perTransactionLimit).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;

    this.existingAmount = perTransaction;
    this.amount = parseInt(perTransaction.replace(RegexToUnFormatAmount.pattern, ''), 10);
    this.perTransaction = perTransaction;
    this.parsedAmount = Number(this.data.perTransactionLimit);
  }

  startTimer() {
    const initialTime = 5 * 60;
    this.timeLeft = initialTime;
    this.isDisabledResend = true;

    const updateTimer = () => {
      if (this.timeLeft >= 0) {
        const m: number = Math.floor(this.timeLeft / 60);
        const s: number = this.timeLeft % 60;
        this.min = m < 10 ? `0${m}` : m;
        this.sec = s < 10 ? `0${s}` : s;
        if (m === 0 && s === 0) {
          this.showResendOtpButton = true;
        }

        if (this.timeLeft === this.resendEnablingTime) {
          this.isDisabledResend = false;
        }

        this.timeLeft -= 1;
      }
    };

    updateTimer();
    this.otpTimer = setInterval(updateTimer, ToastTime.ONESECOND);
  }

  onOtpChange(otp: string) {
    this.otpNumber = otp;
    if (otp.length === 6 && this.timeLeft > 0) {
      this.showOtpButton = true;
    } else this.showOtpButton = false;
  }

  clickResendOtp() {
    if (this.isDisabledResend) return;
    this.isResetOtpForm = true;
    this.timeLeft = 0;
    this.isClickedResend = true;
    this.showOtpButton = false;
    this.onClickYes();
  }

  onVerifyAmount(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showError = false;
    let amount = target.value ? target.value : RG_SIT_N_GO.LIMIT_ZERO.toString();
    amount = amount.replace(RegexToUnFormatAmount.pattern, '');

    if (amount === RG_SIT_N_GO.LIMIT_ZERO.toString()) {
      amount = RG_SIT_N_GO.LIMIT_ZERO.toString();
    } else if (amount.length > RG_SIT_N_GO.LIMIT_SIX) {
      target.value = `₹ ${amount.slice(0, 6)}`;
    }

    this.parsedAmount = parseInt(amount, 10);

    if (`${amount}`.trim() === `₹` || `${amount}`.trim() === `₹ 0`) {
      this.perTransaction = '';
    } else {
      this.perTransaction = amount;
    }

    if (!Number.isNaN(this.parsedAmount) && this.parsedAmount > -1) {
      const formattedAmount = `₹ ${this.parsedAmount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`;
      this.perTransaction = formattedAmount;
      this.disableApply = false;
    } else if (Number.isNaN(this.parsedAmount)) {
      this.disableApply = true;
    }
  }

  onSubmit() {
    const amountString = this.perTransaction;
    const amountNumber = amountString.replace(RegexToUnFormatAmount.amountPattern, '');
    const verifyEnteredOtp = new VerifyEnteredOtpModel();

    verifyEnteredOtp.clear();

    verifyEnteredOtp.otp = this.otpNumber;
    verifyEnteredOtp.saveData = {
      tab: ResponsibleGameTab.PER_TXN_LIMIT,
      settings: [
        {
          values: [amountNumber],
          prop: ResponsibleGameTab.PROP_AMOUNT
        }
      ]
    };
    verifyEnteredOtp.tab = ResponsibleGameTab.PER_TXN_LIMIT;

    const verifyOtp = this.responsibleGamingService
      .verifyEnteredOtp(verifyEnteredOtp)
      .subscribe((res: CustomBaseResponse<VerifyEnteredOtpResponse>) => {
        if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
          if (res.respData.code === RESPONSIBLE_GAMING.VALID_OTP) {
            this.isErrorFlag = false;
            this.dialogRef.close({
              status: FLAG.success,
              DEPOSIT_LIMIT_OPTIONS: DepositLimitOptions.PER_TRANSACTION
            });
          } else if (
            res.respData.code === RESPONSIBLE_GAMING.NO_CHANGE ||
            res.respData.code === RESPONSIBLE_GAMING.NOT_VALID ||
            res.respData.code === RESPONSIBLE_GAMING.INVALID_INPUT
          ) {
            this.isErrorFlag = true;
            this.otpNumber = '';
            this.isResetOtpForm = true;
            this.showOtpButton = false;

            const timeOut = setTimeout(() => {
              this.isErrorFlag = undefined;
              clearInterval(timeOut);
            }, ToastTime.NOTIFICATION);

            this.showToast(MessageConstant.ApiError, FLAG.error);
          } else if (res.respData.code === RESPONSIBLE_GAMING.INVALID_OTP) {
            this.isErrorFlag = true;
            this.otpNumber = '';
            this.isResetOtpForm = true;
            this.showOtpButton = false;

            const timeOut = setTimeout(() => {
              this.isErrorFlag = undefined;
              clearInterval(timeOut);
            }, ToastTime.NOTIFICATION);

            this.showToast(MessageConstant.invalidOTPMsg, FLAG.error);
          } else {
            this.isResetOtpForm = true;
            this.showToast(MessageConstant.invalidOTPMsg, FLAG.error);
          }
        }
      });
    this.subscriptions.push(verifyOtp);
  }

  showToast(message: string, flag: string) {
    this.isShowToast = true;
    this.toastValue = {
      message,
      flag
    };
  }

  onClickApply() {
    const amountString = this.perTransaction;
    const amountNumber = amountString.replace(RegexToUnFormatAmount.amountPattern, '');

    const dailyLimit = Number(this.data.dailyLimit);
    const weeklyLimit = Number(this.data.weeklyLimit);

    let toastMessage: string = '';
    this.showError = false;
    this.isValidAmount = true;
    this.isShowToast = false;

    if (this.parsedAmount > weeklyLimit || this.parsedAmount > dailyLimit) {
      this.showError = true;
      [toastMessage] = Object.values(MessageConstant.perTransactionLimit);
      this.isShowToast = true;
    } else if (this.parsedAmount === RG_SIT_N_GO.LIMIT_ZERO) {
      this.showError = true;
      [, toastMessage] = Object.values(MessageConstant.perTransactionLimit);
      this.isShowToast = true;
    } else if (
      this.parsedAmount > RG_SIT_N_GO.LIMIT_ZERO &&
      this.parsedAmount < RESPONSIBLE_GAMING.MIN_LIMIT_VALUE
    ) {
      this.showError = true;
      [, , toastMessage] = Object.values(MessageConstant.perTransactionLimit);
      this.isShowToast = true;
    } else if (this.parsedAmount >= RESPONSIBLE_GAMING.MAX_LIMIT_VALUE) {
      this.showError = true;
      [, , , toastMessage] = Object.values(MessageConstant.perTransactionLimit);
      this.isShowToast = true;
    }

    if (this.isShowToast) {
      this.toastValue = {
        message: toastMessage,
        flag: FLAG.error
      };
    }

    if (this.isValidAmount && !this.showError) {
      const validateSaveDataModel = new ValidateSaveDataModel();

      validateSaveDataModel.clear();

      validateSaveDataModel.clientTab = null;
      validateSaveDataModel.tab = ResponsibleGameTab.PER_TXN_LIMIT;
      validateSaveDataModel.settings = [
        {
          values: [amountNumber],
          prop: ResponsibleGameTab.PROP_AMOUNT
        }
      ];

      const validateSaveData = this.responsibleGamingService
        .toValidateSaveData(validateSaveDataModel)
        .subscribe((res: CustomBaseResponse<ValidateSavedDataResponseModel[]>) => {
          if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
            const [arrayData] = res.respData;
            const { validTill } = arrayData;
            if (validTill) {
              this.showError = true;
              this.showToast(
                MessageConstant.dailyLimitIncrease + validTill,
                ResponsibleGameTab.INFO_FLAG
              );
            } else {
              this.activeTemplate = ResponsibleGameTab.CONF_TEMPLATE;
            }
          }
        });
      this.subscriptions.push(validateSaveData);
    }
  }

  onClickYes() {
    const sendConfirmationOtp = new SendConfirmationOtpModel();

    sendConfirmationOtp.clear();

    sendConfirmationOtp.resend = !this.isClickedResend;

    const sendOtp = this.responsibleGamingService
      .toSendConfirmationOtp(sendConfirmationOtp)
      .subscribe((res: BaseResponse<SendConfirmationOtpResponse>) => {
        if (this.isClickedResend) {
          this.isResetOtpForm = true;
          this.isDisabledResend = true;
          this.otpNumber = '';
          this.showOtpButton = false;
          this.timeLeft = ToastTime.TIME_LEFT_300;

          this.showToast(MessageConstant.resendMsg, FLAG.success);
        }
        this.startTimer();

        if (res.code === RESPONSIBLE_GAMING.SUCCESS) {
          this.activeTemplate = ResponsibleGameTab.OTP_TEMPLATE;
          const { message } = res;
          const regex = REGEX_EXPRESSIONS.EXTRACT_NUMBER;
          const matchResult = regex.exec(message);
          const mobileNumber = matchResult ? matchResult[0] : this.maskedPhoneNumber;
          this.maskedPhoneNumber = mobileNumber;

          if (res.data.attemptLeft === RESPONSIBLE_GAMING.ATTEMPT_LEFT) {
            this.showToast(res.message, FLAG.error);
          } else {
            this.showToast(
              this.isClickedResend
                ? MessageConstant.resendMsg
                : MessageConstant.OtpSendSuccessfully,
              FLAG.success
            );
          }
        } else if (res.code === RESPONSIBLE_GAMING.OTP_ATTEMPT_REACHED) {
          this.resendEnablingTime = ToastTime.TIME_LEFT_0;
          this.showToast(res.message, FLAG.error);
        } else {
          this.showToast(res.message, FLAG.error);
        }
      });

    this.subscriptions.push(sendOtp);
  }

  ngAfterViewInit(): void {
    this.yesBtn?.nativeElement?.focus();
  }

  onClose(): void {
    this.responsibleGamingService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    clearInterval(this.otpTimer);
  }
}
