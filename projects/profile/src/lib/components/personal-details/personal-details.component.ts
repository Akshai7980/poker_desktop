import { DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SelectItem } from 'primeng/api';
import {
  CommonService,
  LocalStorageService,
  MessageConstant,
  Paths,
  RegexExpression,
  ToastModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { NotificationConstants } from 'src/app/modules/share/constants/shared-module-constants';

import { EmailOtpSendModel } from 'projects/shared/src/lib/models/view/email-otp-send';
import { EmailOtpVerifyModel } from 'projects/shared/src/lib/models/view/email-otp-verify';
import { EmailOtpSendRes } from 'projects/shared/src/lib/models/response/email-send-response';
import { EmailOtpVerifyRes } from 'projects/shared/src/lib/models/response/email-verify-response';
import { APIResponseCodeProfileDetails, ToastTime } from '../../constants/app-constants';
import { BaseResponse } from '../../models/common/base-response.model';
import { Gender } from '../../models/profile';
import { SaveUserProfileReq } from '../../models/request/save-user-profile-details';
import { AlternateMobileSendOtp } from '../../models/response/alternate-mobile-number-otp';
import { AlternateMobileVerifyOtpResp } from '../../models/response/alternate-mobile-verify-otp';
import { NewProfileResponseModel } from '../../models/response/new-profile-response';
import { AlternateMobileOtpModel } from '../../models/view/alternate-mobile-otp-model';
import { AlternateMobileVerifyOtp } from '../../models/view/alternate-mobile-verify-otp';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, OnDestroy {
  afterProfileUpdated: boolean = false;

  personalDetailsForm: FormGroup = new FormGroup({});

  assetsImagePath = Paths.imagePath;

  maskedContent: string = '';

  isVerifyAlternateMobile: boolean = false;

  showResendOtpButton: boolean = false;

  isEmailIdVerified: boolean = false;

  altNumberVerified: boolean = false;

  isEmailIdVerify: boolean = false;

  isResetOtpForm: boolean;

  showOtpButton: boolean = false;

  isShowToast: boolean = false;

  isErrorFlag: boolean | undefined;

  canVerify: boolean = false;

  timeLeft: number = 300;

  selectedGender: Gender;

  interval: ReturnType<typeof setInterval> | undefined;

  otp: string;

  min: string;

  sec: string;

  userProfileData: NewProfileResponseModel;

  toastValue: ToastModel;

  genders: Gender[];

  selectedRadioIndex: string = '1';

  isProfileUpdate: boolean = false;

  isResetToInitial: boolean = false;

  @ViewChild('altMobileNoInput') altMobileNoInput: ElementRef;

  @ViewChild('email') email: ElementRef;

  @Output() isComplected = new EventEmitter<string>();

  @Input() matStepperRef: MatStepper;

  @Input() userProfileData1: NewProfileResponseModel;

  isDisabledResend: boolean = false;

  resMessage: string;

  isUsernameEditable: boolean;

  emailErrorMsg: string = '';

  subscriptions: Subscription[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly profileService: ProfileService,
    public readonly localStorageService: LocalStorageService,
    private commonService: CommonService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      afterProfileUpdated: boolean;
      isComingFromList: boolean;
    },
    private dialogRef: DialogRef<PersonalDetailsComponent>,
    private matDialogRef: MatDialogRef<PersonalDetailsComponent>
  ) {
    this.genders = [
      {
        name: 'Male',
        code: 'male'
      },
      {
        name: 'Female',
        code: 'female'
      },
      {
        name: 'Other',
        code: 'other'
      }
    ];

    this.personalDetailsForm = this.formBuilder.group({
      userId: [''],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(RegexExpression.userNameRegexp),
          Validators.minLength(3)
        ]
      ],
      gender: [''],
      mark1: [false],
      mark2: [false],
      mobileNo: ['', [Validators.required]],
      altMobileNo: [''],
      email: [
        '',
        [Validators.required, Validators.pattern(RegexExpression.email), Validators.email]
      ]
    });
    this.afterProfileUpdated = this.dialogData.afterProfileUpdated;
  }

  ngOnInit(): void {
    this.getUserProfile();
    const userDetails = this.commonService.getUserData();
    this.personalDetailsForm.controls['userId'].setValue(userDetails?.userId);
  }

  onClose() {
    const profileDialog = this.dialog.getDialogById('poker-profile');
    profileDialog?.close();
    this.profileService.toggleAnimationDialog(this.matDialogRef);
  }

  validateUserNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const { value } = input;
    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(value)) {
      input.value = value.replace(/[^a-zA-Z0-9]/g, '');
    }
  }

  getUserProfile() {
    const createNewProfile = this.profileService.createNewProfile()?.subscribe(
      (res: BaseResponse<NewProfileResponseModel>) => {
        this.userProfileData = res.data;
        if (this.userProfileData?.userInfo) {
          this.profileService.userName.next(this.userProfileData.userInfo?.userName);

          if (this.userProfileData.userInfo.userName) {
            this.personalDetailsForm.controls['username'].setValue(
              this.userProfileData.userInfo?.userName
            );
          }

          if (this.userProfileData.userInfo.mobile) {
            this.personalDetailsForm.controls['mobileNo'].setValue(
              this.userProfileData.userInfo.mobile
            );
          }

          if (this.userProfileData.userInfo.isUsernameEditable) {
            this.isUsernameEditable = this.userProfileData.userInfo.isUsernameEditable;
          }

          if (this.userProfileData.userInfo.alternateNumber) {
            this.personalDetailsForm.controls['altMobileNo'].setValue(
              this.userProfileData.userInfo.alternateNumber
            );

            this.altNumberVerified = true;
          }

          if (this.userProfileData.userInfo.email) {
            this.personalDetailsForm.controls['email'].setValue(
              this.userProfileData.userInfo.email
            );
            this.isEmailIdVerified = true;
          }

          if (!this.userProfileData.userInfo.email) {
            this.showEmailVerifyErrorMessage();
          }

          if (this.userProfileData.userInfo.preferredNumber === '2') {
            this.selectedRadioIndex = '2';
          } else {
            this.selectedRadioIndex = '1';
          }

          this.genders.forEach((element: Gender) => {
            if (this.userProfileData?.userInfo?.gender === element.code) {
              this.personalDetailsForm.controls['gender'].setValue(element);
              this.personalDetailsForm.controls['gender'].disable();
            }
          });
        }
      },
      (err: Error) => {
        this.isShowToast = true;
        this.toastValue = {
          message: err.message,
          flag: 'error'
        };
        const timeoutVar = setTimeout(() => {
          this.isShowToast = false;
          clearInterval(timeoutVar);
        }, ToastTime.NOTIFICATION);
      }
    );
    this.subscriptions.push(createNewProfile);
  }

  updateUsername() {
    if (
      this.personalDetailsForm.controls['username'].valid &&
      this.isUsernameEditable &&
      this.personalDetailsForm.controls['username'].value !== this.userProfileData.userInfo.userName
    ) {
      const userName = this.personalDetailsForm.controls['username'].value;

      const getUserName = this.profileService.getUserName(userName).subscribe(
        (response: BaseResponse<{}>) => {
          if (response.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
            this.isUsernameEditable = false;
            this.isShowToast = true;
            this.toastValue = {
              message: response.message,
              flag: 'success'
            };
          } else {
            this.personalDetailsForm.controls['username'].reset();
            this.isShowToast = true;
            this.toastValue = {
              message: MessageConstant.UserNameTaken,
              flag: 'error'
            };
          }
        },
        () => {
          this.personalDetailsForm.controls['username'].reset();
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      );
      this.subscriptions.push(getUserName);
    }
  }

  onEnterMobileNumber(event: Event) {
    const target = event.target as HTMLInputElement;
    if (event && target.value.length === 10) {
      this.canVerify = true;
    } else {
      this.canVerify = false;
    }
  }

  onGenderChange(event: SelectItem) {
    const payload = { gender: event.value.code };
    if (payload) {
      this.personalDetailsForm.controls['gender'].disable();
    }
    this.updateUserProfile(payload);
  }

  onMobilePrefChange(value: string) {
    if (this.userProfileData?.userInfo?.preferredNumber === value) {
      return;
    }
    this.selectedRadioIndex = value;
    if (this.selectedRadioIndex === '2') {
      this.personalDetailsForm.controls['altMobileNo'].setValidators([
        Validators.required,
        Validators.minLength(10)
      ]);
    }

    const payload = { preferredNumber: value };
    this.updateUserProfile(payload);
  }

  toSendMobileOtp(callType: string) {
    if (this.personalDetailsForm.controls['altMobileNo'].value.length === 10) {
      if (callType === 'firstOtp') {
        clearInterval(this.interval);
        this.startTimer();
      }
      const mobileRequest = new AlternateMobileOtpModel();
      mobileRequest.clear();

      mobileRequest.mobileNumber = this.personalDetailsForm.controls['altMobileNo'].value;

      mobileRequest.isAlternate = true;

      const alternateMobileNumberSendOtp = this.profileService
        .alternateMobileNumberSendOtp(mobileRequest)
        .subscribe(
          (res: BaseResponse<AlternateMobileSendOtp>) => {
            if (callType === 'firstOtp' || callType === 'resendOtp') {
              switch (res.code) {
                case APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS:
                  this.isVerifyAlternateMobile = true;
                  if (callType === 'resendOtp') {
                    this.isShowToast = true;
                    this.toastValue = {
                      message: MessageConstant.OtpReSendSuccessfully,
                      flag: 'success'
                    };
                  }
                  break;
                case APIResponseCodeProfileDetails.PROFILE_DETAILS.ATTEMPT_LIMIT_REACHED:
                  clearInterval(this.interval);
                  this.timeLeft = 0;
                  this.min = '00';
                  this.sec = '00';
                  this.personalDetailsForm.controls['altMobileNo'].reset();
                  this.canVerify = false;
                  this.isShowToast = true;
                  this.toastValue = {
                    message: res.message,
                    flag: 'error'
                  };
                  break;
                case APIResponseCodeProfileDetails.PROFILE_DETAILS.NUMBER_ALREADY_EXIST:
                  clearInterval(this.interval);
                  this.timeLeft = 0;
                  this.min = '00';
                  this.sec = '00';
                  this.personalDetailsForm.controls['altMobileNo'].reset();
                  this.canVerify = false;
                  this.isShowToast = true;

                  this.isShowToast = true;
                  this.toastValue = {
                    message: res.message,
                    flag: 'error'
                  };
                  break;
                default:
                  this.personalDetailsForm.controls['altMobileNo'].reset();

                  this.isShowToast = true;
                  this.toastValue = {
                    message: res.message,
                    flag: 'error'
                  };
                  break;
              }
            }
          },
          (error: Error) => {
            this.personalDetailsForm.controls['altMobileNo'].reset();

            this.isShowToast = true;
            this.toastValue = {
              message: error.message,
              flag: 'error'
            };
          }
        );
      this.subscriptions.push(alternateMobileNumberSendOtp);
    }
  }

  toSendEmailOtp(callType: string) {
    if (this.personalDetailsForm.controls['email'].valid) {
      const userDetails = this.commonService.getUserData();
      this.maskEnteredContent(this.personalDetailsForm.controls['email'].value);
      if (callType === 'firstOtp') {
        clearInterval(this.interval);
        this.startTimer();
      }
      const emailOtpRequest = new EmailOtpSendModel();
      emailOtpRequest.clear();
      emailOtpRequest.userId = userDetails.userId;

      emailOtpRequest.emailId = this.personalDetailsForm.controls['email'].value;

      const sendEmailOtp = this.profileService.sendEmailOtp(emailOtpRequest).subscribe(
        (res: BaseResponse<EmailOtpSendRes>) => {
          if (res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
            this.isEmailIdVerify = true;
            if (callType === 'resendOtp') {
              this.isShowToast = true;
              this.toastValue = {
                message: MessageConstant.OtpReSendSuccessfully,
                flag: 'success'
              };
            }
          } else if (
            res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.ATTEMPT_LIMIT_REACHED
          ) {
            clearInterval(this.interval);
            this.timeLeft = 0;
            this.min = '00';
            this.sec = '00';
            this.personalDetailsForm.controls['email'].reset();
            this.isShowToast = true;

            this.toastValue = {
              message: res.message,
              flag: 'error'
            };
          } else {
            this.personalDetailsForm.controls['email'].reset();

            this.isShowToast = true;

            this.toastValue = {
              message: res.message,
              flag: 'error'
            };
          }
        },
        () => {
          this.personalDetailsForm.controls['email'].reset();
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      );
      this.subscriptions.push(sendEmailOtp);
    }
  }

  onOtpChange(otp: string, value: string) {
    if (otp && otp.length === 6 && this.timeLeft > 0) {
      this.otp = otp;
      this.showOtpButton = true;
      if (value === 'altMobileNo') {
        this.toVerifyAlternateMobile();
      } else if (value === 'email') {
        this.onVerifyEmailOtp();
      }
    } else {
      this.showOtpButton = false;
    }
  }

  clickResendOtp(type: string) {
    clearInterval(this.interval);
    this.timeLeft = 0;
    this.min = '00';
    this.sec = '00';
    this.startTimer();
    this.showResendOtpButton = false;
    this.otp = '';
    this.isResetOtpForm = false;
    this.showOtpButton = false;
    if (type === 'email') {
      this.toSendEmailOtp('resendOtp');
    } else {
      this.toSendMobileOtp('resendOtp');
    }
  }

  toChangeEntry(from: string) {
    this.isEmailIdVerify = false;
    this.isVerifyAlternateMobile = false;

    clearInterval(this.interval);
    this.timeLeft = 0;
    this.min = '00';
    this.sec = '00';

    if (from === 'email') {
      const timeoutVar = setTimeout(() => {
        this.email.nativeElement.focus();
        clearInterval(timeoutVar);
      }, ToastTime.TIME_LEFT_100);
    } else {
      const timeoutVar = setTimeout(() => {
        this.altMobileNoInput.nativeElement.focus();
        clearInterval(timeoutVar);
      }, ToastTime.TIME_LEFT_100);
    }
  }

  onVerifyEmailOtp() {
    if (this.otp.toString().length === 6) {
      const emailOtpVerifyRequest = new EmailOtpVerifyModel();
      emailOtpVerifyRequest.clear();
      emailOtpVerifyRequest.emailId = this.personalDetailsForm.controls['email'].value;
      emailOtpVerifyRequest.code = this.otp;
      emailOtpVerifyRequest.userId = this.personalDetailsForm.controls['userId'].value;

      const verifyEmailOtp = this.profileService.verifyEmailOtp(emailOtpVerifyRequest).subscribe(
        (res: BaseResponse<EmailOtpVerifyRes>) => {
          if (res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
            this.isEmailIdVerify = false;
            this.isVerifyAlternateMobile = false;
            this.isEmailIdVerified = true;

            this.isShowToast = true;

            this.toastValue = {
              message: MessageConstant.EmailIdVerified,
              flag: 'success'
            };
          } else if (
            res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.ATTEMPT_LIMIT_REACHED
          ) {
            this.emailErrorMsg = res.message;
            this.otp = '';
            this.isErrorFlag = true;
            this.showOtpButton = false;
            this.isResetToInitial = true;

            clearInterval(this.interval);
            this.timeLeft = 0;
            this.min = '00';
            this.sec = '00';

            this.startTimer();

            const timeoutId = setTimeout(() => {
              this.emailErrorMsg = '';
              this.isErrorFlag = undefined;
              clearInterval(timeoutId);
            }, ToastTime.NOTIFICATION);
            this.isShowToast = true;
            this.otp = '';
            this.toastValue = {
              message: res.message,
              flag: 'error'
            };
          } else {
            this.emailErrorMsg = '';
            this.otp = '';
            this.isErrorFlag = true;
            this.showOtpButton = false;
            this.isResetToInitial = true;

            clearInterval(this.interval);
            this.timeLeft = 0;
            this.min = '00';
            this.sec = '00';

            this.startTimer();

            const timeoutId = setTimeout(() => {
              this.isErrorFlag = undefined;
              clearInterval(timeoutId);
            }, ToastTime.NOTIFICATION);
            this.isShowToast = true;
            this.otp = '';
            this.toastValue = {
              message: res.message,
              flag: 'error'
            };
          }
        },
        () => {
          this.isShowToast = true;
          this.otp = '';
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: 'error'
          };
        }
      );
      this.subscriptions.push(verifyEmailOtp);
    }
  }

  startTimer() {
    this.isDisabledResend = true;
    this.timeLeft = 300;
    this.interval = setInterval(() => {
      if (this.timeLeft >= 0) {
        const m: number = Math.floor(this.timeLeft / 60);
        const s: number = this.timeLeft % 60;
        this.min = m < 10 ? `0${m}` : `${m}`;
        this.sec = s < 10 ? `0${s}` : `${s}`;
        if (m === 0 && s === 0) {
          this.isDisabledResend = false;
          this.showTimerExpiryToast(MessageConstant.otpTimerExpiryMessage);
        }

        if (this.timeLeft === 290) {
          this.isDisabledResend = false;
        }
        this.timeLeft -= 1;
      }
    }, ToastTime.ONESECOND);
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
      clearInterval(toastVar);
    }, ToastTime.NOTIFICATION);
  }

  resetTimer() {
    clearInterval(this.interval);
    this.timeLeft = -1;
    this.min = '0';
    this.sec = '0';
    this.isDisabledResend = false;
    this.showResendOtpButton = false;
  }

  maskEnteredContent(content: string) {
    this.maskedContent = content.replace(
      /^(.{2}).{3}(.*)$/,
      (_, prefix, suffix) => `${prefix}***${suffix}`
    );
    return this.maskedContent;
  }

  convertMobileNumberToMask(data: string) {
    const modifiedData = data?.toString().replace(/\b(\d\d)\d|\d(?=\d\d)/g, '$1*');
    return modifiedData;
  }

  toVerifyAlternateMobile() {
    if (this.otp.length === 6) {
      const mobileVerifyRequest = new AlternateMobileVerifyOtp();
      mobileVerifyRequest.clear();
      mobileVerifyRequest.mobileNumber = this.personalDetailsForm.controls['altMobileNo'].value;
      mobileVerifyRequest.otpNumber = this.otp;
      mobileVerifyRequest.isAlternate = true;

      const alternateMobileNumberVerifyOtp = this.profileService
        .alternateMobileNumberVerifyOtp(mobileVerifyRequest)
        .subscribe(
          (res: BaseResponse<AlternateMobileVerifyOtpResp>) => {
            if (res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
              this.isVerifyAlternateMobile = false;
              this.isEmailIdVerify = false;
              this.altNumberVerified = true;

              this.isShowToast = true;

              this.toastValue = {
                message: MessageConstant.AltNumberVerified,
                flag: 'success'
              };

              const timeoutVar = setTimeout(() => {
                this.showEmailVerifyErrorMessage();
                clearInterval(timeoutVar);
              }, ToastTime.NOTIFICATION);
            } else if (
              res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.ATTEMPT_LIMIT_REACHED
            ) {
              this.emailErrorMsg = res.message;
              this.otp = '';
              this.isErrorFlag = true;
              this.showOtpButton = false;
              this.isResetToInitial = true;
              clearInterval(this.interval);
              this.timeLeft = 0;
              this.min = '00';
              this.sec = '00';

              const timeoutId = setTimeout(() => {
                this.emailErrorMsg = '';
                this.isErrorFlag = undefined;
                clearInterval(timeoutId);
              }, ToastTime.NOTIFICATION);

              this.isShowToast = true;
              this.otp = '';
              this.toastValue = {
                message: res.message,
                flag: 'error'
              };
            } else {
              this.emailErrorMsg = '';
              this.otp = '';
              this.isErrorFlag = true;
              this.showOtpButton = false;
              this.isResetToInitial = true;

              const timeoutId = setTimeout(() => {
                this.emailErrorMsg = '';
                this.isErrorFlag = undefined;
                clearInterval(timeoutId);
              }, ToastTime.NOTIFICATION);

              this.isShowToast = true;
              this.otp = '';
              this.toastValue = {
                message: res.message,
                flag: 'error'
              };
            }
          },
          () => {
            this.isShowToast = true;
            this.toastValue = {
              message: MessageConstant.ApiError,
              flag: 'error'
            };
          }
        );
      this.subscriptions.push(alternateMobileNumberVerifyOtp);
    }
  }

  updateUserProfile(request: SaveUserProfileReq) {
    const saveUserProfile = this.profileService.saveUserProfile(request).subscribe(
      (response: BaseResponse<any>) => {
        if (response.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
          this.isShowToast = true;
          this.toastValue = { message: response.message, flag: 'success' };
          this.isProfileUpdate = response.data?.profile;
          if (request.preferredNumber) {
            this.userProfileData.userInfo.preferredNumber = request.preferredNumber;
          }
        } else {
          this.isShowToast = true;
          this.toastValue = { message: response.message, flag: 'error' };
        }
      },
      () => {
        this.isShowToast = true;
        this.toastValue = { message: MessageConstant.ApiError, flag: 'error' };
      }
    );
    this.subscriptions.push(saveUserProfile);
  }

  onSubmitNext() {
    if (this.personalDetailsForm.controls['email'].valid && this.isEmailIdVerified) {
      if (this.matStepperRef) {
        this.isComplected.emit('1st');
        this.matStepperRef.next();
      } else {
        this.dialogRef.close();
      }

      this.profileService.profileCompletionDetector.next(true);
    } else {
      this.isShowToast = true;
      this.toastValue = {
        message: MessageConstant.PleaseVerifyEmail,
        flag: 'error'
      };
    }
  }

  showEmailVerifyErrorMessage() {
    this.isShowToast = true;

    this.toastValue = {
      message: MessageConstant.PleaseVerifyEmail,
      flag: 'error'
    };
    const timeoutVar = setTimeout(() => {
      this.email?.nativeElement.focus();
      clearInterval(timeoutVar);
    }, ToastTime.HALFSECOND);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription?.unsubscribe();
      }
    });
  }
}
