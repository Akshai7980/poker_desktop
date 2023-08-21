import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  APIResponseCode,
  BaseResponse,
  DetectUserModel,
  MATDIALOG,
  Paths,
  SendOTPResponse,
  UserDetailsErrorResponseModel,
  UserDetailsResponseModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { MobileNumberVerificationComponent } from '../mobile-number-verification/mobile-number-verification.component';
import { PasswordResetComponent } from '../password-reset/password-reset.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  assetsImagePath = Paths.imagePath;

  mobileVerification = MobileNumberVerificationComponent;

  detectUserModel: DetectUserModel;

  isComingFromForgotPass: boolean = true;

  invalidAccount: boolean = false;

  btnDisabled: boolean = true;

  subscriptions: Subscription[] = [];

  isShowToast: boolean = false;

  toastValue: ToastModel;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private authService: AuthService
  ) {
    this.detectUserModel = new DetectUserModel('');
  }

  onClose() {
    this.dialogRef.close();
  }

  onCloseDilog() {
    this.dialog.closeAll();
  }

  openDilog(component: any, message: string) {
    const dialogRef = this.dialog.open(component, {
      data: { mobileno: message, from: 'forgotPassword' },
      ...MATDIALOG.forgotPassWordDialog
    });
    const dialog = dialogRef.afterClosed().subscribe((result) => {
      if (result === 'passwordReset') {
        this.dialogRef.close('passwordReset');
      } else {
        this.btnDisabled = false;
      }
    });
    this.subscriptions.push(dialog);
  }

  openPassWordRest() {
    const dialogRef = this.dialog.open(PasswordResetComponent, MATDIALOG.passwordReset);
    const passwordRestDialog = dialogRef.afterClosed().subscribe((result1) => {
      this.dialogRef.close(result1);
    });
    this.subscriptions.push(passwordRestDialog);
  }

  executeFindYourAccount(component: any) {
    this.btnDisabled = true;
    const forgotPassword = this.authService
      .forgotPassword(this.detectUserModel)
      .subscribe(
        (
          resp:
            | BaseResponse<UserDetailsResponseModel | UserDetailsErrorResponseModel>
            | BaseResponse<SendOTPResponse>
        ) => {
          if (resp.code === APIResponseCode.AUTH.ACCOUNT_NOT_FOUND) {
            this.invalidAccount = true;
          } else if (resp.code === APIResponseCode.AUTH.SUCCESS) {
            this.openDilog(component, resp.message);

            const userDetails = {
              userId: (resp.data as SendOTPResponse).userId,
              isLogin: (resp.data as SendOTPResponse).isLogin
            };
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
          } else {
            this.isShowToast = true;
            this.toastValue = {
              message: resp.message,
              flag: 'error'
            };
          }
        }
      );
    this.subscriptions.push(forgotPassword);
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  onTextChange(data: any) {
    if (data.length > 0) {
      this.btnDisabled = false;
    } else this.btnDisabled = true;

    this.invalidAccount = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
