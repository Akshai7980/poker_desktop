import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';

import { Paths } from '../../constants/app-constants';
import { BaseResponse } from '../../models/common/base-response.model';
import { KycStatusResponse } from '../../models/response/kycstatus-response.model';
import { ProfileService } from '../../services/profile.service';

export interface CocumentVerifyTabModel {
  tabIndex: number;
  label: string;
  verified: boolean;
}

@Component({
  selector: 'app-document-verification',
  templateUrl: './document-verification.component.html',
  styleUrls: ['./document-verification.component.scss']
})
export class DocumentVerificationComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100';

  assetsImagePath = Paths.imagePath;

  @Input() matStepperRef: MatStepper;

  selectedTabIndex: number;

  @Output() isComplected = new EventEmitter<string>();

  tabs: CocumentVerifyTabModel[] = [
    {
      tabIndex: 0,
      label: 'PAN',
      verified: false
    },
    {
      tabIndex: 1,
      label: 'KYC',
      verified: false
    },
    {
      tabIndex: 2,
      label: 'SELFIE',
      verified: false
    }
  ];

  subscriptions: Subscription[] = [];

  constructor(private readonly profileService: ProfileService) {}

  ngOnInit(): void {
    this.selectedTabIndex = this.tabs[0].tabIndex;
    this.getAllKycDetails();
  }

  onSelectedTab(index: number): void {
    this.selectedTabIndex = index;
  }

  getAllKycDetails() {
    const getKycDetails = this.profileService
      .getKycDetails()
      ?.subscribe((res: BaseResponse<KycStatusResponse>) => {
        const kycVerification = res.data;
        this.tabs[0].verified = kycVerification.isPanVerified;
        this.tabs[1].verified = kycVerification.isKycVerified;
        this.tabs[2].verified = kycVerification.isSelfieVerified;
        if (kycVerification.isPanVerified) {
          this.selectedTabIndex = 1;
        } else if (kycVerification.isKycVerified) {
          this.selectedTabIndex = 2;
        }
      });
    this.subscriptions.push(getKycDetails);
  }

  onClickNext(event: boolean, tabName: string) {
    switch (tabName) {
      case 'pan':
        this.selectedTabIndex = 1;
        break;
      case 'kyc':
        this.selectedTabIndex = 2;
        break;
      default:
        break;
    }
  }

  nextClicked() {
    this.isComplected.emit('2nd');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription?.unsubscribe();
      }
    });
  }
}
