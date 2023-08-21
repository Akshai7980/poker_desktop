import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { SocketCommService } from 'projects/shared/src/lib/services/socket-comm.service';
import {
  APIResponseCode,
  BaseResponse,
  CommonService,
  GenerateOTPModel,
  LoginDetailsModel,
  LoginResponseModel,
  MATDIALOG,
  MessageConstant,
  Paths,
  SendOTPResponse,
  SfsCommService,
  SpinnerService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { ContactUsComponent } from 'src/app/modules/contact-us/contact-us/contact-us.component';
import environment from 'src/environments/environment';

import { AccountBlockedComponent } from '../account-blocked/account-blocked.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { GeoLocationBlockedComponent } from '../geo-location-blocked/geo-location-blocked.component';
import { MobileNumberVerificationComponent } from '../mobile-number-verification/mobile-number-verification.component';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { PromoCodeComponent } from '../promo-code/promo-code.component';
import { RegistrationSuccessfulComponent } from '../registration-successful/registration-successful.component';
import { TermsComponent } from '../terms/terms.component';
import { WelcomeScreenComponent } from '../welcome-screen/welcome-screen.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  loginForm: FormGroup = new FormGroup({});

  getOtpModel: GenerateOTPModel = new GenerateOTPModel('', '');

  enteredMobileNumber: any;

  enableOtpButton: boolean = false;

  isShowLoginWithOTP: boolean = true;

  clicked: boolean;

  isSelected: boolean = true;

  ispromHide: boolean = true;

  isShowToast: boolean = false;

  isPasswordBlurred: boolean = true;

  showPassword: boolean = false;

  avatar = AvatarComponent;

  conactUs = ContactUsComponent;

  forgotPassWord = ForgotPasswordComponent;

  passwordReset = PasswordResetComponent;

  mobileVerification = MobileNumberVerificationComponent;

  promoCode = PromoCodeComponent;

  terms = TermsComponent;

  welcome = WelcomeScreenComponent;

  registrationSuccessful = RegistrationSuccessfulComponent;

  // LoginViaPassword fields
  passwordLoginForm: FormGroup = new FormGroup({});

  enableLoginBtn: boolean = false;

  loginDetailsModel: LoginDetailsModel;

  detailsFromLocal: any;

  invalidFields: boolean = false;

  promoCodeText: any;

  toastValue: ToastModel;

  subscriptions: Subscription[] = [];

  isNotice: boolean;

  errorCode: number;
  blockerDialogInstance: MatDialogRef<AccountBlockedComponent>;

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<LoginComponent>,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    public sfsCommService: SfsCommService,
    private spinnerService: SpinnerService,
    private readonly socketCommService: SocketCommService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.loginForm = this.formBuilder.group({
      mobileNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ])
      ],
      verification: [true]
    });

    this.detailsFromLocal = this.localStorageService.getItem('userLoginDetails');
    if (this.detailsFromLocal) this.enableLoginBtn = true;

    this.passwordLoginForm = this.formBuilder.group({
      userName: [this.detailsFromLocal ? this.detailsFromLocal.userName : '', Validators.required],
      password: [this.detailsFromLocal ? this.detailsFromLocal.password : '', Validators.required],
      rememberMe: [true]
    });

    const passwordLoginForm = this.passwordLoginForm.valueChanges.subscribe((resp) => {
      if (resp) {
        this.invalidFields = false;
        if (this.passwordLoginForm.valid) {
          this.enableLoginBtn = true;
        } else {
          this.enableLoginBtn = false;
        }
      }
    });
    this.subscriptions.push(passwordLoginForm);

    this.loginDetailsModel = new LoginDetailsModel('', '');

    this.isSelected = this.loginForm.controls['verification'].value;
    if (this.data) {
      this.loginForm.controls['mobileNumber'].setValue(this.data);
    }
    if (this.data?.length === 10) {
      this.enableOtpButton = true;
    }
    if (this.data?.type === 'reset_success') {
      this.isShowLoginWithOTP = false;
      this.isShowToast = true;
      this.toastValue = {
        message: this.data.message,
        flag: 'success'
      };
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          if (position) {
            this.isNotice = false;
          }
        },
        () => {
          this.isNotice = true;
        }
      );
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  openDialog(component: any, pageName: string) {
    this.enableOtpButton = false;
    switch (pageName) {
      case 'forgotPassWord':
        this.forgotPassword(component);
        break;

      case 'mobileVerification':
        this.initiateLogin(component, 'MobileNumberVerificationComponent');
        break;

      case 'welcome':
        this.initiateLogin(component);
        break;

      default:
        this.forgotPassword(component);
        break;
    }
  }

  forgotPassword(component: any) {
    const dialogRef = this.dialog.open(component, {
      data: this.enteredMobileNumber,
      ...MATDIALOG.forgotPassWordDialog
    });
    const dialog = dialogRef.afterClosed().subscribe((result: any) => {
      this.passwordLoginForm.controls['userName'].reset();
      this.passwordLoginForm.controls['password'].reset();

      if (result && result[1] === false) {
        [this.promoCodeText] = result;
        [, this.ispromHide] = result;
        if (this.enteredMobileNumber.length === 10) {
          this.enableOtpButton = true;
        }
      } else if (result?.type === 'reset_success') {
        this.isShowLoginWithOTP = false;
        this.isShowToast = true;
        this.toastValue = {
          message: result.message,
          flag: 'success'
        };
      } else if (result === 'passwordReset') {
        const dialogRef1 = this.dialog.open(PasswordResetComponent, MATDIALOG.passwordReset);
        const passwordRestDialog = dialogRef1.afterClosed().subscribe((result1) => {
          this.isShowToast = true;
          this.toastValue = {
            message: result1.message,
            flag: 'success'
          };
        });
        this.subscriptions.push(passwordRestDialog);
      }
    });
    this.subscriptions.push(dialog);
  }

  initiateLogin(component: any, compName?: string) {
    const keys = ['unamedata', 'uname', 'token', 'userDetails', 'userMobile', 'uid', 'bonusInfo'];

    keys.forEach((key: string) => {
      localStorage.removeItem(key);
    });

    if (this.isShowLoginWithOTP) {
      // Login Via OTP
      this.generateOTP(component);
    } else if (this.passwordLoginForm.valid) {
      // Login via Password

      // spinner to show while sfs is loading
      this.spinnerService.open();

      // Explicitly assigning username and password value to loginDetailsModel
      this.loginDetailsModel.userName = this.passwordLoginForm.controls['userName'].value;
      this.loginDetailsModel.password = this.passwordLoginForm.controls['password'].value;

      this.authService.loginModel = this.loginDetailsModel;

      this.sfsCommService.createSfsInstance();
      const loginStatus$ = this.authService.loginStatus;
      const loginStatus: Subscription = loginStatus$.subscribe({
        next: (resp: BaseResponse<LoginResponseModel>) => {
          switch (resp.code) {
            case APIResponseCode.AUTH.REGION_BLOCKED:
              this.executeRegionBlocked(resp);
              break;

            case APIResponseCode.AUTH.ACCOUNT_BLOCKED:
              this.executeAccountBlocked(resp);
              break;

            case APIResponseCode.AUTH.SUCCESS:
              this.executeLogin(component, resp.data, compName);
              break;
            case APIResponseCode.AUTH.INVALID_CREDENTIALS:
              this.invalidFields = true;
              this.enableLoginBtn = false;
              this.isShowToast = true;
              this.toastValue = {
                message: resp.message,
                flag: 'error'
              };
              break;
            default:
              this.invalidFields = true;
              this.isShowToast = true;
              this.toastValue = {
                message: resp.message,
                flag: 'error'
              };

              break;
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
      this.subscriptions.push(loginStatus);
    }
  }

  generateOTP(component: any) {
    this.getOtpModel.user = this.enteredMobileNumber;
    this.getOtpModel.signupCode = this.promoCodeText?.code?.promoCode;
    const generateOTP$ = this.authService.generateOTP(this.getOtpModel);
    const generateOTP: Subscription = generateOTP$.subscribe({
      next: (resp: BaseResponse<SendOTPResponse>) => {
        if (resp.code === APIResponseCode.AUTH.SUCCESS) {
          if (resp.data.isLogin) {
            const userDetails = {
              userId: resp.data.userId,
              isLogin: resp.data.isLogin
            };
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
          }
          localStorage.setItem('userMobile', this.loginForm.controls['mobileNumber'].value);
          // Navigating to next component
          this.dialog
            .open(component, {
              data: {
                mobileno: resp.message,
                from: 'loginFromOTP',
                code: this.promoCodeText?.code?.promoCode
              },
              ...MATDIALOG.mobileNumberVerification
            })
            .afterClosed()
            .subscribe((result: string) => {
              if (result === 'welcome') {
                this.dialog.open(WelcomeScreenComponent, MATDIALOG.userNameDialog);
              }
            });
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
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
    this.subscriptions.push(generateOTP);
  }

  executeRegionBlocked(resp: BaseResponse<LoginResponseModel>) {
    // create response model
    this.dialog.open(GeoLocationBlockedComponent, { data: resp, ...MATDIALOG.accountBlocked });
  }

  executeAccountBlocked(resp: any) {
    if (this.blockerDialogInstance) {
      this.blockerDialogInstance.close();
    }
    // create response model
    this.blockerDialogInstance = this.dialog.open(AccountBlockedComponent, {
      data: resp,
      ...MATDIALOG.accountBlocked
    });
  }

  executeLogin(component: any, respObj: LoginResponseModel, compName: string = '') {
    // Setting userLoggedIn flag

    const userData = {
      value: respObj.userName,
      changed: true,
      userId: respObj.userId,
      avatarId: 'avatar3',
      avatar: 'avatar3'
    };

    this.commonService.setUserData(userData);

    this.authService.userLoginStatusEmitter.next(true);
    this.localStorageService.setItem('token', respObj.token);
    if (environment.isSocketUp) {
      this.socketCommService.connectSocket();
    }

    if (compName === 'MobileNumberVerificationComponent') {
      // Login Via OTP
      const generateOTP$ = this.authService.generateOTP(this.getOtpModel);
      const generateOTP: Subscription = generateOTP$.subscribe({
        next: (resp: BaseResponse<SendOTPResponse>) => {
          if (resp.code === APIResponseCode.AUTH.INVALID_CREDENTIALS) {
            this.isShowToast = true;
            this.toastValue = {
              message: resp.message,
              flag: 'error'
            };
          } else {
            this.dialog.open(component, MATDIALOG.mobileNumberVerification);
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
      this.subscriptions.push(generateOTP);
    }

    // Auto Login enabling/disabling
    if (this.passwordLoginForm.controls['rememberMe'].value === true) {
      this.localStorageService.setItem('userLoginDetails', {
        userName: this.passwordLoginForm.controls['userName'].value,
        password: this.passwordLoginForm.controls['password'].value
      });
    } else {
      this.localStorageService.removeItem('userLoginDetails');
    }

    this.dialog.closeAll();
  }

  onEnterMobileNumber(event: Event) {
    const target = event.target as HTMLInputElement;
    this.clicked = false;
    this.enableOtpButton = false;
    if (target.value.length === 10 && this.isSelected === true) {
      this.enteredMobileNumber = target.value;
      this.enableOtpButton = true;
    }
  }

  passwordLogin() {
    this.isShowLoginWithOTP = !this.isShowLoginWithOTP;
  }

  onSelect() {
    this.isSelected = this.loginForm.controls['verification'].value;

    if (this.isSelected === false) {
      this.enableOtpButton = false;
    } else if (this.loginForm.valid) this.enableOtpButton = true;
  }

  onBackClick() {
    this.isShowLoginWithOTP = true;
    this.passwordLoginForm.controls['userName']?.setValue('');
    this.passwordLoginForm.controls['password']?.setValue('');
  }

  cancelPromoCode() {
    this.ispromHide = true;
    this.promoCodeText.code.promoCode = '';
  }

  isPasswordFocused(isFocused: boolean) {
    this.isPasswordBlurred = !isFocused;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
