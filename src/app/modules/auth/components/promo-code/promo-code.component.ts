import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  APIResponseCode,
  BaseResponse,
  MessageConstant,
  Paths,
  PromoCodeResponseModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss']
})
export class PromoCodeComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  promoCodeForm: FormGroup = new FormGroup({});

  isSuccess: boolean;

  isFail: boolean;

  isLoading: boolean = false;

  isShowToast: boolean;

  isDisabledBtn: boolean;

  firstTimeBtnClicked: boolean = true;

  otp: string;

  otpdata: any;

  toastValue: ToastModel;

  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PromoCodeComponent>,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.promoCodeForm = this.formBuilder.group({
      promoCode: ['', Validators.required]
    });
  }

  onClose() {
    this.dialog.closeAll();
  }

  openDialog() {
    this.firstTimeBtnClicked = false;
    this.isLoading = true;
    this.isDisabledBtn = false;
  }

  clickSecondTime() {
    this.isLoading = false;
    this.isDisabledBtn = true;
    this.isSuccess = true;
  }

  secondFunction() {
    const data = {
      code: this.promoCodeForm.value,
      message: this.otpdata.bonusCodeType
    };
    this.dialogRef.close([data, false]);
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  getPromoCode(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
    }

    const target = event.target as HTMLInputElement;
    this.isFail = false;
    this.isShowToast = false;
    if (target.value.length === 0) {
      this.isLoading = false;
      this.isSuccess = false;
      this.isDisabledBtn = false;
    } else if (target.value.length > 0) {
      this.firstTimeBtnClicked = true;
      this.isDisabledBtn = true;
      this.otp = target.value;
    }
  }

  getPromoCodeVerify() {
    this.firstTimeBtnClicked = false;
    this.isLoading = true;
    this.isDisabledBtn = false;
    this.isFail = false;
    this.isSuccess = false;
    const promoCodeVerify$ = this.authService.promoCodeVerify(this.otp);
    const promoCodeVerify: Subscription = promoCodeVerify$.subscribe({
      next: (resp: BaseResponse<PromoCodeResponseModel>) => {
        this.isLoading = false;
        if (resp.code === APIResponseCode.AUTH.INVALID_PROMOCODE) {
          this.isFail = true;
          this.firstTimeBtnClicked = true;
          this.isDisabledBtn = false;
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.InvalidPromoCode,
            flag: 'error'
          };
        } else if (resp.code === APIResponseCode.AUTH.SUCCESS) {
          this.isLoading = false;
          this.isSuccess = true;
          this.otpdata = resp.data;
          this.isDisabledBtn = true;
          this.isShowToast = false;
          this.secondFunction();
        } else {
          this.firstTimeBtnClicked = true;
          this.isDisabledBtn = false;
          this.isShowToast = true;
          this.toastValue = {
            message: resp.message,
            flag: 'error'
          };
        }
      },
      error: (error: Error) => {
        this.toastValue = {
          message: error.message,
          flag: 'error'
        };
        this.firstTimeBtnClicked = true;
      }
    });

    this.subscriptions.push(promoCodeVerify);
  }

  onResetPromoCode() {
    this.isSuccess = false;
    this.isFail = false;
    this.isLoading = false;
    this.isShowToast = false;
    this.isDisabledBtn = false;
    this.firstTimeBtnClicked = true;
    this.promoCodeForm.controls['promoCode'].setValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
