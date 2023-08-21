import { ComponentType } from '@angular/cdk/portal';
import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  BaseResponse,
  CommonService,
  LocalStorageService,
  MessageConstant,
  WithdrawalModeMethodsComponent
} from 'projects/shared/src/public-api';
import { combineLatest, Subscription } from 'rxjs';

import { AvatarSelectionComponent } from './components/avatar-selection/avatar-selection.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditUsernameComponent } from './components/edit-username/edit-username.component';
import { KycDocumentsVerifiedComponent } from './components/kyc-documents-verified/kyc-documents-verified.component';
import { ManageCardsComponent } from './components/manage-cards/manage-cards.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { ProfileStepsComponent } from './components/profile-steps/profile-steps.component';
import { Avatar, Paths } from './constants/app-constants';
import { MATDIALOG } from './constants/dialog.constants';
import { Profiles, Progress } from './models/profile';
import { UserKycDocsRes } from './models/response/get-kyc-docs-response';
import { KycStatusResponse } from './models/response/kycstatus-response.model';
import { NewProfileResponseModel } from './models/response/new-profile-response';
import { ProfileService } from './services/profile.service';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    '../assets/components/avatar.scss',
    '../assets/abstract/_utilities.scss',
    '../assets/components/common.scss'
  ]
})
export class PokerProfileComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100';

  assetsImagePath = Paths.imagePath;

  // Check If Profile has been updated once
  isPersonalDetailsAlreadyUpdated: boolean = false;

  avatarSelection = AvatarSelectionComponent;

  editUserName = EditUsernameComponent;

  manageCard = ManageCardsComponent;

  personalDetails = PersonalDetailsComponent;

  kycDocuments = KycDocumentsVerifiedComponent;

  manageWithdrawalMethods = WithdrawalModeMethodsComponent;

  manageCards = ManageCardsComponent;

  changePassword = ChangePasswordComponent;

  currentIndex: number = 0;

  isComingFromList: boolean = true;

  // show all profile list when user has already updated profile and not vising first time
  showProfilesList: boolean = true;

  activeIndex: number;

  profiles: Profiles[] = [
    {
      title: 'Personal Details',
      icon: 'note-pencil2',
      component: this.personalDetails
    },
    {
      title: 'KYC Documents',
      icon: 'file-text',
      component: this.kycDocuments
    },
    {
      title: 'Manage Withdrawal Methods',
      icon: 'credit-card',
      component: this.manageWithdrawalMethods
    },
    {
      title: 'Manage Cards',
      icon: 'union',
      component: this.manageCards
    },
    {
      title: 'Change Password',
      icon: 'key',
      component: this.changePassword
    }
  ];

  currentActiveProfilePost: string;

  avatars: string[] = Avatar.avatars;

  avtars: string[] = Avatar.avatars;

  progress: Progress[] = [
    {
      stepperValue: 0,
      stepValue: 1,
      nextState: 'Personal Details'
    },
    {
      stepperValue: 33,
      stepValue: 2,
      nextState: 'Document Verification'
    },
    {
      stepperValue: 66,
      stepValue: 3,
      nextState: 'Add Bank Details'
    }
  ];

  myValue: number;

  selectedProgress: Progress;

  checked9: boolean = false;

  editProfile: boolean = false;

  chooseAvatar: boolean = false;

  isProfileSteps: boolean = false;

  profileStepsTitle: string = 'Personal Details';

  profileCompleteBlackScreen: boolean = false;

  userName: string;

  toastValue: { message: string; flag: string };

  isUsernameEditable: boolean;

  selectedAvatar: string;

  isShowToast: boolean = false;

  currentActiveProfilePre: string = 'ProfileProgressSteps';

  @Output() avatarChangeEmit = new EventEmitter();

  subscriptions: Subscription[] = [];

  personalDataList: NewProfileResponseModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: ProfileService,
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    public router: Router,
    private sharedService: SharedService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<PokerProfileComponent>
  ) {}

  ngOnInit(): void {
    const userLoggedIn = this.localStorageService.getItem('token');
    if (!userLoggedIn) {
      this.dialog.closeAll();
    }

    [this.selectedProgress] = this.progress;
    this.newProfile();
    const userData = this.commonService.getUserData();
    this.selectedAvatar = userData?.avatarId;
    this.detectAvatarChange();

    const profileCompletionDetectorSub = this.profileService.profileCompletionDetector.subscribe(
      () => {
        this.newProfile();
      }
    );

    this.subscriptions.push(profileCompletionDetectorSub);

    if (this.data) {
      this.onClickComplete(this.data);
    }
  }

  openComponentDialog(comp: Profiles) {
    const afterProfileUpdated = true;
    if (comp.component.name === 'WithdrawalMethodsComponent') {
      const data = { afterProfileUpdated, isComingFromList: this.isComingFromList };

      this.dialog.open(comp.component, { ...MATDIALOG.animatedSingleDialog, data: { data } });
    } else {
      this.dialog.open(comp.component, {
        ...MATDIALOG.animatedSingleDialog,
        data: { afterProfileUpdated }
      });
    }
  }

  onClickProfiles(title: string) {
    this.showProfilesList = false;
    this.currentActiveProfilePost = title;
  }

  newProfile() {
    const newProfile = combineLatest([
      this.profileService.createNewProfile(),
      this.profileService.getKycDetails(),
      this.profileService.getUserKycDocs()
    ]).subscribe(
      (
        res: [
          BaseResponse<NewProfileResponseModel>,
          BaseResponse<KycStatusResponse>,
          BaseResponse<UserKycDocsRes>
        ]
      ) => {
        const perSonalData = res[0].data.userInfo;
        this.personalDataList = res[0].data;
        const kycData = res[1].data;
        this.profileService.kycData = kycData;

        this.profileService.kycDocsData = <UserKycDocsRes>res[2].data;

        this.userName = perSonalData.userName;
        this.isUsernameEditable = perSonalData.isUsernameEditable;
        // for anil check odhar comment this
        if (
          perSonalData.isMobileVerified === 1 &&
          perSonalData.isEmailVerified === 1 &&
          kycData?.isPanVerified &&
          kycData.isKycVerified &&
          kycData.isBankVerified &&
          ((kycData.isSelfieMandatory && kycData.isSelfieVerified) || !kycData.isSelfieMandatory)
        ) {
          this.isPersonalDetailsAlreadyUpdated = true;
        } else if (
          kycData.isPanVerified &&
          kycData.isKycVerified &&
          ((kycData.isSelfieMandatory && kycData.isSelfieVerified) || !kycData.isSelfieMandatory)
        ) {
          [, , this.selectedProgress] = this.progress;
        } // end
        else if (perSonalData.isMobileVerified === 1 && perSonalData.isEmailVerified === 1) {
          [, this.selectedProgress] = this.progress;
        }
      }
    );
    this.subscriptions.push(newProfile);
  }

  onClickComplete(currentVal: number) {
    if (currentVal === 1) {
      this.isProfileSteps = true;
      this.activeIndex = currentVal - 1;
      this.currentActiveProfilePost = 'Personal Details';
      this.showProfilesList = false;
    } else if (currentVal === 2) {
      this.isProfileSteps = true;
      this.activeIndex = currentVal - 1;
    } else if (currentVal === 3) {
      this.isProfileSteps = true;
      this.activeIndex = currentVal - 1;
    }

    this.dialog.open(ProfileStepsComponent, {
      data: [this.activeIndex, this.personalDataList],
      ...MATDIALOG.animatedSingleDialog
    });
  }

  openDialog<T>(component: ComponentType<T>) {
    const dialogRef = this.dialog.open(component, MATDIALOG.animatedSingleDialog);
    const dialog = dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.userName = result;
        this.isUsernameEditable = false;
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.userNameChange,
          flag: 'success'
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  preJump(v: string) {
    if (v === 'editProfile') {
      this.editProfile = !this.editProfile;
    } else if (v === 'chooseAvatar') {
      this.chooseAvatar = !this.chooseAvatar;
    } else if (v === 'profileCompleteBlackScreen') {
      this.profileCompleteBlackScreen = !this.profileCompleteBlackScreen;
    }
  }

  whenProfileStepsChanges(event: number) {
    switch (event) {
      case 0:
        this.profileStepsTitle = 'Personal Details';
        this.currentActiveProfilePost = 'Personal Details';
        this.showProfilesList = false;
        break;
      case 1:
        this.profileStepsTitle = 'Document Verification';
        break;
      case 2:
        this.profileStepsTitle = 'Bank A/C Details';
        break;
      default:
        break;
    }
  }

  showProfileList(event: boolean) {
    this.showProfilesList = event;
  }

  closeDialog() {
    this.profileService.toggleAnimationDialog(this.dialogRef);
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace('?dialog=profile', '');
    this.router.navigateByUrl(newUrl);
  }

  detectAvatarChange() {
    const selectedAvatar = this.sharedService.selectedAvatar.subscribe((res: string) => {
      this.selectedAvatar = res;
      const data = this.commonService.getUserData();
      if (data) {
        data.avatarId = this.selectedAvatar;
        this.commonService.setUserData(data);
      }
      this.avatarChangeEmit.emit(this.selectedAvatar);
    });

    this.subscriptions.push(selectedAvatar);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
