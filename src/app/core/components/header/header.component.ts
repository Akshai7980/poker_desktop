import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Paths, ScreenId } from 'projects/shared/src/lib/constants/app-constants';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import {
  CommonService,
  DataStorage,
  MATDIALOG,
  MatDialogService,
  SettingsService,
  UtilityService,
  WindowManagerConstant
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import * as SFS2X from 'sfs2x-api';
import { AlertComponent } from 'src/app/modules/auth/components/alert/alert.component';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';
import { CashierComponent } from 'src/app/modules/cashier/cashier.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';

import { CoreCommonService } from '../../services/core-common.service';
import { MatDialogService as MatDialogServiceCore } from '../../services/mat-dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private dataStorage = DataStorage.getInstance();

  assetsThemePath = Paths.themePath;

  assetsImagePath = Paths.imagePath;

  themePath = Paths.themePath;

  userLoggedIn: boolean;

  userName: string;

  isLoginClicked: boolean = false;

  selectedAvatar: string;

  settingsWindow: Window | null;

  gameTableWindow: Window | null;

  spinnerMessage: string = '';

  spinnerStatusText: string = '';

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload() {
    if (this.settingsWindow) this.settingsWindow.close();
  }

  subscriptions: Subscription[] = [];

  constructor(
    public windowCommService: WindowCommService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private authService: AuthService,
    private userPreferencesService: UserPreferencesService,
    private matDialogService: MatDialogService,
    private commonService: CommonService,
    private matDialogServiceCore: MatDialogServiceCore,
    private activatedRoute: ActivatedRoute,
    private coreCommonService: CoreCommonService,
    private sharedUtilityService: UtilityService,
    private settingService: SettingsService
  ) {
    const uname = this.commonService.getUserData();
    this.userName = uname ? uname.value : '';
  }

  ngOnInit(): void {
    this.userLoggedIn = this.localStorageService.getItem('token');
    if (window.location.href.indexOf('dialog') > 0) {
      const param = this.activatedRoute.snapshot.queryParams;
      this.matDialogServiceCore.reOpenDialog(param['dialog']);
    }

    this.detectAvatarChange();

    const userLoginStatusEmitter = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp === true) {
        this.userLoggedIn = true;
        const uname = this.commonService.getUserData();
        this.userName = uname ? uname.value : '';
      } else {
        this.userLoggedIn = false;
        if (resp === undefined) {
          this.openAlertDialog();
        }
      }
    });
    this.subscriptions.push(userLoginStatusEmitter);

    const userNameChangeDetector = this.authService.userNameChangeDetector.subscribe((resp) => {
      if (resp) {
        const uname = this.commonService.getUserData();
        this.userName = uname ? uname.value : '';
      }
    });
    this.subscriptions.push(userNameChangeDetector);

    const profileSub = this.sharedUtilityService.openProfileComponent.subscribe(
      (activeIndex: number) => {
        if (activeIndex && activeIndex + 1) {
          this.openProfileDialog(activeIndex + 1);
        } else {
          this.openProfileDialog(1);
        }
      }
    );

    this.subscriptions.push(profileSub);
  }

  openSettingsWindow() {
    this.coreCommonService.loginForCTA(() => {
      if (this.settingsWindow && !this.settingsWindow.closed) {
        this.settingsWindow.focus();
        let isWindFocused: Boolean = false;
        this.settingsWindow.onfocus = () => {
          isWindFocused = true;
        };
        const winTimeout = setTimeout(() => {
          if (!isWindFocused) {
            this.settingsWindow = window.open(
              ScreenId.SETTINGS,
              ScreenId.SETTINGS,
              `width=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[0]}px,
            height=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[1]}px`
            );
          }
          clearTimeout(winTimeout);
        }, 500);
        return;
      }

      this.settingsWindow = window.open(
        ScreenId.SETTINGS,
        ScreenId.SETTINGS,
        `width=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[0]}px,
        height=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[1]}px`
      );

      this.settingsWindow?.addEventListener('resize', () => {
        this.settingsWindow?.resizeTo(844, 630);
      });
      window.allWindow.set(ScreenId.SETTINGS, this.settingsWindow);
      this.settingsWindow?.addEventListener('ngLoad', () => {
        const toastVar = setTimeout(() => {
          this.settingsWindow?.childWindow.setData(this.dataStorage, this.settingService.themeData);
          this.settingsWindow?.childWindow.setSmartFox(this.dataStorage.sfs, SFS2X);
          this.settingsWindow?.childWindow.setUserPreference(this.userPreferencesService);
          clearTimeout(toastVar);
        }, 100);
      });
    });
  }

  openCashier() {
    this.coreCommonService.loginForCTA(() => {
      this.matDialogService.openDialog(CashierComponent, 'cashier', MATDIALOG.animatedDialog);
    });
  }

  openProfileDialog(step?: number) {
    this.coreCommonService.loginForCTA(() => {
      this.matDialogService.openDialog(ProfileComponent, 'profile', {
        ...MATDIALOG.animatedDialog,
        id: 'poker-profile',
        data: step
      });
      this.matDialogService.dialog.afterAllClosed.subscribe(() => {
        const uname = this.commonService.getUserData();
        this.userName = uname ? uname.value : '';
      });
    });
  }

  openLogin() {
    this.matDialogService.openDialog(LoginComponent, 'login', MATDIALOG.loginDialog);
  }

  // Open Alert Dialog
  openAlertDialog() {
    this.matDialogService.openDialog(AlertComponent, 'login', MATDIALOG.actionDialog);
  }

  detectAvatarChange() {
    const selectedAvatar = this.userPreferencesService.selectedAvatar.subscribe((res: string) => {
      const toastVar = setTimeout(() => {
        this.selectedAvatar = res;
        const data = this.commonService.getUserData();
        if (data) {
          data.avatarId = this.selectedAvatar;
          this.commonService.setUserData(data);
        }
        clearTimeout(toastVar);
      }, 1000);
    });
    this.subscriptions.push(selectedAvatar);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
