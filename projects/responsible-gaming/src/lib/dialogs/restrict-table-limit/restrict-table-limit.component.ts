import { Component, HostBinding, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  BaseResponse,
  MessageConstant,
  ToastModel,
  ToastTime
} from 'projects/shared/src/public-api';
import { Subscription, tap } from 'rxjs';

import {
  NOTIFICATION_TIME,
  REGEX_EXPRESSIONS,
  RESPONSIBLE_GAMING,
  ResponsibleGameTab,
  RG_CASH_TAB
} from '../../constants/app-constants';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { SendConfirmationOtpResponse } from '../../models/response/send-confirmation-otp.response.model';
import { VerifyEnteredOtpResponse } from '../../models/response/verify-entered-otp.response.model';
import { SendConfirmationOtpModel } from '../../models/view/send-confirmation-otp.view.model';
import { VerifyEnteredOtpModel } from '../../models/view/verify-entered-otp.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

interface DialogData {
  from: string;
  details: {
    blinds: string;
    duration: string | null;
    gameVariant: string;
  }[];
}
@Component({
  selector: 'app-restrict-table-limit',
  templateUrl: './restrict-table-limit.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class RestrictTableLimitComponent implements OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';
  isOTPMode: boolean = false;
  showOtpButton: boolean = false;
  isDisabledResend: boolean = true;
  isResetOtpForm: boolean = false;
  showResendOtpButton: boolean = false;
  timeLeft: number = ToastTime.TIME_LEFT_300;
  interval: ReturnType<typeof setInterval> | undefined;
  min: string | number;
  sec: string | number;
  isClickedResend: boolean = false;
  otpNumber: string = '';
  isShowToast: boolean = false;
  toastValue: ToastModel;
  maskedPhoneNumber: string = '';
  subscriptions: Subscription[] = [];
  isErrorFlag: boolean | undefined;
  resendEnablingTime: number = ToastTime.TIME_LEFT_290;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: DialogData,
    private readonly dialogRef: MatDialogRef<RestrictTableLimitComponent>,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {}

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
    clearInterval(this.interval);
    this.isResetOtpForm = true;
    this.timeLeft = 0;
    this.isClickedResend = true;
    this.onSendOtp();
  }

  onSendOtp() {
    const sendConfirmationOtp = new SendConfirmationOtpModel();

    sendConfirmationOtp.clear();

    sendConfirmationOtp.resend = this.isClickedResend;

    const sendOtp = this.responsibleGamingService
      .toSendConfirmationOtp(sendConfirmationOtp)
      .subscribe((res: BaseResponse<SendConfirmationOtpResponse>) => {
        if (this.isClickedResend) {
          this.isResetOtpForm = true;
          this.otpNumber = '';
          this.showOtpButton = false;
          this.timeLeft = 300;
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.resendMsg,
            flag: RG_CASH_TAB.SUCCESS_FLAG
          };
        }
        this.startTimer();

        if (res.code === RESPONSIBLE_GAMING.SUCCESS) {
          this.isOTPMode = true;
          const { message } = res;
          const regex = REGEX_EXPRESSIONS.EXTRACT_NUMBER;
          const matchResult = regex.exec(message);
          const mobileNumber = matchResult ? matchResult[0] : this.maskedPhoneNumber;
          this.maskedPhoneNumber = mobileNumber;

          if (res.code === RESPONSIBLE_GAMING.ATTEMPT_LEFT) {
            this.isShowToast = true;
            this.toastValue = {
              message: res.message,
              flag: RG_CASH_TAB.ERROR_FLAG
            };
          } else {
            this.showToast(
              this.isClickedResend
                ? MessageConstant.resendMsg
                : MessageConstant.OtpSendSuccessfully,
              RG_CASH_TAB.SUCCESS_FLAG
            );
          }
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: res.message,
            flag: RG_CASH_TAB.ERROR_FLAG
          };
        }
      });

    this.subscriptions.push(sendOtp);
  }

  showToast(message: string, flag: string) {
    this.isShowToast = true;
    this.toastValue = {
      message,
      flag
    };
  }

  onSubmit() {
    const dataArray: {
      blinds: string;
      gameVariant: string;
      duration: string;
    }[] = [];

    if (this.data?.details[0]?.blinds && this.data?.details[0]?.duration) {
      dataArray.push({
        blinds: this.data?.details[0]?.blinds,
        gameVariant: this.data?.details[0]?.gameVariant,
        duration: this.data?.details[0]?.duration
      });
    }

    if (this.data?.details[1]?.blinds && this.data?.details[1]?.duration) {
      dataArray.push({
        blinds: this.data?.details[1]?.blinds,
        gameVariant: this.data?.details[1]?.gameVariant,
        duration: this.data?.details[1]?.duration
      });
    }

    if (this.data?.details[2]?.blinds && this.data?.details[2]?.duration) {
      dataArray.push({
        blinds: this.data?.details[2]?.blinds,
        gameVariant: this.data?.details[2]?.gameVariant,
        duration: this.data?.details[2]?.duration
      });
    }

    if (this.data?.details[3]?.blinds && this.data?.details[3]?.duration) {
      dataArray.push({
        blinds: this.data?.details[3]?.blinds,
        gameVariant: this.data?.details[3]?.gameVariant,
        duration: this.data?.details[3]?.duration
      });
    }

    if (this.data?.details[4]?.blinds && this.data?.details[4]?.duration) {
      dataArray.push({
        blinds: this.data?.details[4]?.blinds,
        gameVariant: this.data?.details[4]?.gameVariant,
        duration: this.data?.details[4]?.duration
      });
    }

    const verifyEnteredOtp = new VerifyEnteredOtpModel();

    verifyEnteredOtp.clear();

    verifyEnteredOtp.otp = this.otpNumber;

    verifyEnteredOtp.saveData.settings = [];

    verifyEnteredOtp.saveData.tab = ResponsibleGameTab.RG_CASH;

    dataArray.forEach((element: { blinds: string; gameVariant: string; duration: string }) => {
      const durationArray = element.duration ? [element.duration] : [];
      verifyEnteredOtp.saveData.settings.push({
        values: [element?.blinds],
        prop: element?.gameVariant,
        duration: durationArray
      });
    });

    verifyEnteredOtp.tab = ResponsibleGameTab.TOURNAMENT;
    const verifyOtp = this.responsibleGamingService
      .verifyEnteredOtp(verifyEnteredOtp)
      ?.pipe(
        tap((res: CustomBaseResponse<VerifyEnteredOtpResponse>) => {
          if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
            if (res.respData.code === RESPONSIBLE_GAMING.VALID_OTP) {
              this.isErrorFlag = false;
              this.dialogRef.close(RG_CASH_TAB.SUCCESS_FLAG);
              this.isOTPMode = false;
            } else if (res.respData.code === RESPONSIBLE_GAMING.INVALID_OTP) {
              this.isErrorFlag = true;
              this.otpNumber = '';
              this.isResetOtpForm = true;
              this.showOtpButton = false;

              const timeOut = setTimeout(() => {
                this.isErrorFlag = undefined;
                clearInterval(timeOut);
              }, NOTIFICATION_TIME);

              this.isShowToast = true;
              this.toastValue = {
                message: MessageConstant.invalidOTPMsg,
                flag: RG_CASH_TAB.ERROR_FLAG
              };
            }
          } else {
            this.isShowToast = true;
            this.toastValue = {
              message: res.message,
              flag: RG_CASH_TAB.ERROR_FLAG
            };
          }
        }),
        tap({
          error: () => {
            this.isShowToast = true;
            this.toastValue = {
              message: MessageConstant.ApiError,
              flag: RG_CASH_TAB.ERROR_FLAG
            };
          }
        })
      )
      .subscribe();
    this.subscriptions.push(verifyOtp);
  }

  onClose(): void {
    this.responsibleGamingService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
