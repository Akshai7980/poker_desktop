import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/public-api';
import { combineLatest, Subscription } from 'rxjs';

import {
  APIResponseCode,
  APIResponseCodeProfileDetails,
  Paths
} from '../../constants/app-constants';
import { BaseResponse } from '../../models/common/base-response.model';
import { Document } from '../../models/profile';
import { List, UserKycDocsRes } from '../../models/response/get-kyc-docs-response';
import { UserPanCardDetails } from '../../models/response/pan-details-res';
import { SelfieDetailsResponse } from '../../models/response/selfi-details-response.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-kyc-documents-verified',
  templateUrl: './kyc-documents-verified.component.html',
  styleUrls: ['../../../assets/components/common.scss']
})
export class KycDocumentsVerifiedComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100 ovf-hide p-rel';

  assetsImagePath = Paths.imagePath;

  kycForm: FormGroup = new FormGroup({});

  selectedDocument: Document;

  showAadhar: boolean = false;

  showDL: boolean = true;

  subscriptions: Subscription[] = [];

  isShowPanList: boolean;

  showAddDocsSection: boolean = false;

  kycDocuments: List[] = [];

  panCardDetails: UserPanCardDetails = {} as UserPanCardDetails;

  userSelfieData: Array<{ status: 'active'; image: '' }> = [];

  uploadFrom: string;

  isAfterVerification: boolean = false;

  capturedImage: string;

  status: string;

  isVerified: boolean = false;

  isNextDisabled: boolean = true;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<KycDocumentsVerifiedComponent>
  ) {
    this.kycForm = this.formBuilder.group({
      documents: [null, [Validators.required]],
      documentId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getAllKycDocs();
    this.getSelfieData();
  }

  getAllKycDocs() {
    const getAllKycDocs = combineLatest([
      this.profileService.getUserKycDocs(),
      this.profileService.getPanCardDetails()
    ]).subscribe((resp: [BaseResponse<UserKycDocsRes>, BaseResponse<UserPanCardDetails>]) => {
      if (resp[0].code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
        this.kycDocuments = resp[0].data.list;
      } else {
        this.kycDocuments = resp[0].data.list;
      }

      if (resp[1].code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
        this.panCardDetails = resp[1].data;
        this.isShowPanList = true;
      } else {
        this.panCardDetails = resp[1].data;
        if (Object.keys(this.panCardDetails).length === 0) {
          this.isShowPanList = false;
        }
      }
    });
    this.subscriptions.push(getAllKycDocs);
  }

  addAnotherDoc() {
    this.showAddDocsSection = true;
    this.uploadFrom = 'kycDocuments';
  }

  // Below function to hide and show the section and kyc document which is uploaded
  uploadedDocs() {
    this.showAddDocsSection = false;
    this.getAllKycDocs();
  }

  onClose() {
    const profileDialog = this.dialog.getDialogById('poker-profile');
    profileDialog?.close();
    this.goBackToProfile();
  }

  getSelfieData() {
    const getSelfieDetails = this.profileService
      .getSelfieDetails()
      .subscribe((res: BaseResponse<SelfieDetailsResponse>) => {
        if (res.code === APIResponseCode.AUTH.SUCCESS) {
          if (Object.keys(res?.data).length) {
            this.isAfterVerification = true;
            const s3URL = res?.data?.s3URL;
            const file1 = res?.data?.file1;
            this.capturedImage = s3URL && file1 ? s3URL + file1 : '';
            //
            this.status = res?.data?.status;
            this.isVerified = true;
            if (this.status === 'verified') {
              this.isNextDisabled = false;
            } else {
              this.isNextDisabled = true;
            }
          } else {
            this.isAfterVerification = false;
          }
        } else {
          this.isAfterVerification = false;
        }
      });
    this.subscriptions.push(getSelfieDetails);
  }

  goBackToProfile() {
    this.profileService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
