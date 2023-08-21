import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  CommonService,
  LobbyService,
  MATDIALOG,
  MatDialogService,
  SfsRequestService
} from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { LoginComponent } from '../auth/components/login/login.component';
import { LobbyModel } from './models/view/lobby-model';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent extends LobbyModel implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  selectedTab: any;

  selectedTable: any;

  subscriptions: Subscription[] = [];

  userLoggedIn: boolean;

  lobbySngData: any;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private matDialogService: MatDialogService,
    private localStorageService: LocalStorageService,
    public override cdr: ChangeDetectorRef,
    public override sfsRequestService: SfsRequestService,
    public override lobbyService: LobbyService,
    public router: Router
  ) {
    super(sfsRequestService, cdr, lobbyService);
  }

  ngOnInit(): void {
    super.onInit();
    const userSub = this.authService.isUserLoggingOut.subscribe((resp) => {
      if (resp) {
        this.onTabSelection(1);
      }
    });
    this.subscriptions.push(userSub);
    const selectedTabAndDataSub = this.lobbyService
      .getSelectedTabAndData()
      .subscribe((res: any) => {
        this.selectedTab = res.selectedTab;
        this.selectedTable = res.selectedTable;
      });
    this.subscriptions.push(selectedTabAndDataSub);
    this.userLoggedIn = this.localStorageService.getItem('token');
    if (!this.userLoggedIn) {
      this.matDialogService.openDialog(LoginComponent, 'login', MATDIALOG.loginDialog);
    }

    this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });

    this.lobbyService.detectSngRowClick.subscribe((resp) => {
      this.lobbySngData = resp;
    });
  }

  onTabSelection(tabId: number) {
    this.selectedTab = tabId;

    const parentCompUrl = this.router.url.split('/')[1];
    switch (tabId) {
      case 1:
        this.commonService.navigateTo(`${parentCompUrl}/cash-games`);
        break;
      case 2:
        this.commonService.navigateTo(`${parentCompUrl}/tournaments`);
        break;
      case 3:
        this.commonService.navigateTo(`${parentCompUrl}/sitandgo`);
        break;
      case 4:
        if (!this.userLoggedIn) {
          this.openLogin();
        } else {
          this.commonService.navigateTo(`${parentCompUrl}/private-tables`);
        }
        break;
      default:
        break;
    }
  }

  openLogin() {
    this.matDialogService.openDialog(LoginComponent, 'login', MATDIALOG.loginDialog);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
