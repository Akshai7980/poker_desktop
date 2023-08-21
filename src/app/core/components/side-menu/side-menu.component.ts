import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';

import {
  CommonService,
  MATDIALOG,
  Paths,
  ScreenId,
  SfsCommService,
  SideMenu
} from 'projects/shared/src/public-api';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms', style({ height: '0', opacity: 0, overflow: 'hidden' }))
      ])
    ])
  ]
})
export class SideMenuComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  displayTime: string = '';

  showMore: boolean = false;

  userLoggedIn: boolean = false;

  currentRoute: string;

  private subscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private localStorageService: LocalStorageService,
    private commonService: CommonService,
    private sfsService: SfsCommService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = event.url;
      });

    this.startTime();
    this.sideMenus = this.commonService.getSideMenu(5);

    const logInStatus = this.localStorageService.getItem('token');
    if (logInStatus) {
      this.userLoggedIn = true;
    }
    this.subscription = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp === true) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  viewMore(value: boolean) {
    this.showMore = value;
  }

  open(route: string) {
    if (this.userLoggedIn) {
      this.router.navigate([route]);
    } else if (route === ScreenId.CONTACT_US) {
      // window.open(`${environment.config.GUEST_CONTACT_US}/customer-support`, '_blank');
      this.router.navigate([route]);
    } else if (route === ScreenId.LOBBY) {
      this.router.navigate([route]);
      if (!this.userLoggedIn) this.dialog.open(LoginComponent, MATDIALOG.loginDialog);
    } else {
      // open Login Dialog
      this.dialog.open(LoginComponent, MATDIALOG.loginDialog);
    }
  }

  logout() {
    this.sfsService.sendLogoutRequest();
    this.commonService.navigateTo(ScreenId.LOBBY);

    // this.authService.executeLogOut().subscribe((resp) => {
    //   if (resp.code == APIResponseCode.AUTH.SUCCESS) {
    //     this.localStorageService.removeItem("userLoggedIn");
    //     this.localStorageService.removeItem("unamedata");
    //     this.localStorageService.removeItem("token");
    //
    //     this.authService.userLoginStatusEmitter.next(false);
    //     this.authService.loginSessionId = "";
    //     this.userAccountService.isLogged = false;

    //   }
    // },
    //   (error) => {
    //     alert(error)
    //   }
    // )
  }

  startTime() {
    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    const mStr = this.checkTime(m);
    const sStr = this.checkTime(s);
    this.displayTime = `${h}:${mStr}:${sStr}`;
    const toastVar = setTimeout(() => {
      this.startTime();
      clearTimeout(toastVar);
    }, 1000);
  }

  checkTime(i: number) {
    let modifiedI: string = i.toString();
    if (i < 10) {
      modifiedI = `0${i}`;
    }
    return modifiedI;
  }

  sideMenus: SideMenu[];

  isShowMoreClicked: boolean = false;

  showMoreOrLessToggle() {
    this.isShowMoreClicked = !this.isShowMoreClicked;
    if (this.isShowMoreClicked) {
      this.sideMenus = this.commonService.getSideMenu(14);
    } else {
      this.sideMenus = this.commonService.getSideMenu(5);
    }
  }
}
