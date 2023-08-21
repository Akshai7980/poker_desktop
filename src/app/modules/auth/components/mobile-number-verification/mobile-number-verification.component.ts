import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import {
  APIResponseCode,
  BaseResponse,
  CommonService,
  ForgotPasswordVerifyOTPResponse,
  MATDIALOG,
  MessageConstant,
  Paths,
  ScreenId,
  SendOTPResponse,
  SfsCommService,
  SignUpModel,
  SignUpResponse,
  ToastTime,
  UserAccountService,
  VerifyOTPModel,
  VerifyOTPResponse
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { NotificationConstants } from '../../../share/constants/shared-module-constants';
import { MultiAccountingComponent } from '../multi-accounting/multi-accounting.component';

@Component({
  selector: 'app-mobile-number-verification',
  templateUrl: './mobile-number-verification.component.html'
})
export class MobileNumberVerificationComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  toastValue: ToastModel;

  otpForm: FormGroup = new FormGroup({});

  enableOtpButton: boolean = false;

  isToast: boolean = false;

  otp: any;

  timeLeft: number = 300;

  interval: any;

  min: any;

  sec: any;

  showResendOtpButton: boolean = false;

  showOtpButton: boolean;

  isErrorFlag: boolean | undefined;

  verifyOtpModel: VerifyOTPModel;

  SignUpModel: SignUpModel;

  otpData: any;

  isShowToast: boolean = false;

  isShowLoader: boolean = false;

  isdisabledResend: boolean = true;

  isMultiAttemptMessageShow = false;

  isResetOtpForm: boolean;

  isShowMultipleAttemptMsg: boolean = false;

  color = '#FFFFFF';

  mobilenumber: any;

  showOtpComponent = true;

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

  @ViewChild('input_username') inputUsername: Input;

  form: any;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MobileNumberVerificationComponent>,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sessionStorage: LocalStorageService,
    private sfsCommService: SfsCommService,
    private userAccountService: UserAccountService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCloseDilog() {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.startTimer();
    this.otpForm = this.formBuilder.group({
      otpValue: ['', Validators.compose([Validators.required, Validators.maxLength(6)])]
    });

    this.verifyOtpModel = new VerifyOTPModel('');
    this.SignUpModel = new SignUpModel('', '', '');
    this.mobilenumber = localStorage.getItem('userMobile');
  }

  convertMobileNumberToMask(data: string) {
    const modifiedData = data?.toString().replace(/\b(\d\d)\d|\d(?=\d\d)/g, '$1*');
    return modifiedData;
  }

  startTimer() {
    this.isdisabledResend = true;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.timeLeft >= 0) {
        const m: number = Math.floor(this.timeLeft / 60);
        const s: number = this.timeLeft % 60;
        this.min = m < 10 ? `0${m}` : m;
        this.sec = s < 10 ? `0${s}` : s;
        if (m === 0 && s === 0) {
          this.showResendOtpButton = true;
          this.isMultiAttemptMessageShow = false;
          this.isdisabledResend = false;
          this.showTimerExpiryToast(MessageConstant.otpTimerExpiryMessage);
        }

        if (this.timeLeft === 290) {
          this.isdisabledResend = false;
        }

        this.timeLeft -= 1;
      }
    }, ToastTime.ONESECOND);
  }

  onChange() {
    this.dialogRef.close(this.data.mobileno);
  }

  onClose() {
    this.dialog.closeAll();
  }

  login(component: string) {
    this.isShowLoader = true;
    if (this.SignUpModel.code.length !== 6) {
      return;
    }

    if (this.data.from.toString() === 'loginFromOTP') {
      const isUserExist = JSON.parse(localStorage.getItem('userDetails') ?? '{}');

      if (!isUserExist.isLogin) {
        this.loginFromOTP(component);
      } else {
        this.verifyOtpModel.code = this.SignUpModel.code;
        this.onOtpVerfy('', true);
      }
    } else {
      this.forgotPasswordVerify();
    }
  }

  loginFromOTP(component: string) {
    this.authService.clearOldApplicationToken();
    this.SignUpModel.mobile = this.mobilenumber;
    this.SignUpModel.signupCode = this.data?.code;
    const signup = this.authService
      .signup(this.SignUpModel)
      .subscribe((resp: BaseResponse<SignUpResponse>) => {
        this.isShowLoader = false;
        if (resp.code === APIResponseCode.AUTH.INCORRECT_OTP) {
          this.isMultiAttemptMessageShow = false;
          this.isErrorFlag = true;
          this.otpData = resp;
          this.showOtpButton = false;
          this.isShowToast = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
          const toastVar = setTimeout(() => {
            this.toastValue = {} as ToastModel;
            this.isShowToast = false;
            this.isErrorFlag = undefined;
            clearTimeout(toastVar);
          }, ToastTime.NOTIFICATION);
        } else if (
          resp.code === APIResponseCode.AUTH.MULTIPLE_ATTEMPTS ||
          resp.code === APIResponseCode.AUTH.ATTEMPT_LIMIT_REACHED
        ) {
          this.otpData = resp;
          this.isMultiAttemptMessageShow = true;
          this.isErrorFlag = true;
          this.isShowToast = false;
          this.showOtpButton = false;
          this.isdisabledResend = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
          const timeOut = setTimeout(() => {
            this.toastValue = {} as ToastModel;
            this.isShowToast = false;
            this.isErrorFlag = undefined;
            clearTimeout(timeOut);
          }, ToastTime.NOTIFICATION);
        } else if (resp.code === APIResponseCode.AUTH.DEVICE_RGISTER_LIMIT) {
          this.isMultiAttemptMessageShow = true;

          this.isErrorFlag = true;
          this.isShowToast = true;
          this.showOtpButton = false;

          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
        } else if (resp.code === APIResponseCode.AUTH.INVALID_DEVICEID) {
          this.isMultiAttemptMessageShow = false;

          this.isErrorFlag = true;
          this.isShowToast = true;
          this.showOtpButton = false;

          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
          const timeOut = setTimeout(() => {
            this.toastValue = {} as ToastModel;
            this.isShowToast = false;
            this.isErrorFlag = undefined;
            this.isResetOtpForm = true;
            clearTimeout(timeOut);
          }, ToastTime.NOTIFICATION);
        } else if (resp.code === APIResponseCode.AUTH.SUCCESS) {
          this.isdisabledResend = true;
          this.isErrorFlag = false;
          const userDetails = resp.data;
          this.isMultiAttemptMessageShow = false;
          this.authService.getAvatar(resp.data.avtarId);
          localStorage.setItem('userDetails', JSON.stringify(userDetails));
          this.verifyOtpModel.code = resp.data.tempOtp.toString();
          const timeOut = setTimeout(() => {
            this.onOtpVerfy(component, false);
            clearTimeout(timeOut);
          }, ToastTime.NOTIFICATION);
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
        }
      });
    this.subscriptions.push(signup);
  }

  forgotPasswordVerify() {
    const forgotPasswordVerifyOtp$ = this.authService.forgotPasswordVerifyOtp(this.verifyOtpModel);
    const forgotPasswordVerifyOtp: Subscription = forgotPasswordVerifyOtp$.subscribe({
      next: (resp: BaseResponse<ForgotPasswordVerifyOTPResponse>) => {
        this.isShowLoader = false;
        if (resp.code === APIResponseCode.AUTH.INCORRECT_OTP) {
          this.isMultiAttemptMessageShow = false;

          this.isErrorFlag = true;
          this.isShowToast = true;
          this.showOtpButton = false;
          this.otpData = resp;
          this.toastValue = {
            message: this.otpData?.message,
            flag: 'error'
          };
          const timeOut = setTimeout(() => {
            this.toastValue = {} as ToastModel;
            this.isShowToast = false;
            this.isErrorFlag = undefined;
            clearTimeout(timeOut);
          }, ToastTime.NOTIFICATION);
        } else if (resp.code === APIResponseCode.AUTH.MULTIPLE_ATTEMPTS || resp.code === 1044) {
          this.otpData = resp;
          this.isMultiAttemptMessageShow = true;

          this.isErrorFlag = true;
          this.isShowToast = false;
          this.showOtpButton = false;
          this.isdisabledResend = true;
          this.toastValue = {
            message: this.otpData?.message,
            flag: 'error'
          };
        } else if (resp.code === APIResponseCode.AUTH.SUCCESS) {
          this.isMultiAttemptMessageShow = false;

          this.isErrorFlag = false;
          this.toastValue = {
            message: this.otpData?.message,
            flag: 'success'
          };

          this.sessionStorage.setItem('forgotPassSystemCode', resp.data.systemCode.toString());
          this.dialogRef.close('passwordReset');
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(forgotPasswordVerifyOtp);
  }
  onOtpVerfy(component: any, isUserExist: boolean) {
    const verifyOtp = this.authService
      .verifyOtp(this.verifyOtpModel)
      .subscribe((resp: BaseResponse<VerifyOTPResponse>) => {
        this.isShowLoader = false;
        if (resp.code === APIResponseCode.AUTH.DEVICE_RGISTER_LIMIT) {
          this.executeMultiAccounting();
        } else if (resp.code === APIResponseCode.AUTH.INCORRECT_OTP) {
          this.isErrorFlag = true;
          this.otpData = resp;
          this.isShowToast = true;
          this.showOtpButton = false;
          this.isMultiAttemptMessageShow = false;

          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
          const timeOut = setTimeout(() => {
            this.toastValue = {} as ToastModel;
            this.isShowToast = false;
            this.isErrorFlag = undefined;
            clearTimeout(timeOut);
          }, ToastTime.NOTIFICATION);
        } else if (
          resp.code === APIResponseCode.AUTH.MULTIPLE_ATTEMPTS ||
          resp.code === APIResponseCode.AUTH.ATTEMPT_LIMIT_REACHED
        ) {
          this.otpData = resp;
          this.isMultiAttemptMessageShow = true;

          this.isErrorFlag = true;
          this.isShowToast = false;
          this.showOtpButton = false;
          this.isdisabledResend = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
        } else {
          this.isdisabledResend = true;
          this.isErrorFlag = false;
          this.isMultiAttemptMessageShow = false;

          const unameObject = {
            value: resp.data.userName,
            changed: false,
            userId: resp.data.userId
          };

          const timeout = setTimeout(() => {
            this.sessionStorage.setItem('unamedata', unameObject);
            this.authService.userLoginStatusEmitter.next(true);
            this.sessionStorage.setItem('token', resp.data.token);
            this.authService.loginSessionId = resp.data.token;
            this.userAccountService.isLogged = true;
            this.sfsCommService.createSfsInstance();

            if (isUserExist === true) {
              this.dialog.closeAll();
              this.commonService.navigateTo(ScreenId.LOBBY);
            } else {
              this.dialogRef.close(component);
            }
            clearTimeout(timeout);
          }, ToastTime.NOTIFICATION);
        }
      });
    this.subscriptions.push(verifyOtp);
  }

  executeMultiAccounting() {
    this.dialog.open(MultiAccountingComponent, { ...MATDIALOG.accountBlocked });
  }

  onBackArrowSelect() {
    this.dialogRef.close(this.data);
  }

  onEditMobileNumber() {
    this.dialogRef.close();
  }

  onOtpChange(otp: any) {
    if (otp.length === 6 && this.timeLeft > 0) {
      this.SignUpModel.code = otp;
      this.verifyOtpModel.code = otp;
      this.showOtpButton = true;
      this.login('welcome');
    } else {
      this.showOtpButton = false;
    }
  }

  clickResendOtp() {
    this.isResetOtpForm = true;
    if (this.data.from.toString() === 'loginFromOTP') {
      const resendOTP$ = this.authService.resendOTP();
      const resendOTP: Subscription = resendOTP$.subscribe({
        next: (resp: BaseResponse<SendOTPResponse>) => {
          this.isResetOtpForm = false;
          this.timeLeft = 300;
          this.startTimer();
          this.showResendOtpButton = false;

          if (resp.data?.attemptLeft === 0) {
            this.otpData = resp;
            this.showOtpButton = false;

            this.isMultiAttemptMessageShow = true;
          } else {
            this.isMultiAttemptMessageShow = false;
            this.isShowToast = true;
            this.toastValue = {
              message: resp?.message,
              flag: 'success'
            };
            this.showOtpButton = false;
          }
        },
        error: () => {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      });
      this.subscriptions.push(resendOTP);
    } else {
      const resendForgotPasswordOTP$ = this.authService.resendForgotPasswordOTP();
      const resendForgotPasswordOTP: Subscription = resendForgotPasswordOTP$.subscribe({
        next: (resp: BaseResponse<SendOTPResponse>) => {
          this.isResetOtpForm = false;
          this.timeLeft = 300;
          this.startTimer();
          this.showResendOtpButton = false;

          if (resp.data?.attemptLeft === 0 || resp.code === 1044) {
            this.isShowToast = true;
            this.toastValue = {
              message: resp?.message,
              flag: 'error'
            };
            this.otpData = resp;

            this.isMultiAttemptMessageShow = true;

            this.showOtpButton = false;
          } else {
            this.isMultiAttemptMessageShow = false;
            this.isShowToast = true;
            this.toastValue = {
              message: resp?.message,
              flag: 'success'
            };
            this.showOtpButton = false;
          }
        },
        error: () => {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      });
      this.subscriptions.push(resendForgotPasswordOTP);
    }
  }

  showTimerExpiryToast(msg: string) {
    this.isShowToast = true;
    this.toastValue = {
      message: msg,
      flag: NotificationConstants.TYPE_ERROR
    };
    const toastVar = setTimeout(() => {
      this.toastValue = {} as ToastModel;
      this.isShowToast = false;
      clearTimeout(toastVar);
    }, ToastTime.NOTIFICATION);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
