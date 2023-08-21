import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { APIResponseCode, CommonService, Paths } from 'projects/shared/src/public-api';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  isUserNameExists: boolean = false;

  userName: string = '';

  existingUserName: any;

  suggestedUserNames: [];

  isShowToast: boolean = false;

  toastValue: ToastModel;

  alphabetPattern: boolean = false;

  minMaxCharPatter: boolean = false;

  noSpecialCharPattern: boolean = false;

  disableSubmitBtn: boolean = true;

  currentSuggestedUsername: string;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<UsernameComponent>,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.existingUserName = this.commonService.getUserData();
    if (this.authService.bonusDetails) {
      this.authService.bonusDetails.next(this.localStorageService.getItem('bonusInfo'));
    }
  }

  onClose() {
    this.dialog.closeAll();
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  validateUserName(data: any) {
    this.isUserNameExists = false;
    this.alphabetPattern = /[A-Za-z]/.test(data);
    this.minMaxCharPatter = /^.{3,20}$/.test(data);
    this.noSpecialCharPattern = /^[^._!@#%]+$/.test(data);
    if (this.alphabetPattern && this.minMaxCharPatter && this.noSpecialCharPattern) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
      this.isUserNameExists = false;
    }
    this.currentSuggestedUsername = '';
  }

  onKeyDown(event: any) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }

  submitUserName() {
    this.disableSubmitBtn = true;
    const getUserName = this.authService.getUserName(this.userName).subscribe((resp) => {
      if (resp.code === APIResponseCode.AUTH.USERNAME_EXIST) {
        this.isUserNameExists = true;
        this.suggestedUserNames = resp.data;
      } else if (resp.code === APIResponseCode.AUTH.RESTRICTED) {
        this.isShowToast = true;
        this.toastValue = {
          message: resp.message,
          flag: 'error'
        };
      } else if (resp.code === APIResponseCode.AUTH.SUCCESS) {
        const userData = {
          value: this.userName,
          changed: true,
          avatar: this.existingUserName?.avatarId,
          userId: this.existingUserName?.userId,
          avatarId: this.existingUserName?.avatarId
        };

        this.commonService.setUserData(userData);
        this.authService.userNameChangeDetector.next(true);

        // Navigating to Avatar component
        const userNameObj = {
          value: this.userName,
          changed: true
        };
        this.dialogRef.close(userNameObj);
      }
    });
    this.subscriptions.push(getUserName);
  }

  changeUserName(userName: string) {
    this.isUserNameExists = false;
    this.disableSubmitBtn = false;
    this.userName = userName;
    this.currentSuggestedUsername = userName;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
