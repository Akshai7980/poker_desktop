import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse } from 'projects/shared/src/lib/models/common/base-response.model';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { FLAG, MessageConstant, ToastTime } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import {
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
  weeklyLimit: string;
  weeklyLimitCount: string;
  dailyLimit: string;
  dailyLimitCount: string;
  perTransactionLimit: number;
}
@Component({
  selector: 'app-weekly-limit',
  templateUrl: './weekly-limit.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class WeeklyLimitComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';
  activeTemplate = ResponsibleGameTab.ACTIVE_TEMPLATE;
  showOtpButton: boolean;
  isDisabledResend: boolean = true;
  isResetOtpForm: boolean;
  showResendOtpButton: boolean = false;
  timeLeft: number = ToastTime.TIME_LEFT_300;
  min: string | number;
  sec: string | number;
  @ViewChild('yesBtn') yesBtn: ElementRef<HTMLButtonElement>;
  otpNumber: string;
  isClickedResend: boolean;
  maskedPhoneNumber: string;
  isShowToast: boolean;
  toastValue: ToastModel;
  subscriptions: Subscription[] = [];
  parsedAmount: number = 0;
  dailyLimit: string;
  showErrorAmount: boolean;
  showErrorCount: boolean;
  weeklyLimitAmount: string = '';
  weeklyNewCount: string = '';
  weeklyLimit: string;
  existingAmount: string;
  excisingCount: string;
  disableApply: boolean = true;
  interval: ReturnType<typeof setInterval> | undefined;
  isErrorFlag: boolean | undefined;
  amount: number = 0;
  resendEnablingTime: number = ToastTime.TIME_LEFT_290;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: DialogData,
    private readonly dialogRef: MatDialogRef<WeeklyLimitComponent>,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {}

  ngOnInit(): void {
    this.weeklyLimitAmount = this.data.weeklyLimit;
    const weeklyLimit = `₹ ${Number(this.data.weeklyLimit).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;

    const amount = weeklyLimit.replace(RegexToUnFormatAmount.pattern, '');
    this.parsedAmount = parseInt(amount, 10);
    this.amount = parseInt(amount, 10);

    this.existingAmount = weeklyLimit;
    this.weeklyLimit = weeklyLimit;
    this.weeklyNewCount = this.data.weeklyLimitCount;
    this.excisingCount = this.data.weeklyLimitCount;
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
    this.interval = setInterval(updateTimer, ToastTime.ONESECOND);
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
    this.onClickYes();
  }

  ngAfterViewInit(): void {
    this.yesBtn?.nativeElement?.focus();
  }

  onClickYes() {
    const sendConfirmationOtp = new SendConfirmationOtpModel();

    sendConfirmationOtp.clear();

    sendConfirmationOtp.resend = this.isClickedResend;

    const sendOtp = this.responsibleGamingService
      .toSendConfirmationOtp(sendConfirmationOtp)
      .subscribe((res: BaseResponse<SendConfirmationOtpResponse>) => {
        if (this.isClickedResend) {
          this.timeLeft = ToastTime.TIME_LEFT_300;
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
          this.showToast(res.message, FLAG.error);
        } else {
          this.showToast(res.message, FLAG.error);
        }
      });

    this.subscriptions.push(sendOtp);
  }

  onVerifyAmount(event: Event) {
    this.showErrorAmount = false;
    const target = event.target as HTMLInputElement;
    let amount = target.value ? target.value : RG_SIT_N_GO.LIMIT_ZERO.toString();
    amount = amount.replace(RegexToUnFormatAmount.pattern, '');

    if (amount === RG_SIT_N_GO.LIMIT_ZERO.toString()) {
      amount = RG_SIT_N_GO.LIMIT_ZERO.toString();
    } else if (amount.length > RG_SIT_N_GO.LIMIT_SEVEN) {
      target.value = `₹ ${amount.slice(0, 7)}`;
    }

    if (`${amount}`.trim() === `₹` || `${amount}`.trim() === `₹ 0`) {
      this.weeklyLimit = '';
    } else {
      this.weeklyLimit = amount;
    }

    this.parsedAmount = parseInt(amount, 10);

    if (!Number.isNaN(this.parsedAmount)) {
      const formattedAmount = `₹ ${this.parsedAmount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`;
      this.weeklyLimitAmount = formattedAmount;
      this.weeklyLimit = formattedAmount;
    }

    if (Number.isNaN(this.parsedAmount) || Number.isNaN(parseInt(this.weeklyNewCount, 10))) {
      this.disableApply = false;
    } else this.disableApply = true;
  }

  onCountChange() {
    this.showErrorCount = false;
    if (Number.isNaN(parseInt(this.weeklyNewCount, 10)) || Number.isNaN(this.parsedAmount)) {
      this.disableApply = false;
    } else this.disableApply = true;
    this.weeklyNewCount = this.weeklyNewCount.replace(RegexToUnFormatAmount.countPattern, '');
  }

  onSubmit() {
    const amountString = this.weeklyLimit;
    const amountNumber = amountString.replace(RegexToUnFormatAmount.amountPattern, '');

    const verifyEnteredOtp = new VerifyEnteredOtpModel();

    verifyEnteredOtp.clear();

    verifyEnteredOtp.otp = this.otpNumber;
    verifyEnteredOtp.saveData = {
      tab: ResponsibleGameTab.WEEKLY_LIMIT,
      settings: [
        {
          values: [amountNumber],
          prop: ResponsibleGameTab.PROP_AMOUNT
        },
        {
          values: [this.weeklyNewCount],
          prop: ResponsibleGameTab.PROP_COUNT
        }
      ]
    };
    verifyEnteredOtp.tab = ResponsibleGameTab.WEEKLY_LIMIT;

    const verifyOtp = this.responsibleGamingService
      .verifyEnteredOtp(verifyEnteredOtp)
      .subscribe((res: CustomBaseResponse<VerifyEnteredOtpResponse>) => {
        if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
          if (res.respData.code === RESPONSIBLE_GAMING.VALID_OTP) {
            this.dialogRef.close({
              status: ResponsibleGameTab.SUCCESS_FLAG,
              DEPOSIT_LIMIT_OPTIONS: DepositLimitOptions.WEEKLY
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
    const amountString = this.weeklyLimitAmount;
    const amountNumber = amountString.replace(RegexToUnFormatAmount.amountPattern, '');

    const dailyLimitCount = Number(this.data.dailyLimitCount);

    this.showErrorAmount = false;
    this.showErrorCount = false;

    if (this.parsedAmount === 0 && Number(this.weeklyNewCount) === 0) {
      this.showErrorAmount = true;
      this.showErrorCount = true;
      this.showToast(MessageConstant.weeklyLimit[1], FLAG.error);
      const timeoutVar = setTimeout(() => {
        this.showToast(MessageConstant.weeklyLimit[2], FLAG.error);
        clearInterval(timeoutVar);
      }, ToastTime.SetTimer);
      return;
    }

    if (this.parsedAmount < 100 && Number(this.weeklyNewCount) === 0) {
      this.showErrorAmount = true;
      this.showErrorCount = true;
      this.showToast(MessageConstant.weeklyLimit[4], FLAG.error);
      const timeoutVar = setTimeout(() => {
        this.showToast(MessageConstant.weeklyLimit[2], FLAG.error);
        clearInterval(timeoutVar);
      }, ToastTime.SetTimer);
      return;
    }

    if (this.parsedAmount === 0) {
      this.showErrorAmount = true;
      this.showToast(MessageConstant.weeklyLimit[1], FLAG.error);
      return;
    }

    if (Number(this.weeklyNewCount) === 0) {
      this.showErrorCount = true;
      this.showToast(MessageConstant.weeklyLimit[2], FLAG.error);
      return;
    }

    if (this.parsedAmount < 100) {
      this.showErrorAmount = true;
      this.showToast(MessageConstant.weeklyLimit[4], FLAG.error);
      return;
    }

    if (
      this.parsedAmount < Number(this.data.dailyLimit) ||
      this.parsedAmount < Number(this.data.perTransactionLimit)
    ) {
      this.showErrorAmount = true;
      this.showToast(MessageConstant.weeklyLimit[0], FLAG.error);
      return;
    }

    if (dailyLimitCount > Number(this.weeklyNewCount)) {
      this.showErrorCount = true;
      this.showToast(MessageConstant.weeklyLimit[3], FLAG.error);
      return;
    }

    if (Number(this.weeklyNewCount) < dailyLimitCount) {
      this.showErrorCount = true;
      this.showToast(MessageConstant.weeklyLimit[3], FLAG.error);
      return;
    }

    const validateSaveDataModel = new ValidateSaveDataModel();

    validateSaveDataModel.clear();

    validateSaveDataModel.clientTab = null;
    validateSaveDataModel.tab = ResponsibleGameTab.WEEKLY_LIMIT;
    validateSaveDataModel.settings = [
      {
        values: [amountNumber],
        prop: ResponsibleGameTab.PROP_AMOUNT
      },
      {
        values: [this.weeklyNewCount],
        prop: ResponsibleGameTab.PROP_COUNT
      }
    ];

    const validateSaveData = this.responsibleGamingService
      .toValidateSaveData(validateSaveDataModel)
      .subscribe((res: CustomBaseResponse<ValidateSavedDataResponseModel[]>) => {
        if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
          const [arrayData] = res.respData;
          const { validTill } = arrayData;
          if (validTill) {
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

  onClose(): void {
    this.responsibleGamingService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
