import { formatDate } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter
} from '@angular/material/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse, MessageConstant, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { Cashier, CashierConstants, Paths } from '../../constants/app-constants';
import { CashierInitDataResponse } from '../../models/response/cashierInItData.response.model';
import { ReleaseUnite } from '../../models/view/releaseunit.model';
import { CashierService } from '../../services/cashier.service';

export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date) {
    return formatDate(date, 'dd/MM/yyyy', this.locale);
  }
}

@Component({
  selector: 'app-release-units-pgps',
  templateUrl: './release-units-pgps.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss',
    '../../../assets/components/buttons.scss'
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ]
})
export class ReleaseUnitsPgpsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;
  showAccumulation: boolean = false;
  form: FormGroup = new FormGroup({});
  maxDate = new Date();
  sixMonthsAgo = new Date();
  minDate = this.sixMonthsAgo.setDate(this.sixMonthsAgo.getDate() - 90);
  @Input() forWithheldDepositScreen?: boolean = false;
  releaseUnitModel: ReleaseUnite = new ReleaseUnite('', '');
  isBtnDisable: boolean = true;
  releaseUnites: any;
  toastValue: ToastModel;
  isShowToast: boolean;
  faqList: any;
  subscriptions: Subscription[] = [];
  isMatLabelHidden: boolean = false;
  @ViewChild('picker') datePicker: MatDateRangePicker<any>;
  openFAQIndex: number = -1;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly cashierService: CashierService,
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<ReleaseUnitsPgpsComponent>
  ) {}

  @HostListener('click')
  checkIsDateSelected() {
    this.isMatLabelHidden = false;
    if (this.form.controls['startDate'].value || this.form.controls['endDate'].value) {
      this.isMatLabelHidden = true;
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required)
    });
    this.getfaqData();
  }

  getfaqData() {
    const getFaqData = this.cashierService.getFaqData('release_unit').subscribe((res: any) => {
      if (res.code === Cashier.SUCCESS) {
        this.faqList = res.data.reverse();

        this.faqList = this.faqList.map((element: CashierInitDataResponse, i: number) => ({
          ...element,
          collapsed: i !== 0
        }));
      }
    });
    this.subscriptions.push(getFaqData);
  }

  getReleaseUnits() {
    const getStartDate = this.form.controls['startDate'].value;
    const getEndDate = this.form.controls['endDate'].value;

    this.releaseUnitModel.startDate = getStartDate.valueOf();
    this.releaseUnitModel.endDate = getEndDate.valueOf();
    this.isBtnDisable = true;
    const getReleaseUnitPgpsData$ = this.cashierService.getReleaseUnitPgpsData(
      this.releaseUnitModel
    );
    const getReleaseUnitPgpsData: Subscription = getReleaseUnitPgpsData$.subscribe({
      next: (res: BaseResponse<CashierInitDataResponse>) => {
        if (res.code === Cashier.SUCCESS) {
          this.releaseUnites = res.data;
          this.showAccumulation = true;
        } else if (res.code === Cashier.LAST_3_MONTHS) {
          this.showAccumulation = false;

          this.isShowToast = true;
          this.toastValue = {
            message: res.message,
            flag: CashierConstants.errorFlag
          };
        } else {
          this.showAccumulation = false;

          this.isShowToast = true;
          this.toastValue = {
            message: res.message,
            flag: CashierConstants.errorFlag
          };
        }
      },
      error: () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: CashierConstants.errorFlag
        };
      }
    });
    this.subscriptions.push(getReleaseUnitPgpsData);
  }

  getHistory() {
    if (this.form.controls['startDate'].value && this.form.controls['endDate'].value) {
      this.isBtnDisable = false;
    }
    this.checkIsDateSelected();
  }

  onBack() {
    this.dialog.closeAll();
  }

  openDatePicker() {
    this.datePicker.open();
    this.isMatLabelHidden = true;
  }

  backToCashier() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
