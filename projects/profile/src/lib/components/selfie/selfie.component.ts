import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Buffer } from 'buffer';
import { MessageConstant, SpinnerService, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import {
  APIResponseCode,
  Paths,
  ProfileResponseCode,
  ToastTime
} from '../../constants/app-constants';
import { BaseResponse } from '../../models/common/base-response.model';
import { SelfieDetailsResponse } from '../../models/response/selfi-details-response.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-selfie',
  templateUrl: './selfie.component.html',
  styleUrls: ['../../../assets/components/common.scss']
})
export class SelfieComponent implements OnInit, OnDestroy {
  @Input() matStepperRef: MatStepper;

  isUploadedSelfie: boolean = false;

  assetsImagePath = Paths.imagePath;

  isCameraOpened: boolean = false;

  proceedDisabled: boolean = true;

  @ViewChild('videoElement') videoElement: ElementRef;

  @ViewChild('canvasElement') canvasElement: ElementRef;

  capturedImage: string;

  isVerified: boolean = false;

  disableCapture: boolean = true;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  stream: MediaStream;

  isNextDisabled: boolean = true;

  isAfterVerification: boolean = false;

  showNextButton: boolean = true;

  status: string;

  @Output() isComplected = new EventEmitter<string>();

  subscriptions: Subscription[] = [];

  toastTime: number = ToastTime.NOTIFICATION;

  constructor(
    private profileService: ProfileService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.profileService.kycData.isSelfieMandatory) {
      this.isNextDisabled = false;
    }
    this.getSelfieData('firstTime', '');
  }

  selfieGuideLines: string[] = MessageConstant.selfieGuideLines;

  onVerifyClicked() {
    this.isComplected.emit('2nd');
    this.matStepperRef.next();
    this.profileService.profileCompletionDetector.next(true);

    this.cdr.detectChanges();
  }

  getSelfieData(isComing: string, response?: any) {
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
          if (isComing === 'verification') {
            this.showMessage(response?.message, 'success');
          }
        } else {
          this.isAfterVerification = false;
        }
      });
    this.subscriptions.push(getSelfieDetails);
  }

  capture() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL();
    this.isCameraOpened = false;
    this.isUploadedSelfie = true;
    this.proceedDisabled = false;
    this.showNextButton = false;
    this.stopStream(this.stream);
  }

  initiateCamera() {
    this.isCameraOpened = true;
    const timeoutForVideo = setTimeout(() => {
      const video = this.videoElement.nativeElement;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream: MediaStream) => {
            video.srcObject = stream;
            video.play();
            this.disableCapture = false;
            this.stream = stream;
          })
          .catch(() => {
            this.isShowToast = true;
            this.toastValue = {
              message: MessageConstant.cameraAccessBlock,
              flag: 'error'
            };
            const timeoutVar = setTimeout(() => {
              this.isCameraOpened = false;
              clearTimeout(timeoutVar);
            }, this.toastTime);
          });
      }
      clearTimeout(timeoutForVideo);
    }, ToastTime.ONESECOND);
  }

  stopStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  convertBase64ToFile(dataURI: string): File {
    const byteString = Buffer.from(dataURI, 'base64').toString();
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i += 1) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
  }

  showMessage(msg: string, flag: string) {
    const timeoutId = setTimeout(() => {
      this.spinnerService.close();
      this.spinnerService.resetSpinnerData();
      this.isShowToast = true;
      this.toastValue = {
        message: msg,
        flag
      };
      clearTimeout(timeoutId);
    }, this.toastTime);
  }

  verifyAndProceed() {
    this.proceedDisabled = true;
    this.spinnerService.spinnerData = {
      message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '60'),
      statusText: MessageConstant.docUploading
    };

    const uploadSelfie = this.profileService
      .uploadSelfie(this.convertBase64ToFile(this.capturedImage))
      .subscribe(
        (resp: BaseResponse<File>) => {
          if (resp.code === ProfileResponseCode.SUCCESS) {
            this.isNextDisabled = false;
            this.isAfterVerification = true;
            this.isVerified = true;
            this.showNextButton = true;
            this.spinnerService.spinnerData = {
              message: MessageConstant.TimerLoadingMessage.replace('{{seconds}}', '20'),
              statusText: MessageConstant.docVerifying
            };
            this.spinnerService.open();
            this.getSelfieData('verification', resp);
          } else {
            this.showMessage(resp.message, 'error');

            // Resetting to defaults
            this.isUploadedSelfie = false;
            this.isCameraOpened = false;
            this.disableCapture = true;
            this.capturedImage = '';
            this.isNextDisabled = true;
            this.showNextButton = true;
          }
        },
        (error: Error) => {
          this.showMessage(error.message, 'error');
        }
      );
    this.subscriptions.push(uploadSelfie);
  }

  retakeSelfie() {
    this.isUploadedSelfie = false;
    this.disableCapture = true;
    this.capturedImage = '';
    this.isNextDisabled = true;
    this.showNextButton = true;
    this.initiateCamera();
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stopStream(this.stream);
    }
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
