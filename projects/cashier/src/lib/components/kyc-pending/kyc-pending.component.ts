import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { colors } from 'projects/cashier/src/assets/abstract/colorsConfig';
import {
  BaseResponse,
  CommonService,
  GlobalConstant,
  UtilityService
} from 'projects/shared/src/public-api';
import { Subscription, combineLatest } from 'rxjs';
import { Paths } from '../../constants/app-constants';
import { NewProfileResponseModel } from '../../models/response/new-profile-response';
import { CashierService } from '../../services/cashier.service';
import { CustomTimeLine } from '../models/cashier.model';

@Component({
  selector: 'app-kyc-pending',
  templateUrl: './kyc-pending.component.html',
  styleUrls: ['./kyc-pending.component.scss']
})
export class KycPendingComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  layout: string = 'horizontal';

  kycPendingTimeLines: CustomTimeLine[];

  userName: string;

  activeIndex: number;

  subscriptions: Subscription[] = [];

  colors = colors;

  personalData: NewProfileResponseModel;

  constructor(
    public dialogRef: DialogRef,
    public cashierService: CashierService,
    public dialog: MatDialog,
    private sharedUtilityService: UtilityService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.newProfile();
    const userData = this.commonService.getUserData();
    this.userName = userData?.value;
  }

  newProfile() {
    const newProfile = combineLatest([
      this.cashierService.createNewProfile(),
      this.cashierService.getKycDetails()
    ]).subscribe(
      (res: [BaseResponse<NewProfileResponseModel>, BaseResponse<NewProfileResponseModel>]) => {
        this.personalData = res[0].data;
        const perSonalData = res[0].data.userInfo;
        const kycData = res[1].data;

        if (
          kycData.isPanVerified &&
          kycData.isKycVerified &&
          ((kycData.isSelfieMandatory && kycData.isSelfieVerified) || !kycData.isSelfieMandatory) &&
          perSonalData.isMobileVerified === 1 &&
          perSonalData.isEmailVerified === 1 &&
          kycData.isBankVerified
        ) {
          this.dialogRef.close('KYC_COMPLETED');
        } else if (
          !kycData.isBankVerified &&
          ((kycData.isSelfieMandatory && kycData.isSelfieVerified) || !kycData.isSelfieMandatory) &&
          kycData.isPanVerified &&
          kycData.isKycVerified &&
          perSonalData.isMobileVerified === 1 &&
          perSonalData.isEmailVerified === 1
        ) {
          this.activeIndex = 2;

          this.kycPendingTimeLines = [
            {
              title: GlobalConstant.CASHIER.TITLE_PAN,
              icon: 'CheckCircle.svg',
              color: this.colors['secondary-success'],
              status: 'success',
              iconColor: this.colors['primary-success']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_KYC,
              icon: 'CheckCircle.svg',
              color: this.colors['secondary-success'],
              status: 'success',
              iconColor: this.colors['primary-success']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_SELFIE,
              icon: 'CheckCircle.svg',
              color: this.colors['secondary-success'],
              status: 'success',
              iconColor: this.colors['primary-success']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_BANK,
              icon: '4',
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending',
              borderColor: this.colors['primary-error'],
              iconColor: this.colors['primary-error']
            }
          ];
        } else if (
          kycData.isSelfieMandatory &&
          !kycData.isSelfieVerified &&
          kycData.isPanVerified &&
          kycData.isKycVerified &&
          perSonalData.isMobileVerified === 1 &&
          perSonalData.isEmailVerified === 1
        ) {
          this.activeIndex = 1;

          this.kycPendingTimeLines = [
            {
              title: GlobalConstant.CASHIER.TITLE_PAN,
              icon: 'CheckCircle.svg',
              color: this.colors['secondary-success'],
              status: 'success',
              iconColor: this.colors['primary-success']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_KYC,
              icon: 'CheckCircle.svg',
              color: this.colors['secondary-success'],
              status: 'success',
              iconColor: this.colors['primary-success']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_SELFIE,
              icon: 3,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending',
              borderColor: this.colors['primary-error'],
              iconColor: this.colors['primary-error']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_BANK,
              icon: 4,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            }
          ];
        } else if (
          !kycData.isKycVerified &&
          perSonalData.isMobileVerified === 1 &&
          perSonalData.isEmailVerified === 1 &&
          kycData.isPanVerified
        ) {
          this.activeIndex = 1;

          this.kycPendingTimeLines = [
            {
              title: GlobalConstant.CASHIER.TITLE_PAN,
              icon: 'CheckCircle.svg',
              color: this.colors['secondary-success'],
              status: 'success',
              iconColor: this.colors['primary-success']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_KYC,
              icon: 2,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending',
              borderColor: this.colors['primary-error'],
              iconColor: this.colors['primary-error']
            },
            {
              title: GlobalConstant.CASHIER.TITLE_SELFIE,
              icon: 3,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            },
            {
              title: GlobalConstant.CASHIER.TITLE_BANK,
              icon: 4,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            }
          ];
        } else if (
          !kycData.isPanVerified &&
          perSonalData.isMobileVerified === 1 &&
          perSonalData.isEmailVerified === 1
        ) {
          this.activeIndex = 1;

          this.kycPendingTimeLines = [
            {
              title: GlobalConstant.CASHIER.TITLE_PAN,
              icon: 1,
              color: this.colors['secondary-success'],
              status: 'pending',
              borderColor: this.colors['primary-error'],
              iconColor: this.colors['primary-error'],
              isIndex: true
            },
            {
              title: GlobalConstant.CASHIER.TITLE_KYC,
              icon: 2,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            },
            {
              title: GlobalConstant.CASHIER.TITLE_SELFIE,
              icon: 3,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            },
            {
              title: GlobalConstant.CASHIER.TITLE_BANK,
              icon: 4,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            }
          ];
        } else if (
          (perSonalData.isMobileVerified !== 1 && perSonalData.isEmailVerified === 1) ||
          (perSonalData.isMobileVerified === 1 && perSonalData.isEmailVerified !== 1)
        ) {
          this.activeIndex = 0;
          this.kycPendingTimeLines = [
            {
              title: GlobalConstant.CASHIER.TITLE_PAN,
              icon: 1,
              color: this.colors['secondary-success'],
              status: 'pending',
              borderColor: this.colors['primary-error'],
              iconColor: this.colors['primary-error'],
              isIndex: true
            },
            {
              title: GlobalConstant.CASHIER.TITLE_KYC,
              icon: 2,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            },
            {
              title: GlobalConstant.CASHIER.TITLE_SELFIE,
              icon: 3,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            },
            {
              title: GlobalConstant.CASHIER.TITLE_BANK,
              icon: 4,
              color: this.colors['secondary-success'],
              isIndex: true,
              status: 'pending'
            }
          ];
        }
      }
    );

    this.subscriptions.push(newProfile);
  }

  onClickCompleteKYC() {
    this.dialogRef.close();
    this.dialog.closeAll();
    this.sharedUtilityService.openProfileComponent.next(this.activeIndex);
  }

  openInNewWindow(value: string) {
    if (value === 'withdrawal') {
      window.open('https://www.adda52.com/compliance');
    } else {
      window.open('https://www.adda52.com/faq/tds');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
