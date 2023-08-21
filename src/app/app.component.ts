import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import {
  CommonService,
  ScreenId,
  SfsCommService,
  SocketCommandModel,
  SocketCommService,
  SpinnerData,
  SpinnerService,
  UserAccountService,
  UtilityService
} from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  ComponentConstant,
  MessageConstants,
  NotificationConstants
} from './modules/share/constants/shared-module-constants';
import { AppNotificationService } from './modules/share/service/app-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  // implements OnInit
  title = 'poker2';

  displayProgressSpinner: boolean = false;

  spinnerStatusText: string = '';

  spinnerMessage: string = '';

  userLoggedIn: boolean = false;

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'token' && event.oldValue != null && event.newValue === null) {
      this.commonService.executeUnAuthorizedAccess();
      this.commonService.navigateTo(ScreenId.LOBBY);
    }
  }

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private userAccountService: UserAccountService,
    private utilityService: UtilityService,
    private sfsCommService: SfsCommService,
    private socketCommService: SocketCommService,
    private notificationService: AppNotificationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!router.navigated) {
          const token = this.localStorageService.getItem('token');
          if (token) {
            this.authService.isLogged = true;
            this.authService.loginSessionId = token;
            this.userAccountService.isLogged = true;
            if (
              !window.location.pathname.toString().includes('/settings') &&
              !window.location.pathname.toString().includes('/game-table') &&
              !window.location.href.toString().includes('/cash-games?dialog=profile') &&
              !window.location.href.toString().includes('/addcash')
            ) {
              this.sfsCommService.startReconnection();
            } else {
              this.sfsCommService.isChildWindow = true;
            }
            // for adhaar verification
            if (window.location.href.toString().includes('?profile_id=')) {
              window.opener.postMessage('Call KYC Socket', window.location.origin);
              setTimeout(() => {
                window.self.close();
              }, 1000);
            }
          }
        }
      }
    });
  }

  ngOnInit() {
    this.utilityService.addApmScript();

    this.spinnerService.displaySpinnerSubject.subscribe((resp: SpinnerData) => {
      this.displayProgressSpinner = resp.status ? resp.status : false;
      this.spinnerStatusText = resp.statusText;
      this.spinnerMessage = resp.message;
      this.cdr.detectChanges();
    });
    const logInStatus = this.localStorageService.getItem('token');
    if (logInStatus) {
      this.makeSocketConnection();
    }
    this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp === true) {
        this.makeSocketConnection();
      }
    });

    this.socketCommService.socketCommandSubject.subscribe((event: SocketCommandModel) => {
      if (event.cmd === 'onAdminmessage') {
        this.notificationService.openNotification(
          ComponentConstant.HAND_HISTORY,
          NotificationConstants.TYPE_INFO,
          MessageConstants.DOWNLOAD_READY
        );
      }
    });
  }

  private makeSocketConnection() {
    if (!this.socketCommService.hasSocketConnecion) {
      this.socketCommService.hasSocketConnecion = true;
      this.socketCommService.connectSocket();
    }
  }
}
