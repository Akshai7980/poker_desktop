import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScreenId } from 'projects/cashier/src/lib/constants/app-constants';
import { WindowManagerConstant } from 'projects/cashier/src/lib/constants/window-manager-constant';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  APIResponseCode,
  BaseResponse,
  CommonService,
  DataStorage,
  MATDIALOG,
  MessageConstant,
  Paths,
  UpdateAvatarModel,
  UpdateAvatarResponseModel,
  UserDataModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import * as SFS2X from 'sfs2x-api';

import { UsernameComponent } from '../username/username.component';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, AfterViewInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  userName: UserDataModel;

  selectedAvatar: string;

  isShowToast: boolean = false;

  updateAvatar: UpdateAvatarModel = new UpdateAvatarModel('');

  isGoToLobby: boolean = true;

  addCashWindow: any;

  isHighlightPlayBtn: boolean = false;

  isHighlightDepositBtn: boolean = false;

  @ViewChild('parentEl') parentEl!: ElementRef;

  toastValue: ToastModel;

  subscriptions: Subscription[] = [];

  private dataStorage = DataStorage.getInstance();

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<AvatarComponent>,
    private localStorageService: LocalStorageService,
    private userPreferenceService: UserPreferencesService
  ) {}

  ngOnInit(): void {
    this.userName = this.commonService.getUserData();
    this.authService.bonusDetails.next(this.localStorageService.getItem('bonusInfo'));

    if (this.userName.userId % 2 === 1) {
      this.isHighlightDepositBtn = true;
    } else {
      this.isHighlightPlayBtn = true;
    }
  }

  ngAfterViewInit(): void {
    const currentMessage = this.authService.currentMessage.subscribe((resp: string) => {
      this.selectedAvatar = resp;
    });
    this.subscriptions.push(currentMessage);
  }

  onClose() {
    this.dialog.closeAll();
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  openDialog() {
    this.dialog
      .open(UsernameComponent, MATDIALOG.userNameDialog)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.userName = result;
        }
      });
  }

  startPlaying() {
    if (this.isGoToLobby === true) {
      this.dialog.closeAll();
    } else {
      this.updateAvatar.avtarId = this.selectedAvatar;
      const upDateAvatar = this.authService
        .upDateAvatar(this.updateAvatar)
        .subscribe((resp: BaseResponse<UpdateAvatarResponseModel>) => {
          if (resp.code === APIResponseCode.AUTH.SUCCESS) {
            const data = this.commonService.getUserData();
            data.avatarId = this.selectedAvatar;
            this.commonService.setUserData(data);
            this.dialog.closeAll();
            this.userPreferenceService.selectedAvatar.next(this.selectedAvatar);
          } else {
            this.isShowToast = true;
            this.toastValue = {
              message: resp.message,
              flag: 'error'
            };
          }
        });
      this.subscriptions.push(upDateAvatar);
    }
  }

  getAvatarId(id: string) {
    if (id) {
      this.selectedAvatar = id;
      this.isGoToLobby = false;
    } else {
      this.isGoToLobby = true;
    }
  }

  openAddCashDialog() {
    this.dialog.closeAll();
    if (this.addCashWindow && !this.addCashWindow.closed) {
      this.addCashWindow.focus();
      let isWindFocused: boolean = false;
      this.addCashWindow.onfocus = () => {
        isWindFocused = true;
      };
      if (!isWindFocused) {
        this.addCashWindow = window.open(
          ScreenId.ADD_CASH,
          MessageConstant.AddCash,
          `width=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[0]}px,
              height=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[1]}px`
        );
      }
      return;
    }

    this.addCashWindow = window.open(
      ScreenId.ADD_CASH,
      MessageConstant.AddCash,
      `width=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[0]}px,
        height=${WindowManagerConstant.WINDOW_SIZE.ADD_CASH[1]}px`
    );
    this.addCashWindow?.addEventListener('resize', () => {
      this.addCashWindow?.resizeTo(376, 668);
    });
    window.allWindow?.set(ScreenId.ADD_CASH, this.addCashWindow);
    const timeoutVar = setTimeout(() => {
      this.addCashWindow?.addEventListener('ngLoad', () => {
        const { addCashChildWindow } = this.addCashWindow;
        addCashChildWindow?.setData(this.dataStorage);
        addCashChildWindow?.setCashData(0);
        addCashChildWindow?.setSmartFox(this.dataStorage.sfs, SFS2X);
        addCashChildWindow?.setUserPreference(this.userPreferenceService);
        window.allWindow.set('cahier', this.addCashWindow);
        this.dialog.closeAll();
        clearTimeout(timeoutVar);
      });
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
