import { Component, HostBinding, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse } from 'projects/shared/src/lib/models/common/base-response.model';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { FLAG, MessageConstant, ToastTime } from 'projects/shared/src/public-api';
import { Subscription, tap } from 'rxjs';
import {
  REGEX_EXPRESSIONS,
  RESPONSIBLE_GAMING,
  ResponsibleGameTab
} from '../../constants/app-constants';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { SendConfirmationOtpResponse } from '../../models/response/send-confirmation-otp.response.model';
import { VerifyEnteredOtpResponse } from '../../models/response/verify-entered-otp.response.model';
import { SendConfirmationOtpModel } from '../../models/view/send-confirmation-otp.view.model';
import { VerifyEnteredOtpModel } from '../../models/view/verify-entered-otp.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

interface DialogData {
  buyInLimit: string;
  from: string;
  prop: string;
  settingsName: string;
  tabName: string;
  tournament_limit: string;
  sng_limit: string;
}
@Component({
  selector: 'app-buy-in-limit',
  templateUrl: './buy-in-limit.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class BuyInLimitComponent implements OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';
  isOTPMode: boolean = false;
  showOtpButton: boolean = false;
  isDisabledResend: boolean = true;
  isResetOtpForm: boolean = false;
  showResendOtpButton: boolean = false;
  timeLeft: number = ToastTime.TIME_LEFT_300;
  min: string | number;
  sec: string | number;
  isClickedResend: boolean = false;
  subscriptions: Subscription[] = [];
  maskedPhoneNumber: string = '';
  otpNumber: string = '';
  toastValue: ToastModel;
  isShowToast: boolean = false;
  isErrorFlag: boolean | undefined;
  interval: ReturnType<typeof setInterval> | undefined;
  resendEnablingTime: number = ToastTime.TIME_LEFT_290;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: DialogData,
    private readonly dialogRef: MatDialogRef<BuyInLimitComponent>,
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
    } else {
      this.showOtpButton = false;
    }
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
          this.timeLeft = ToastTime.TIME_LEFT_300;
          this.resendEnablingTime = ToastTime.TIME_LEFT_290;
        }
        this.startTimer();

        if (res.code === RESPONSIBLE_GAMING.SUCCESS) {
          this.isOTPMode = true;
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

  showToast(message: string, flag: string) {
    this.isShowToast = true;
    this.toastValue = {
      message,
      flag
    };
  }

  onSubmit(ref: string) {
    const verifyEnteredOtp = new VerifyEnteredOtpModel();

    verifyEnteredOtp.clear();

    verifyEnteredOtp.otp = this.otpNumber;
    verifyEnteredOtp.saveData = {
      tab: this.data.tabName,
      settings: [
        {
          values: [
            this.data.settingsName === ResponsibleGameTab.SET_LIMIT
              ? this.data.buyInLimit
              : this.data.settingsName
          ],
          prop: this.data.prop
        }
      ]
    };
    verifyEnteredOtp.tab = ResponsibleGameTab.TOURNAMENT;
    const verifyOtp = this.responsibleGamingService
      .verifyEnteredOtp(verifyEnteredOtp)
      ?.pipe(
        tap((res: CustomBaseResponse<VerifyEnteredOtpResponse>) => {
          if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
            if (res.respData.code === RESPONSIBLE_GAMING.VALID_OTP) {
              this.isErrorFlag = false;
              if (ref === ResponsibleGameTab.TOURNAMENT_NAME) {
                this.dialogRef.close({ tournament_limit: this.data.tournament_limit });
                this.isOTPMode = false;
              } else if (ref === ResponsibleGameTab.SNG) {
                this.dialogRef.close({ sng_limit: this.data.sng_limit });
                this.isOTPMode = false;
              }
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
            }
          } else {
            this.showToast(res.message, FLAG.error);
          }
        }),
        tap({
          error: () => {
            this.showToast(MessageConstant.ApiError, FLAG.error);
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
