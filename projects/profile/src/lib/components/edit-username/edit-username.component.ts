import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { APIResponseCode, Paths } from '../../constants/app-constants';
import { UserDataModel } from '../../models/view/unnamed-data-model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-username',
  templateUrl: './edit-username.component.html',
  styleUrls: ['./edit-username.component.scss']
})
export class EditUsernameComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  isAlreadyTakenUsername: boolean = true;

  editUsernameForm: FormGroup = new FormGroup({});

  alphabetPattern: boolean = false;

  minMaxCharPatter: boolean = false;

  noSpecialCharPattern: boolean = false;

  disableSubmitBtn: boolean = true;

  isShowToast: boolean;

  isUserNameExists: boolean;

  suggestedUserNames: any;

  toastValue: ToastModel;

  username: UserDataModel;

  selectedAvatar: string;

  currentSuggestedUsername: string;

  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private dialogRef: MatDialogRef<EditUsernameComponent>,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.username = this.commonService.getUserData();
    this.selectedAvatar = this.username?.avatarId;
    this.editUsernameForm = this.formBuilder.group({
      currentUsername: [''],
      newUsername: ['']
    });

    this.editUsernameForm.controls['currentUsername'].setValue(this.username?.value);
  }

  onClose() {
    const profileDialog = this.dialog.getDialogById('poker-profile');
    profileDialog?.close();
    this.goBackToProfile();
  }

  validateUserName(data: string) {
    this.isUserNameExists = false;
    this.alphabetPattern = /[A-Za-z]/.test(data);
    this.minMaxCharPatter = /^.{3,20}$/.test(data);
    this.noSpecialCharPattern = /^[^._!@#?>*&()<%/]+$/.test(data);

    if (this.alphabetPattern && this.minMaxCharPatter && this.noSpecialCharPattern) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
      this.isUserNameExists = false;
    }
    this.currentSuggestedUsername = '';
  }

  validateUserNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const { value } = input;
    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(value)) {
      input.value = value.replace(/[^a-zA-Z0-9]/g, '');
    }
  }

  submitUserName() {
    this.disableSubmitBtn = true;
    const newUserName = this.editUsernameForm.controls['newUsername']?.value;

    const getUserName = this.profileService.getUserName(newUserName).subscribe((resp) => {
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
          value: this.editUsernameForm.controls['newUsername']?.value,
          changed: true,
          avatar: this.username?.avatarId,
          userId: this.username?.userId,
          avatarId: this.username?.avatarId
        };
        this.commonService.setUserData(userData);
        this.profileService.userNameChangeDetector.next(true);

        this.dialogRef.close(this.editUsernameForm.controls['newUsername']?.value);
      }
    });
    this.subscriptions.push(getUserName);
  }

  changeUserName(userName: string) {
    this.disableSubmitBtn = false;
    this.isUserNameExists = true;
    this.editUsernameForm.controls['newUsername'].setValue(userName);
    this.currentSuggestedUsername = userName;
  }

  goBackToProfile() {
    this.profileService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
