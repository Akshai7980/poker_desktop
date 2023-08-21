import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService, MessageConstant, Paths } from 'projects/shared/src/public-api';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs/internal/Subscription';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialogRef } from '@angular/material/dialog';
import { Languages } from '../../models/models';
import { RAFBonusResponse } from '../../models/response/raf-bonus.response';
import { RAFService } from '../../services/raf.service';
import { RAF_CONSTANTS } from '../../constants/app-constants';

@Component({
  selector: 'app-refer-now',
  templateUrl: './refer-now.component.html',
  styleUrls: ['../../../assets/styles/_shared.scss']
})
export class ReferNowComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  supportedLanguages = RAF_CONSTANTS.NO_DATA;

  selectedLanguage: Languages;

  toggleValue: boolean = false;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  userId: number;

  referCode: string;

  rafBonusList: RAFBonusResponse;

  constructor(
    private commonService: CommonService,
    private rafService: RAFService,
    private clipBoard: Clipboard,
    private readonly dialogRef: MatDialogRef<ReferNowComponent>
  ) {}

  ngOnInit() {
    const user = this.commonService.getUserData();
    this.userId = user?.userId;
    this.getRafBonusList();
  }

  onToggleChange(event: MatSlideToggleChange) {
    this.toggleValue = event.checked;
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

  copyToClipboard(copiedText: string) {
    this.clipBoard.copy(copiedText);
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.CopyCode,
      flag: RAF_CONSTANTS.SUCCESS_FLAG
    };
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

  onClose(): void {
    this.rafService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
