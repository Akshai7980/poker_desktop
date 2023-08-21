import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BaseResponse,
  CommonService,
  MessageConstant,
  SocketCommandModel,
  SocketCommService,
  SpinnerService,
  ToastModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { Paths, ProfileResponseCode, ToastTime } from '../../constants/app-constants';
import { WindowManagerConstant } from '../../constants/window-manager-constant';
import { Document } from '../../models/profile';
import { UserKycDocsRes } from '../../models/response/get-kyc-docs-response';
import { KycDocumentListResponse } from '../../models/response/kyc-doclist-response';
import { KycStatusResponse } from '../../models/response/kycstatus-response.model';
import { UserDataModel } from '../../models/view/unnamed-data-model';
import { UploadKycDetailsModel } from '../../models/view/upload-kyc-details-model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['../../../assets/components/common.scss']
})
export class KycComponent implements OnInit, OnDestroy, AfterViewInit {
  assetsImagePath = Paths.imagePath;

  @Input() isProfileAlreadyComplete?: boolean = false;

  kycForm: FormGroup = new FormGroup({});

  selectedDocument: Document;

  isShowToast: boolean = false;

  showAadhaar: boolean = true;

  showImage: boolean = false;

  showDL: boolean = false;

  enableStartVerification: boolean = false;

  isBtnDisable: boolean = true;

  kycAadharWindow: Window | null;

  documents: Document[];

  imageSrcFront: string = '';

  imageSrcBack: string = '';

  selectedFile1: File;

  selectedFile2: File;

  @Input() uploadFrom: string;

  toastValue: ToastModel;

  showAadhaarVerified: boolean;

  showNotAadhaar: boolean;

  kycDetails: UserKycDocsRes;

  showDocDetails: boolean = false;

  toastTime: number = ToastTime.NOTIFICATION;

  @Output() clickNext = new EventEmitter<boolean>();

  kycData: KycStatusResponse;

  kycDocsData: UserKycDocsRes;

  isDocumentVerified: boolean;

  subscriptions: Subscription[] = [];

  socketCommRef$: Subscription;

  isPdfFront: boolean = false;

  isPdfBack: boolean = false;

