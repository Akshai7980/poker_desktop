import { Clipboard } from '@angular/cdk/clipboard';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NavigationBehaviorOptions, Router } from '@angular/router';
import {
  BaseResponse,
  CommonService,
  MessageConstant,
  Paths
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs/internal/Subscription';

import { MATDIALOG } from '../../constants/dialog.constants';
import { KnowMoreComponent } from '../../dialogs/know-more/know-more.component';
import { EarningsPointsResponse } from '../../models/response/earnings-point.response';
import { RAFBonusResponse } from '../../models/response/raf-bonus.response';
import { RAFService } from '../../services/raf.service';
import { RAF, RAF_CONSTANTS } from '../../constants/app-constants';
import { RAFBannerResponse } from '../../models/response/banner-raf.response';

@Component({
  selector: 'app-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 gap16';

  assetsImagePath = Paths.imagePath;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  userId: number;

  rafBonusList: RAFBonusResponse = {} as RAFBonusResponse;

  referCode: string;

  rafEarningPoints: EarningsPointsResponse = {} as EarningsPointsResponse;

  toggleValue: boolean = false;

  bannerData: RAFBannerResponse;

  bannerUrl: string;

  constructor(
    private rafService: RAFService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private clipBoard: Clipboard,
    private route: Router
  ) {}

  ngOnInit(): void {
    const user = this.commonService.getUserData();
    this.userId = user?.userId;
    this.getBannerRaf();
    this.getRafBonusList();
    this.getEarningPoints();
  }

  getRafBonusList() {
    const getRafBonusList$ = this.rafService.getRafBonusList(this.userId);
    const getRafBonusList: Subscription = getRafBonusList$.subscribe({
      next: (res: RAFBonusResponse) => {
        this.rafBonusList = res;
        [, this.referCode] = res.link.split('refer_code=');
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getRafBonusList);
  }

  getEarningPoints() {
    const getEarningPoints$ = this.rafService.getEarningPoints();
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<EarningsPointsResponse>) => {
        this.rafEarningPoints = res.data;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getEarningPoints);
  }

  openDialog() {
    this.dialog.open(KnowMoreComponent, {
      ...MATDIALOG.animatedSingleDialog,
      data: { from: RAF_CONSTANTS.REFER_FRIEND }
    });
  }

  copyToClipboard(copiedText: string) {
    this.clipBoard.copy(copiedText);
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.CopyCode,
      flag: RAF_CONSTANTS.SUCCESS_FLAG
    };
  }

  onToggleChange(event: MatSlideToggleChange) {
    this.toggleValue = event.checked;
  }

  onClick() {
    const sendData = this.rafEarningPoints;
    const data: NavigationBehaviorOptions = {};
    data.state = sendData;
    this.route.navigateByUrl('invite-earn/referral-points', { state: data.state });
  }

  openWindow(url: string): void {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    }
  }

  onClickLink(source: string) {
    const message = MessageConstant.ReferMessage;
    let shareUrl;
    switch (source) {
      case 'whatsapp': {
        let whatsAppLink = `https://web.whatsapp.com/send?text=${message}`;
        whatsAppLink = whatsAppLink.replace('{link}', this.rafBonusList.link);
        whatsAppLink = whatsAppLink.replace('{code}', this.referCode);
        shareUrl = whatsAppLink;
        this.openWindow(shareUrl);
        break;
      }

      case 'facebook': {
        let facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          `${message}`
        )}`;
        facebookLink = facebookLink.replace('{link}', this.rafBonusList.link);
        facebookLink = facebookLink.replace('{code}', this.referCode);
        shareUrl = facebookLink;
        this.openWindow(shareUrl);
        break;
      }

      case 'mail': {
        let mailLink = `https://mail.google.com/mail/?view=cm&fs=1&&su=Refer and Earn&body=${encodeURIComponent(
          `${message}`
        )}`;
        mailLink = mailLink.replace('{link}', this.rafBonusList.link);
        mailLink = mailLink.replace('{code}', this.referCode);
        shareUrl = mailLink;
        this.openWindow(shareUrl);
        break;
      }
      default:
        break;
    }
  }

  getBannerRaf() {
    const getBannerRaf$ = this.rafService.getBannerRaf(
      RAF_CONSTANTS.DESKTOP_RAF,
      RAF_CONSTANTS.PLACES_RAF
    );
    const getBannerRaf: Subscription = getBannerRaf$.subscribe({
      next: (res: BaseResponse<RAFBannerResponse>) => {
        if (res.code === RAF.SUCCESS) {
          this.bannerData = res.data;
          this.bannerUrl = this.bannerData.v2_poker_raf[0].fields.for_desktop.url;
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getBannerRaf);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
