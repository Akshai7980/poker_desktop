import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {
  BaseResponse,
  CommonService,
  MessageConstant,
  RegexExpression,
  SocketCommService,
  SocketCommandModel,
  SpinnerService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { CashierConstants } from 'projects/cashier/src/lib/constants/app-constants';
import { APIResponseCodeProfileDetails, Paths } from '../../constants/app-constants';
import { PanStatus } from '../../models/profile';
import { UserPanCardDetails } from '../../models/response/pan-details-res';
import { UploadPanDetailsRes } from '../../models/response/upload-pan-details-res';
import { UserDataModel } from '../../models/view/unnamed-data-model';
import { UploadPanDetailsModel } from '../../models/view/upload-pan-details-model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['../../../assets/components/common.scss']
})
export class PanComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  panForm: FormGroup = new FormGroup({});

  panStatus: string = '';

  imageSrc: string;

  isShowToast: boolean = false;

  showImage: boolean = false;

  toastValue: { message: string; flag: string };

  selectedFile: File;

  isPdf: boolean = false;

  @Input() matStepperRef: MatStepper;

  panCardDetails: UserPanCardDetails;

  isPanVerified: boolean;

  userDetails: UserDataModel = {} as UserDataModel;

  @Output() clickNext = new EventEmitter<boolean>();

  subscriptions: Subscription[] = [];

  socketCommRef$: Subscription;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly profileService: ProfileService,
    private commonService: CommonService,
    public readonly dialog: Dialog,
    private readonly spinnerService: SpinnerService,
    private readonly socketCommService: SocketCommService
  ) {
    this.panForm = this.formBuilder.group({
      panId: ['', [Validators.required, Validators.pattern(RegexExpression.panCardId)]]
    });
  }

  ngOnInit(): void {
    this.userDetails = this.commonService.getUserData();
    this.panStatus = PanStatus.INITIAL;
    this.getPanDetails('first time');
    this.socketCommRef$ = this.socketCommService.socketCommandSubject.subscribe(
      (res: SocketCommandModel) => {
        if (res.cmd === 'onKycStatus') {
          this.spinnerService.close();
          if (res.params.status === 'inprogress') {
            this.spinnerService.spinnerData = {
              message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '20'),
              statusText: MessageConstant.docVerifying
            };
            this.spinnerService.open();
          } else if (res.params.status === 'verified') {
            this.getPanDetails('verification');
            this.isShowToast = true;
            this.toastValue = {
              message: MessageConstant.docVerifiedText,
              flag: 'success'
            };
          } else {
            this.isShowToast = true;
            this.toastValue = {
              message: res?.message ?? '',
              flag: 'error'
            };
          }
        }
      }
    );
  }

  getPanDetails(iscoming: string) {
    const getPanCardDetails = this.profileService.getPanCardDetails().subscribe(
      (res: BaseResponse<UserPanCardDetails>) => {
        if (res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
          this.panCardDetails = res.data;
          this.isPanVerified = true;
          if (iscoming === CashierConstants.verification) {
            if (this.panCardDetails.status === CashierConstants.verified) {
              this.showMessage(MessageConstant.DocumentVerified, CashierConstants.successFlag);
              this.panCardDetails = res.data;
              this.isPanVerified = true;
            }
          }
        } else {
          this.isPanVerified = false;
        }
      },
      () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    );
    this.subscriptions.push(getPanCardDetails);
  }

  showMessage(msg: string, flag: string) {
    this.spinnerService.close();
    this.spinnerService.resetSpinnerData();
    this.isShowToast = true;
    this.toastValue = {
      message: msg,
      flag
    };
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files && target.files.length > 0 ? target.files[0] : ({} as File);
    const fileSize = file.size;
    const fileType = file.type;
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
    const sizeLimitInMB = 5;

    if (fileSize < sizeLimitInMB * 1024 * 1024) {
      if (fileType === 'application/pdf') {
        this.isPdf = true;
        this.showImage = false;
      } else {
        this.showImage = true;
        this.isPdf = false;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        this.imageSrc = reader.result as string;
        this.showImage = true;
      };

      reader.readAsDataURL(file);
      this.selectedFile = file;
    } else {
      this.isShowToast = true;

      this.toastValue = {
        message: MessageConstant.FileUploadValidation,
        flag: 'error'
      };
      target.value = '';
      this.showImage = false;
      this.imageSrc = '';
      return;
    }

    if (!allowedTypes.includes(fileType)) {
      target.value = '';
      this.showImage = false;
      this.imageSrc = '';

      this.isShowToast = true;

      this.toastValue = {
        message: MessageConstant.FileUploadValidation,
        flag: 'error'
      };
    }
  }

  onDelete() {
    this.showImage = false;
    this.imageSrc = '';
    this.selectedFile = {} as File;
  }

  onSubmitNext() {
    this.clickNext.emit(true);
  }

  onClickVerify() {
    this.isPanVerified = true;
  }

  submitPanDetails() {
    const panCardDetails = new UploadPanDetailsModel();

    panCardDetails.clear();

    panCardDetails.userId = this.userDetails.userId;
    panCardDetails.panNumber = this.panForm.controls['panId'].value;
    panCardDetails.document = this.selectedFile;

    const formData = this.profileService.convertParamsToFormData(panCardDetails);

    this.spinnerService.spinnerData = {
      message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '60'),
      statusText: MessageConstant.docUploading
    };

    this.spinnerService.open();

    const uploadPanCardDetails = this.profileService.uploadPanCardDetails(formData).subscribe(
      (res: BaseResponse<UploadPanDetailsRes>) => {
        if (res.code === APIResponseCodeProfileDetails.PROFILE_DETAILS.SUCCESS) {
          this.spinnerService.spinnerData = {
            message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '20'),
            statusText: MessageConstant.docVerifying
          };
          this.spinnerService.open();

          this.getPanDetails('verification');

          if (this.matStepperRef) {
            this.matStepperRef.next();
          }
        } else {
          this.panForm.reset();
          this.selectedFile = {} as File;
          this.imageSrc = '';
          this.showImage = false;

          this.isShowToast = true;
          this.toastValue = {
            message: res.message,
            flag: 'error'
          };
        }
      },
      () => {
        this.panForm.reset();
        this.selectedFile = {} as File;
        this.imageSrc = '';
        this.showImage = false;

        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    );
    this.subscriptions.push(uploadPanCardDetails);
  }

  caseConvert(event: Event) {
    const target = event.target as HTMLInputElement;
    this.panForm.get('panId')?.setValue(target.value.toUpperCase());
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