  @Output() showAddDocsSection = new EventEmitter<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly socketCommService: SocketCommService,
    private readonly spinnerService: SpinnerService,
    private commonService: CommonService
  ) {
    this.kycForm = this.formBuilder.group({
      documents: ['', [Validators.required]],
      documentId: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
    });

    this.kycData = this.profileService.kycData;
    this.showAadhaarVerified = this.kycData?.isKycVerified;
    this.kycDocsData = this.profileService.kycDocsData;

    // Once we are getting confirmation then we need
    // to uncomment this don't remove this code

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
            this.getUploadedDocList('verification');
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

  ngOnInit(): void {
    this.getKycDocList();
    // below flag is coming from the kyc-documents-verified once stepper flow complected
    if (this.uploadFrom !== 'kycDocuments') {
      this.getUploadedDocList('firstTime');
    }
  }

  ngAfterViewInit() {
    this.kycForm.addControl('fileInput1', new FormControl('', Validators.required));
    this.kycForm.addControl('fileInput2', new FormControl('', Validators.required));
  }

  getUploadedDocList(isComing: string) {
    const getUserKycDocs = this.profileService
      .getUserKycDocs()
      .subscribe((res: BaseResponse<UserKycDocsRes>) => {
        if (res.code === ProfileResponseCode.SUCCESS) {
          if (isComing === 'verification') {
            this.showMessage(res.message, 'success');
          }
          this.showDocDetails = true;
          this.kycDetails = res.data;
        } else {
          this.showDocDetails = false;
        }
      });
    this.subscriptions.push(getUserKycDocs);
  }

  getKycDocList() {
    const getKycDocList = this.profileService
      .getKycDocList()
      .subscribe((res: BaseResponse<KycDocumentListResponse[]>) => {
        this.documents = res.data.map((item: KycDocumentListResponse) => ({
          name: item.dispName,
          code: item.name,
          id: item.id,
          status: item.status
        }));

        [this.selectedDocument] = this.documents;
      });
    this.subscriptions.push(getKycDocList);
  }

  onSelectDocument() {
    this.imageSrcFront = '';
    this.imageSrcBack = '';
    this.showAadhaarVerified = false;
    this.showNotAadhaar = false;
    this.kycForm.controls['documentId'].setValue('');
    if (this.selectedDocument.code === 'aadhar') {
      this.enableStartVerification = true;
      this.showAadhaar = true;
      this.showDL = false;
    } else {
      this.showDL = true;
      this.showAadhaar = false;
    }

    if (this.selectedDocument.code === 'voter') {
      this.kycForm.controls['documentId'].setValidators([
        Validators.pattern('([a-zA-Z]){3}([0-9]){7}?$')
      ]);
    } else if (this.selectedDocument.code === 'passport') {
      this.kycForm.controls['documentId'].setValidators([Validators.pattern('[A-Z]{1}[0-9]{7}')]);
    } else if (this.selectedDocument.code === 'dl') {
      this.kycForm.controls['documentId'].setValidators([Validators.maxLength(16)]);
    }
  }

  async onFileChange(event: Event, side: string) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : ({} as File);
    const fileSize = file.size;
    const fileType = file.type;
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
    const sizeLimitInMB = 5;

    if (fileSize < sizeLimitInMB * 1024 * 1024) {
      const reader = new FileReader();
      if (fileType === 'application/pdf' && side === 'Front') {
        this.isPdfFront = true;
      } else if (fileType === 'application/pdf' && side === 'Back') {
        this.isPdfBack = true;
      } else if (this.selectedFile1?.type === 'application/pdf') {
        this.isPdfFront = true;
      } else if (this.selectedFile2?.type === 'application/pdf') {
        this.isPdfBack = true;
      } else {
        this.isPdfBack = false;
        this.isPdfFront = false;
      }

      reader.onload = async () => {
        if (side === 'Front') {
          this.imageSrcFront = reader.result as string;
          this.selectedFile1 = file;
        } else {
          this.imageSrcBack = reader.result as string;
          this.selectedFile2 = file;
        }
      };

      reader.readAsDataURL(file);
      this.showImage = true;
    } else {
      target.value = '';
      this.showImage = false;
      this.imageSrcFront = '';
      this.isShowToast = true;

      this.toastValue = {
        message: MessageConstant.FileUploadValidation,
        flag: 'error'
      };
    }

    if (!allowedTypes.includes(fileType)) {
      target.value = '';
      this.showImage = false;
      this.imageSrcFront = '';
      this.imageSrcBack = '';

      this.isShowToast = true;

      this.toastValue = {
        message: MessageConstant.FileUploadValidation,
        flag: 'error'
      };
    }
  }

  onDelete(side: string) {
    this.showImage = false;
    if (side === 'Front') {
      this.imageSrcFront = '';
      this.kycForm.get('fileInput1')?.setValue(this.imageSrcFront);
    } else {
      this.imageSrcBack = '';
      this.kycForm.get('fileInput2')?.setValue(this.imageSrcBack);
    }
  }

  showMessage(msg: string, flag: string) {
    const timeoutVar = setTimeout(() => {
      this.spinnerService.close();
      this.spinnerService.resetSpinnerData();
      this.isShowToast = true;
      this.toastValue = {
        message: msg,
        flag
      };
      clearTimeout(timeoutVar);
    }, this.toastTime);
  }

  onSubmitKyc() {
    if (this.kycForm.valid && this.selectedFile1 && this.selectedFile2) {
      const userDetails: UserDataModel = this.commonService.getUserData();
      const kycDetails = new UploadKycDetailsModel();
      kycDetails.clear();

      const doctype = this.kycForm.controls['documents'].value;
      kycDetails.userId = userDetails.userId;
      kycDetails.docNumber = this.kycForm.controls['documentId'].value;
      kycDetails.docType = doctype.code;
      kycDetails.file1 = this.selectedFile1;
      kycDetails.file2 = this.selectedFile2;

      const formData = this.profileService.convertParamsToFormData(kycDetails);

      this.spinnerService.spinnerData = {
        message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '60'),
        statusText: MessageConstant.docUploading
      };

      const uploadKycDetails = this.profileService.uploadKycDetails(formData).subscribe(
        (res) => {
          if (res.code === ProfileResponseCode.SUCCESS) {
            this.isDocumentVerified = true;
            this.showNotAadhaar = true;

            this.spinnerService.spinnerData = {
              message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '20'),
              statusText: MessageConstant.docVerifying
            };

            this.spinnerService.open();
            this.showMessage(res.message, 'success');
            if (this.uploadFrom === 'kycDocuments') {
              this.showAddDocsSection.emit(false);
            } else {
              this.getUploadedDocList('verification');
            }
          } else {
            this.showAadhaarVerified = true;
            this.showMessage(res.message, 'error');
          }
        },
        (error) => {
          this.showMessage(error.message, 'error');
        }
      );
      this.subscriptions.push(uploadKycDetails);
    }
  }

  onSubmitNext() {
    this.clickNext.emit(true);
  }

  onStartVerification() {
    if (this.selectedDocument.code === 'aadhar' && this.kycData.isPanVerified) {
      const getAadharRedirectData = this.profileService
        .getAadharRedirectData()
        .subscribe((resp) => {
          if (this.kycAadharWindow && !this.kycAadharWindow.closed) {
            this.kycAadharWindow.focus();
            let isWindFocused: boolean = false;
            this.kycAadharWindow.onfocus = () => {
              isWindFocused = true;
            };
            const winTimeout = setTimeout(() => {
              if (!isWindFocused) {
                this.kycAadharWindow = window.open(
                  window.location.href,
                  resp.data.captureLink,
                  `width=${WindowManagerConstant.WINDOW_SIZE.AADHAR[0]}px,
                  height=${WindowManagerConstant.WINDOW_SIZE.AADHAR[1]}px`
                );
              }
              clearTimeout(winTimeout);
            }, ToastTime.HALFSECOND);
            return;
          }
          this.kycAadharWindow = window.open(
            resp.data.captureLink,
            resp.data.captureLink,
            `width=${WindowManagerConstant.WINDOW_SIZE.AADHAR[0]}px,
            height=${WindowManagerConstant.WINDOW_SIZE.AADHAR[1]}px`
          );
          this.kycAadharWindow?.addEventListener('resize', () => {
            this.kycAadharWindow?.resizeTo(411, 617);
          });
          window.allWindow.set(resp.data.captureLink, this.kycAadharWindow);
          this.subscriptions.push(getAadharRedirectData);
        });
    } else {
      this.showMessage(MessageConstant.panNotVerified, 'error');
    }
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
