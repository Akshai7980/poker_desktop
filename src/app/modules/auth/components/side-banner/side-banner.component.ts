import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  BannerV2PokerLoginSignupModel,
  BaseResponse,
  CommonService,
  MATDIALOG,
  ScreenId,
  V2PokerLoginSignup
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs/internal/Subscription';
import { ContactUsComponent } from 'src/app/modules/contact-us/contact-us/contact-us.component';
import { Router } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-side-banner',
  templateUrl: './side-banner.component.html'
})
export class SideBannerComponent implements OnInit, OnDestroy {
  enteredMobileNumber: any;

  avatar = AvatarComponent;

  conactUs = ContactUsComponent;

  lhsCrousels: V2PokerLoginSignup[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
    public commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getLoginSignupBanners();
  }

  getLoginSignupBanners() {
    const queryParam = {
      client: 'poker2',
      places: 'v2_poker_login_signup'
    };
    const loginSignupBanner = this.authService
      .getLoginSignupBannerDetails(queryParam)
      .subscribe((resp: BaseResponse<BannerV2PokerLoginSignupModel>) => {
        this.lhsCrousels = resp.data.v2_poker_login_signup;
        this.lhsCrousels = this.lhsCrousels.slice(0, 5);
      });
    this.subscriptions.push(loginSignupBanner);
  }

  openDialog(component: any, flag: number) {
    this.authService.userLoginStatusEmitter.next(true);

    if (flag === 1) {
      this.dialogRef.close();
    }

    this.dialog.open(component, {
      data: { flag: 1, data: this.enteredMobileNumber },
      ...MATDIALOG.mobileNumberVerification
    });
  }

  openContactUsScreen() {
    // window.open(`${environment.config.GUEST_CONTACT_US}/customer-support`);
    this.dialogRef.close();
    this.router.navigate([ScreenId.CONTACT_US]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
