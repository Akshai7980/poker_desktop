import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { APIResponseCode, PasswordResetModel, Paths } from 'projects/shared/src/public-api';

import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnDestroy {
  assetsImagePath = Paths.imagePath;

  invalidNewPass: boolean = false;

  invalidConfirmPass: boolean = false;

  newPasswordType: string = 'text';

  confirmPasswordType: string = 'password';

  newPasswordEyeImagePath: string = 'auth/password-eye.svg';

  confirmPasswordEyeImagePath: string = 'auth/password-eye-slash.svg';

  verifiedImagePath: boolean = true;

  resetPasswordModel: PasswordResetModel;

  enableConfirmBtn: boolean = false;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  showStatusText: boolean = false;

  component: { newPassword: string; confirmPassword: string };

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<PasswordResetComponent>,
    private authService: AuthService
  ) {
    this.resetPasswordModel = new PasswordResetModel('', '');
  }

  onClose() {
    this.dialog.closeAll();
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  showNewPassword() {
    if (this.newPasswordType === 'password') {
      this.newPasswordType = 'text';
      this.newPasswordEyeImagePath = 'auth/password-eye.svg';
    } else {
      this.newPasswordType = 'password';
      this.newPasswordEyeImagePath = 'auth/password-eye-slash.svg';
    }
  }

  showConfirmPassword() {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordEyeImagePath = 'auth/password-eye.svg';
      this.confirmPasswordType = 'text';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordEyeImagePath = 'auth/password-eye-slash.svg';
    }
  }

  onConfirmClicked() {
    this.enableConfirmBtn = false;
    if (this.resetPasswordModel.newPassword !== this.resetPasswordModel.confirmPassword) {
      this.showStatusText = true;
    } else {
      const resetPassword = this.authService
        .resetPassword(this.resetPasswordModel)
        .subscribe((resp) => {
          if (resp.code === APIResponseCode.AUTH.SUCCESS) {
            this.isShowToast = true;
            this.showStatusText = false;

            const data = {
              type: 'reset_success',
              message: resp.message
            };
            this.dialogRef.close(data);
          } else {
            this.isShowToast = true;
            this.toastValue = {
              message: resp.message,
              flag: 'error'
            };
          }
        });
      this.subscriptions.push(resetPassword);
    }
  }

  onNewPasswordChange() {
    if (
      this.resetPasswordModel.newPassword.length >= 8 &&
      this.resetPasswordModel.newPassword.length <= 20
    ) {
      this.verifiedImagePath = false;
    } else this.verifiedImagePath = true;

    this.validateForm();
  }

  validateForm() {
    this.invalidConfirmPass = true;
    this.showStatusText = true;
    this.enableConfirmBtn = false;
    if (this.getNewPassCompair()) {
      this.showStatusText = false;
      this.invalidConfirmPass = false;
    }
    if (this.getNewPassCompair() && this.getConfirmPassCompair()) {
      this.enableConfirmBtn = this.arePasswordFieldsNotEmpty() && this.areFieldsLengthValidated();
    }
  }

  getNewPassCompair() {
    const { confirmPassword, newPassword } = this.resetPasswordModel;
    return newPassword.startsWith(confirmPassword);
  }

  getConfirmPassCompair() {
    const { confirmPassword, newPassword } = this.resetPasswordModel;
    return newPassword === confirmPassword;
  }

  arePasswordFieldsNotEmpty() {
    const { confirmPassword, newPassword } = this.resetPasswordModel;
    return confirmPassword.length > 0 && newPassword.length > 0;
  }

  areFieldsLengthValidated() {
    const { confirmPassword, newPassword } = this.resetPasswordModel;
    return confirmPassword.length >= 8 && newPassword.length >= 8;
  }

  checkPasswordsLength() {
    const confirmPass = this.resetPasswordModel.confirmPassword;
    const newPass = this.resetPasswordModel.newPassword;

    return confirmPass.length === newPass.length;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
