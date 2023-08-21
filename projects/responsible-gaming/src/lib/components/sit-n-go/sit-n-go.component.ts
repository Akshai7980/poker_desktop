import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { MessageConstant } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import {
  Paths,
  RegexToUnFormatAmount,
  RESPONSIBLE_GAMING,
  ResponsibleGameTab,
  RG_SIT_N_GO
} from '../../constants/app-constants';
import { MAT_DIALOG } from '../../constants/dialog.constants';
import { BuyInLimitComponent } from '../../dialogs/buy-in-limit/buy-in-limit.component';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { RhsImages } from '../../models/common/rhs-image.model';
import { SngBuyInOptions } from '../../models/core-model';
import { RestrictTableTabResponseModel } from '../../models/response/restrict-table-tab.response.model';
import { RestrictTableResponseModel } from '../../models/response/restrict-table.response.model';
import { ValidateSavedDataResponseModel } from '../../models/response/validate-save-data.response.model';
import { RestrictTableTabModel } from '../../models/view/restrict-table-tab.view.model';
import { ValidateSaveDataModel } from '../../models/view/validate-save-data.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

@Component({
  selector: 'app-sit-n-go',
  templateUrl: './sit-n-go.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class SitNGoComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  toastValue: ToastModel;
  isShowToast: boolean = false;
  sngForm: FormGroup = new FormGroup({});
  showBuyInLimitInputField: boolean = false;
  subscriptions: Subscription[] = [];
  validity: number = 0;
  prop: string = '';
  rhsImages: RhsImages[] = [
    { id: 1, imgSrc: 'image1.png' },
    { id: 2, imgSrc: 'image2.png' },
    { id: 3, imgSrc: 'image3.png' }
  ];
  selectedLimitRadio: number;
  selectedOption: string = '';
  enableSubmit: boolean = false;
  settingsName: string;
  lastUpdated: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {}

  ngOnInit(): void {
    this.sngForm = this.formBuilder.group({
      limits: [null, [Validators.required]],
      buyInLimit: [null]
    });

    this.getTableRestrictTabs();

    switch (this.selectedOption) {
      case '':
        this.selectedLimitRadio = RG_SIT_N_GO.PLAY_ALL;
        this.enableSubmit = false;
        break;

      case ResponsibleGameTab.SET_LIMIT:
        if (this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT) this.enableSubmit = false;
        break;

      case ResponsibleGameTab.PLAY_ALL:
        if (this.selectedLimitRadio === RG_SIT_N_GO.PLAY_ALL) this.enableSubmit = false;
        break;

      case ResponsibleGameTab.RESTRICT_ALL:
        if (this.selectedLimitRadio === RG_SIT_N_GO.RESTRICT_ALL) this.enableSubmit = false;
        break;

      default:
        break;
    }
  }

  getTableRestrictTabs() {
    const restrictTableViewModel = new RestrictTableTabModel();

    restrictTableViewModel.clear();

    restrictTableViewModel.clientTab = null;
    restrictTableViewModel.tab = ResponsibleGameTab.SIT_N_GO;

    const restrictTableTab = this.responsibleGamingService
      .getRestrictTableTab(restrictTableViewModel)
      ?.subscribe(
        (res: CustomBaseResponse<RestrictTableTabResponseModel | RestrictTableResponseModel>) => {
          const respData = res.respData as RestrictTableTabResponseModel;
          this.validity = respData.settings[0].validityPeriod;
          this.prop = respData.settings[0].prop;
          const { lastModified } = respData.settings[0];
          this.lastUpdated = lastModified ?? '';
          this.selectedOption = respData.settings[0]?.selectedData
            ? respData.settings[0].selectedData
            : '';
          if (Number(this.selectedOption) > RG_SIT_N_GO.BUY_IN_LIMIT_ZERO) {
            this.selectedLimitRadio = RG_SIT_N_GO.SET_LIMIT;
            this.showBuyInLimitInputField = true;
            const buyInLimit = `₹ ${Number(this.selectedOption).toLocaleString('en-IN', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            })}`;
            this.sngForm.controls['buyInLimit'].setValue(buyInLimit);
          } else {
            switch (this.selectedOption) {
              case ResponsibleGameTab.RESTRICT_ALL:
                this.selectedLimitRadio = RG_SIT_N_GO.RESTRICT_ALL;
                break;

              case ResponsibleGameTab.PLAY_ALL:
                this.selectedLimitRadio = RG_SIT_N_GO.PLAY_ALL;
                break;

              case ResponsibleGameTab.SET_LIMIT:
                this.selectedLimitRadio = RG_SIT_N_GO.SET_LIMIT;
                this.showBuyInLimitInputField = true;
                this.sngForm.controls['buyInLimit'].setValue(this.validity);
                break;

              default:
                break;
            }
          }
        }
      );
    this.subscriptions.push(restrictTableTab);
  }

  onSelectLimitRadio(limit: number, settingsName: string) {
    this.selectedLimitRadio = limit;
    this.settingsName = settingsName;

    if (Number(this.selectedOption) > RG_SIT_N_GO.BUY_IN_LIMIT_ZERO) {
      this.enableSubmit = limit !== RG_SIT_N_GO.SET_LIMIT;
      this.showBuyInLimitInputField = limit === RG_SIT_N_GO.SET_LIMIT;
      return;
    }

    if (this.selectedOption) {
      switch (this.selectedOption) {
        case ResponsibleGameTab.SET_LIMIT:
          this.enableSubmit = limit !== RG_SIT_N_GO.SET_LIMIT;
          break;
        case ResponsibleGameTab.PLAY_ALL:
          this.enableSubmit = limit !== RG_SIT_N_GO.PLAY_ALL;
          break;
        case ResponsibleGameTab.RESTRICT_ALL:
          this.enableSubmit = limit !== RG_SIT_N_GO.RESTRICT_ALL;
          break;
        default:
          break;
      }
    } else {
      switch (settingsName) {
        case ResponsibleGameTab.SET_LIMIT:
          this.enableSubmit = limit === RG_SIT_N_GO.SET_LIMIT;
          break;
        case ResponsibleGameTab.PLAY_ALL:
          this.enableSubmit = limit !== RG_SIT_N_GO.PLAY_ALL;
          break;
        case ResponsibleGameTab.RESTRICT_ALL:
          this.enableSubmit = limit === RG_SIT_N_GO.RESTRICT_ALL;
          break;
        default:
          break;
      }
    }

    this.showBuyInLimitInputField = limit === RG_SIT_N_GO.SET_LIMIT;
    if (limit === RG_SIT_N_GO.SET_LIMIT) {
      this.sngForm.get('buyInLimit')?.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
      this.sngForm.get('buyInLimit')?.clearValidators();
    }
    this.sngForm.get('buyInLimit')?.updateValueAndValidity();
  }

  getPlayFlag(): string {
    if (this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT) {
      return SngBuyInOptions.LIMIT_SPECIFIC_BUY_IN;
    }
    if (this.selectedLimitRadio === RG_SIT_N_GO.PLAY_ALL) {
      return SngBuyInOptions.ALL_PLAY;
    }
    return SngBuyInOptions.NO_PLAY;
  }

  openDialog() {
    const dialogRef = this.dialog.open(BuyInLimitComponent, {
      ...MAT_DIALOG.AnimatedResponsibleGamingDialog,
      data: {
        from: ResponsibleGameTab.SNG,
        buyInLimit:
          this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT
            ? this.sngForm.controls['buyInLimit'].value.replace(RegexToUnFormatAmount.pattern, '')
            : '',
        sng_limit: this.getPlayFlag(),
        settingsName: this.settingsName,
        prop: this.prop,
        tabName: ResponsibleGameTab.SIT_N_GO
      }
    });
    const dialog = dialogRef.afterClosed()?.subscribe((res) => {
      if (res) {
        this.getTableRestrictTabs();
        this.enableSubmit = false;
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.successfullySetSng,
          flag: ResponsibleGameTab.SUCCESS_FLAG
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  onSubmit() {
    this.enableSubmit = false;
    let value = '';
    let buyInLimit;
    if (this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT) {
      buyInLimit = this.sngForm.controls['buyInLimit'].value.replace(
        RegexToUnFormatAmount.pattern,
        ''
      );
    }
    switch (this.selectedLimitRadio) {
      case RG_SIT_N_GO.SET_LIMIT:
        if (Number(buyInLimit) > RG_SIT_N_GO.BUY_IN_LIMIT_ZERO) {
          value = buyInLimit;
        } else {
          this.sngForm.controls['buyInLimit'].reset();
          return;
        }
        break;
      case RG_SIT_N_GO.PLAY_ALL:
        value = ResponsibleGameTab.PLAY_ALL;
        break;
      case RG_SIT_N_GO.RESTRICT_ALL:
        value = ResponsibleGameTab.RESTRICT_ALL;
        break;
      default:
        break;
    }

    const validateSaveDataModel = new ValidateSaveDataModel();

    validateSaveDataModel.clear();

    validateSaveDataModel.clientTab = null;
    validateSaveDataModel.tab = ResponsibleGameTab.SIT_N_GO;
    validateSaveDataModel.settings = [
      {
        values: [value],
        prop: this.prop
      }
    ];

    const validateSaveData = this.responsibleGamingService
      .toValidateSaveData(validateSaveDataModel)
      ?.subscribe((res: CustomBaseResponse<ValidateSavedDataResponseModel[]>) => {
        if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
          const [arrayData] = res.respData;
          if (arrayData.code === RESPONSIBLE_GAMING.VALID_OTP) {
            this.openDialog();
          } else if (arrayData.code === RESPONSIBLE_GAMING.ALREADY_UPDATED) {
            this.toastValue = {
              message: MessageConstant.RGLimitsAreAlreadySet + arrayData.validTill,
              flag: ResponsibleGameTab.INFO_FLAG
            };
            this.isShowToast = true;
          }
        }
      });
    this.subscriptions.push(validateSaveData);
  }

  onChangeLimit(event: Event) {
    let buyInLimit = this.sngForm.controls['buyInLimit'].value.replace(
      RegexToUnFormatAmount.pattern,
      ''
    );
    buyInLimit = Number(buyInLimit);

    if (buyInLimit === RG_SIT_N_GO.BUY_IN_LIMIT_ZERO) {
      buyInLimit = RG_SIT_N_GO.BUY_IN_LIMIT_ONE;
    }

    if (
      buyInLimit === RG_SIT_N_GO.BUY_IN_LIMIT_ONE &&
      (event as KeyboardEvent).key === ResponsibleGameTab.BACKSPACE
    ) {
      buyInLimit = '';
    }

    if (
      this.selectedOption !== ResponsibleGameTab.PLAY_ALL &&
      this.selectedOption !== ResponsibleGameTab.RESTRICT_ALL
    ) {
      this.enableSubmit = false;
      if (
        buyInLimit > RG_SIT_N_GO.BUY_IN_LIMIT_ZERO &&
        (!this.selectedOption || buyInLimit !== Number(this.selectedOption))
      ) {
        this.enableSubmit = true;
      }
    }

    buyInLimit = `₹ ${buyInLimit.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;

    if (`${buyInLimit}`.trim() === `₹` || `${buyInLimit}`.trim() === `₹ 0`) {
      this.sngForm.controls['buyInLimit'].patchValue('');
    } else {
      this.sngForm.controls['buyInLimit'].patchValue(buyInLimit);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }
}
