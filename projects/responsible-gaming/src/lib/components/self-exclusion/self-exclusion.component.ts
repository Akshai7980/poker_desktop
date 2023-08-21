import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { MessageConstant } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { Paths, RESPONSIBLE_GAMING, ResponsibleGameTab } from '../../constants/app-constants';
import { MAT_DIALOG } from '../../constants/dialog.constants';
import { SelfExclusionFromPlayingComponent } from '../../dialogs/self-exclusion-from-playing/self-exclusion-from-playing.component';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { RhsImages } from '../../models/common/rhs-image.model';
import { RestrictTableTabResponseModel } from '../../models/response/restrict-table-tab.response.model';
import { RestrictTableResponseModel } from '../../models/response/restrict-table.response.model';
import { ValidateSavedDataResponseModel } from '../../models/response/validate-save-data.response.model';
import { RestrictTableTabModel } from '../../models/view/restrict-table-tab.view.model';
import { ValidateSaveDataModel } from '../../models/view/validate-save-data.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

@Component({
  selector: 'app-self-exclusion',
  templateUrl: './self-exclusion.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class SelfExclusionComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  toastValue: ToastModel;
  isShowToast: boolean;
  selfExclusionForm: FormGroup = new FormGroup({});
  subscriptions: Subscription[] = [];
  periodList: string[] = [];
  selectedPeriod: string;
  rhsImages: RhsImages[] = [
    { id: 1, imgSrc: 'image1.png' },
    { id: 2, imgSrc: 'image2.png' },
    { id: 3, imgSrc: 'image3.png' }
  ];
  validity: number;
  prop: string;
  lastUpdated: string;
  period: string;

  constructor(
    public readonly formBuilder: FormBuilder,
    public readonly dialog: MatDialog,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {}

  ngOnInit(): void {
    this.selfExclusionForm = this.formBuilder.group({
      periods: ['', [Validators.required]]
    });
    this.getTableRestrictTabs();
  }

  getTableRestrictTabs() {
    const restrictTableViewModel = new RestrictTableTabModel();

    restrictTableViewModel.clear();

    restrictTableViewModel.clientTab = null;
    restrictTableViewModel.tab = ResponsibleGameTab.SELF_EXCLUSION;

    const restrictTableTab = this.responsibleGamingService
      .getRestrictTableTab(restrictTableViewModel)
      ?.subscribe(
        (res: CustomBaseResponse<RestrictTableTabResponseModel | RestrictTableResponseModel>) => {
          const respData = res.respData as RestrictTableTabResponseModel;
          this.validity = respData.settings[0].validityPeriod;
          this.prop = respData.settings[0].prop;
          this.periodList = respData.settings[0].values;
          const { lastModified } = respData.settings[0];
          this.lastUpdated = lastModified ?? '';
          this.selectedPeriod = respData.settings[0]?.selectedData;
          this.period = respData.settings[0]?.selectedData;
        }
      );
    this.subscriptions.push(restrictTableTab);
  }

  onSubmit() {
    const validateSaveDataModel = new ValidateSaveDataModel();

    validateSaveDataModel.clear();

    validateSaveDataModel.clientTab = null;
    validateSaveDataModel.tab = ResponsibleGameTab.SELF_EXCLUSION;
    validateSaveDataModel.settings = [
      {
        values: [this.selectedPeriod],
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
              message: MessageConstant.selfExclusionMsg + arrayData.validTill,
              flag: ResponsibleGameTab.INFO_FLAG
            };
            this.isShowToast = true;
          }
        }
      });
    this.subscriptions.push(validateSaveData);
  }

  openDialog() {
    const dialogRef = this.dialog.open(SelfExclusionFromPlayingComponent, {
      ...MAT_DIALOG.AnimatedResponsibleGamingDialog,
      data: {
        timeLmt: this.selectedPeriod,
        prop: this.prop,
        tabName: ResponsibleGameTab.SELF_EXCLUSION
      }
    });
    const dialog = dialogRef.afterClosed()?.subscribe((res: string) => {
      if (res) {
        this.getTableRestrictTabs();
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.selfExclusionSuccess,
          flag: ResponsibleGameTab.SUCCESS_FLAG
        };
        this.period = '';
      }
    });
    this.subscriptions.push(dialog);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }
}
