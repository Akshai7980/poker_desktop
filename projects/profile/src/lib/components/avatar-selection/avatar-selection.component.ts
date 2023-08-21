import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { APIResponseCode, Avatar, Paths, ToastTime } from '../../constants/app-constants';
import { BaseResponse } from '../../models/common/base-response.model';
import { UpdateAvatarResponseModel } from '../../models/response/update-avatar-response.model';
import { UpdateAvatarModel } from '../../models/view/update-avtar-model';
import { ProfileService } from '../../services/profile.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['../../../assets/components/avatar.scss', '../../../assets/components/common.scss']
})
export class AvatarSelectionComponent implements OnDestroy {
  assetsImagePath = Paths.imagePath;

  avatars: string[] = Avatar.avatars;

  @Output() data = new EventEmitter<string>();

  updateAvatar: UpdateAvatarModel = new UpdateAvatarModel('');

  isShowToast: boolean = false;

  toastValue: ToastModel;

  currentIndex: number = 0;

  subscriptions: Subscription[] = [];

  toastTime: number = ToastTime.NOTIFICATION;

  secondLeftImage: number;

  firstLeftImage: number;

  firstRightImage: number;

  secondRightImage: number;

  constructor(
    private profileService: ProfileService,
    private dialogRef: MatDialogRef<AvatarSelectionComponent>,
    private commonService: CommonService,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) {
    const data = this.commonService.getUserData();
    const avatarId = this.avatars.indexOf(data?.avatarId);
    this.currentIndex = avatarId !== -1 ? avatarId : 0;
    this.validateImageSequence();
  }

  getImage(currentIndex: number) {
    return this.avatars[currentIndex];
  }

  onClose() {
    const profileDialog = this.dialog.getDialogById('poker-profile');
    profileDialog?.close();
    this.goBackToProfile();
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.avatars.length - 1;
    }
    this.selectAvatar(this.currentIndex);
  }

  next() {
    if (this.currentIndex < this.avatars.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
    this.selectAvatar(this.currentIndex);
  }

  selectAvatar(selectedIndex: number) {
    if (selectedIndex >= 0 && selectedIndex <= this.avatars.length - 1) {
      this.currentIndex = selectedIndex;
      this.avatars.at(this.currentIndex);
      this.data.emit(this.avatars.at(this.currentIndex));
      this.validateImageSequence();
    }
  }

  confirm() {
    const selectedAvatar: string = this.avatars.at(this.currentIndex) ?? '';
    this.updateAvatar.avtarId = selectedAvatar;
    const upDateAvatar = this.profileService
      .upDateAvatar(this.updateAvatar)
      .subscribe((resp: BaseResponse<UpdateAvatarResponseModel>) => {
        if (resp.code === APIResponseCode.AUTH.SUCCESS) {
          const data = this.commonService.getUserData();
          data.avatarId = selectedAvatar;

          this.commonService.setUserData(data);
          this.sharedService.setAvatar(selectedAvatar);
          this.isShowToast = true;
          this.toastValue = {
            message: resp.message,
            flag: 'success'
          };
          const toastVar = setTimeout(() => {
            this.dialogRef.close();
            clearTimeout(toastVar);
          }, this.toastTime);
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
        }
      });
    this.subscriptions.push(upDateAvatar);

    this.data.emit(this.avatars.at(this.currentIndex));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  validateImageSequence() {
    switch (this.currentIndex) {
      case 0:
        this.firstLeftImage = 24;
        this.secondLeftImage = 25;
        this.firstRightImage = 1;
        this.secondRightImage = 2;
        break;
      case 1:
        this.firstLeftImage = 25;
        this.secondLeftImage = 0;
        this.firstRightImage = 2;
        this.secondRightImage = 3;
        break;
      case 25:
        this.firstLeftImage = 23;
        this.secondLeftImage = 24;
        this.firstRightImage = 0;
        this.secondRightImage = 1;
        break;
      case 24:
        this.firstLeftImage = 22;
        this.secondLeftImage = 23;
        this.firstRightImage = 25;
        this.secondRightImage = 0;
        break;
      default:
        this.firstLeftImage = this.currentIndex - 2;
        this.secondLeftImage = this.currentIndex - 1;
        this.firstRightImage = this.currentIndex + 1;
        this.secondRightImage = this.currentIndex + 2;
        break;
    }
  }

  goBackToProfile() {
    this.profileService.toggleAnimationDialog(this.dialogRef);
  }
}
