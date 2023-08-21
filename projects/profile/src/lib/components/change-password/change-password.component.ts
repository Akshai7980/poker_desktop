import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService, LocalStorageService, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { APIResponseCode, Paths, ToastTime } from '../../constants/app-constants';
import { PasswordChangeModel } from '../../models/view/password-change.model';
import { UserDataModel } from '../../models/view/unnamed-data-model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  resetPasswordModel: PasswordChangeModel;

  assetsImagePath = Paths.imagePath;

  changePasswordForm: FormGroup = new FormGroup({});

  invalidFields: boolean = false;

  currentPasswordEyeImagePath: string = 'password-eye-slash.svg';

  newPasswordEyeImagePath: string = 'password-eye-slash.svg';

  confirmPasswordEyeImagePath: string = 'password-eye-slash.svg';

  currentPasswordType: string = 'password'; // To show/hide password

  enableConfirmBtn: boolean;

  verifiedImagePath: string = 'verify-light.svg';

  newPasswordType: string = 'password';

  confirmPasswordType: string = 'password';

  showStatusText: boolean = false;

  toastValue: ToastModel;

  isShowToast: boolean = false;

  userName: any;

  selectedAvatar: any;

  ShowIncorrectText: boolean = false;

  @Output() showProfilesList = new EventEmitter<boolean>();

  subscriptions: Subscription[] = [];

  toastTime: number = ToastTime.NOTIFICATION;

  constructor(
    private profileService: ProfileService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    public localStorageService: LocalStorageService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.resetPasswordModel = new PasswordChangeModel('', '', '');
  }

  ngOnInit(): void {
    const userData: UserDataModel = this.commonService.getUserData();
    this.userName = userData?.value;
    this.selectedAvatar = userData?.avatarId;
  }

  onClose() {
    const profileDialog = this.dialog.getDialogById('poker-profile');
    profileDialog?.close();
    this.profileService.toggleAnimationDialog(this.dialogRef);
  }

  showNewPassword() {
    if (this.newPasswordType === 'password') {
      this.newPasswordType = 'text';
      this.newPasswordEyeImagePath = 'password-eye.svg';
    } else {
      this.newPasswordType = 'password';
      this.newPasswordEyeImagePath = 'password-eye-slash.svg';
    }
  }

  showConfirmPassword() {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordEyeImagePath = 'password-eye.svg';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordEyeImagePath = 'password-eye-slash.svg';
    }
  }

  OnCurrentPassWordChange() {
    if (
      this.ShowIncorrectText &&
      this.resetPasswordModel.newPassword === this.resetPasswordModel.confirmPassword
    ) {
      this.ShowIncorrectText = false;
      this.enableConfirmBtn = true;
    }
  }

  showCurrentPassword() {
    if (this.currentPasswordType === 'password') {
      this.currentPasswordType = 'text';
      this.currentPasswordEyeImagePath = 'password-eye.svg';
    } else {
      this.currentPasswordType = 'password';
      this.currentPasswordEyeImagePath = 'password-eye-slash.svg';
    }
  }

  onNewPasswordChange() {
    if (
      this.resetPasswordModel.newPassword.length >= 8 &&
      this.resetPasswordModel.newPassword.length <= 20
    ) {
      if (
        this.resetPasswordModel.confirmPassword.length > 0 &&
        this.resetPasswordModel.confirmPassword === this.resetPasswordModel.newPassword
      ) {
        this.enableConfirmBtn = true;
        this.showStatusText = false;
      } else {
        this.enableConfirmBtn = false;
        this.showStatusText = true;
      }

      this.verifiedImagePath = 'verify-green.svg';
    } else {
      this.verifiedImagePath = 'verify-light.svg';
      this.enableConfirmBtn = false;
    }
  }

  onConfirmPasswordChange() {
    if (
      this.resetPasswordModel.newPassword.length >= 8 &&
      this.resetPasswordModel.newPassword.length <= 20
    ) {
      if (
        this.resetPasswordModel.newPassword.length > 0 &&
        this.resetPasswordModel.confirmPassword === this.resetPasswordModel.newPassword
      ) {
        this.enableConfirmBtn = true;
        this.showStatusText = false;
      } else {
        this.enableConfirmBtn = false;
        this.showStatusText = true;
      }
    } else this.enableConfirmBtn = false;
  }

  onCurrentPasswordChange() {
    if (this.ShowIncorrectText) {
      this.ShowIncorrectText = false;
    }

    if (
      this.resetPasswordModel.confirmPassword.length >= 8 &&
      this.resetPasswordModel.confirmPassword.length <= 20 &&
      this.resetPasswordModel.newPassword.length >= 8 &&
      this.resetPasswordModel.newPassword.length <= 20 &&
      this.resetPasswordModel.currentPassword.length > 0
    ) {
      if (this.resetPasswordModel.currentPassword.length > 0) {
        this.enableConfirmBtn = true;
      } else {
        this.enableConfirmBtn = false;
      }
    } else this.enableConfirmBtn = false;
  }

  onConfirmClicked() {
    if (this.resetPasswordModel.newPassword !== this.resetPasswordModel.confirmPassword) {
      this.showStatusText = true;
    } else {
      const changePassword = this.profileService
        .changePassword(this.resetPasswordModel)
        .subscribe((resp) => {
          if (resp.code === APIResponseCode.AUTH.SUCCESS) {
            this.isShowToast = true;
            this.showStatusText = false;
            this.enableConfirmBtn = false;
            this.toastValue = {
              message: resp.message,
              flag: 'success'
            };
            const timeoutId = setTimeout(() => {
              this.dialogRef.close();
              clearTimeout(timeoutId);
            }, this.toastTime);

            this.showProfilesList.emit(true);
          } else if (resp.code === APIResponseCode.AUTH.INCORRECT_PASSWORD) {
            this.ShowIncorrectText = true;
            this.enableConfirmBtn = false;
          } else {
            this.isShowToast = true;

            this.toastValue = {
              message: resp.message,
              flag: 'error'
            };
          }
        });
      this.subscriptions.push(changePassword);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
