import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { MessageConstant } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import {
  Paths,
  RESPONSIBLE_GAMING,
  ResponsibleGameTab,
  RG_CASH_TAB
} from '../../constants/app-constants';
import { MAT_DIALOG } from '../../constants/dialog.constants';
import { RestrictTableLimitComponent } from '../../dialogs/restrict-table-limit/restrict-table-limit.component';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { RhsImages } from '../../models/common/rhs-image.model';
import { RestrictTableTabResponseModel } from '../../models/response/restrict-table-tab.response.model';
import { RestrictTableResponseModel } from '../../models/response/restrict-table.response.model';
import { ValidateSavedDataResponseModel } from '../../models/response/validate-save-data.response.model';
import { RestrictTableTabModel } from '../../models/view/restrict-table-tab.view.model';
import { ValidateSaveDataCashModel } from '../../models/view/validate-save-data-cash.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

interface SettingsData {
  selectedData: string;
  selectedDuration: string;
  values: string[];
  duration: string[];
  lastModified: string;
}
@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class CashComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  toastValue: ToastModel;
  isShowToast: boolean = false;
  showOtpButton: boolean;
  isBlindSet: boolean = false;
  cashForm: FormGroup = new FormGroup({});
  subscriptions: Subscription[] = [];
  selectedHoldemBlind: string;
  selectedPLOBlind: string;
  selectedPLO5Blind: string;
  selectedPLO6Blind: string;
  selectedCPBlind: string;
  selectedHoldemDuration: string;
  selectedPLODuration: string;
  selectedPLO5Duration: string;
  selectedPLO6Duration: string;
  selectedCPDuration: string;
  rhsImages: RhsImages[] = [
    { id: 1, imgSrc: 'image1.png' },
    { id: 2, imgSrc: 'image2.png' },
    { id: 3, imgSrc: 'image3.png' }
  ];
  holdemOptions: string[];
  ploOptions: string[];
  plo5Options: string[];
  plo6Options: string[];
  crazyPineOptions: string[];
  holdemDurations: string[];
  ploDurations: string[];
  plo5Durations: string[];
  plo6Durations: string[];
  crazyPineDuration: string[];
  enableSubmit: boolean = false;
  gameVariants: { name: string }[];
  settingsData: SettingsData[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {
    this.cashForm = this.formBuilder.group({
      holdemBlinds: ['', [Validators.required]],
      holdemDuration: ['', [Validators.required]],
      ploBlinds: ['', [Validators.required]],
      ploDuration: ['', [Validators.required]],
      plo5Blinds: ['', [Validators.required]],
      plo5Duration: ['', [Validators.required]],
      plo6Blinds: ['', [Validators.required]],
      plo6Duration: ['', [Validators.required]],
      blinds: ['', [Validators.required]],
      duration: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getTableRestrictTabs();
    this.cashForm.controls['holdemBlinds'].setValue(RG_CASH_TAB.PLAY_ALL);
    this.cashForm.controls['ploBlinds'].setValue(RG_CASH_TAB.PLAY_ALL);
    this.cashForm.controls['plo5Blinds'].setValue(RG_CASH_TAB.PLAY_ALL);
    this.cashForm.controls['plo6Blinds'].setValue(RG_CASH_TAB.PLAY_ALL);
    this.cashForm.controls['blinds'].setValue(RG_CASH_TAB.PLAY_ALL);
  }

  onOptionChange(type: string, controlName: string) {
    if (type === RG_CASH_TAB.HOLDEM && controlName === RG_CASH_TAB.CASH_BLIND) {
      if (this.selectedHoldemBlind === RG_CASH_TAB.PLAY_ALL) {
        this.cashForm.controls['holdemBlinds'].setValue(RG_CASH_TAB.PLAY_ALL);
        this.cashForm.controls['holdemDuration'].reset();
      }
    } else if (type === RG_CASH_TAB.HOLDEM && controlName === RG_CASH_TAB.CASH_DURATION) {
      if (this.selectedHoldemBlind && this.selectedHoldemDuration) {
        this.enableSubmit = true;
      } else this.enableSubmit = false;
    }

    if (type === RG_CASH_TAB.PLO && controlName === RG_CASH_TAB.CASH_BLIND) {
      if (this.selectedPLOBlind === RG_CASH_TAB.PLAY_ALL) {
        this.cashForm.controls['ploBlinds'].setValue(RG_CASH_TAB.PLAY_ALL);
        this.cashForm.controls['ploDuration'].reset();
      }
    } else if (type === RG_CASH_TAB.PLO && controlName === RG_CASH_TAB.CASH_DURATION) {
      if (this.selectedPLOBlind && this.selectedPLODuration) {
        this.enableSubmit = true;
      } else this.enableSubmit = false;
    }

    if (type === RG_CASH_TAB.PLO5 && controlName === RG_CASH_TAB.CASH_BLIND) {
      if (this.selectedPLO5Blind === RG_CASH_TAB.PLAY_ALL) {
        this.cashForm.controls['plo5Blinds'].setValue(RG_CASH_TAB.PLAY_ALL);
        this.cashForm.controls['plo5Duration'].reset();
      }
    } else if (type === RG_CASH_TAB.PLO5 && controlName === RG_CASH_TAB.CASH_DURATION) {
      if (this.selectedPLO5Blind && this.selectedPLO5Duration) {
        this.enableSubmit = true;
      } else this.enableSubmit = false;
    }

    if (type === RG_CASH_TAB.PLO6 && controlName === RG_CASH_TAB.CASH_BLIND) {
      if (this.selectedPLO6Blind === RG_CASH_TAB.PLAY_ALL) {
        this.cashForm.controls['plo6Blinds'].setValue(RG_CASH_TAB.PLAY_ALL);
        this.cashForm.controls['plo6Duration'].reset();
      }
    } else if (type === RG_CASH_TAB.PLO6 && controlName === RG_CASH_TAB.CASH_DURATION) {
      if (this.selectedPLO6Blind && this.selectedPLO6Duration) {
        this.enableSubmit = true;
      } else this.enableSubmit = false;
    }

    if (type === RG_CASH_TAB.CRAZY && controlName === RG_CASH_TAB.CASH_BLIND) {
      if (this.selectedCPBlind === RG_CASH_TAB.PLAY_ALL) {
        this.cashForm.controls['blinds'].setValue(RG_CASH_TAB.PLAY_ALL);
        this.cashForm.controls['duration'].reset();
      }
    } else if (type === RG_CASH_TAB.CRAZY && controlName === RG_CASH_TAB.CASH_DURATION) {
      if (this.selectedCPBlind && this.selectedCPDuration) {
        this.enableSubmit = true;
      } else this.enableSubmit = false;
    }
  }

  getTableRestrictTabs() {
    const restrictTableViewModel = new RestrictTableTabModel();

    restrictTableViewModel.clear();

    restrictTableViewModel.clientTab = null;
    restrictTableViewModel.tab = ResponsibleGameTab.RG_CASH;

    const restrictTableTab = this.responsibleGamingService
      .getRestrictTableTab(restrictTableViewModel)
      .subscribe(
        (res: CustomBaseResponse<RestrictTableTabResponseModel | RestrictTableResponseModel>) => {
          if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
            const respData = res.respData as RestrictTableTabResponseModel;
            const settingsData = respData.settings;
            this.gameVariants = settingsData.map((setting: { prop: string }) => ({
              name: setting.prop
            }));
            this.assignRespData(settingsData);
          }
        }
      );
    this.subscriptions.push(restrictTableTab);
  }

  assignRespData(settingsData: any) {
    this.settingsData = settingsData;
    this.holdemOptions = settingsData[0]?.values ? settingsData[0].values : [];
    this.ploOptions = settingsData[1]?.values ? settingsData[1].values : [];
    this.plo5Options = settingsData[2]?.values ? settingsData[2].values : [];
    this.plo6Options = settingsData[3]?.values ? settingsData[3].values : [];
    this.crazyPineOptions = settingsData[4]?.values ? settingsData[4].values : [];
    this.holdemDurations = settingsData[0]?.duration ? settingsData[0].duration : [];
    this.ploDurations = settingsData[1]?.duration ? settingsData[1].duration : [];
    this.plo5Durations = settingsData[2]?.duration ? settingsData[2].duration : [];
    this.plo6Durations = settingsData[3]?.duration ? settingsData[3].duration : [];
    this.crazyPineDuration = settingsData[4]?.duration ? settingsData[4].duration : [];
    if (
      settingsData[0]?.selectedData ||
      settingsData[0]?.selectedDuration ||
      settingsData[0]?.lastModified
    ) {
      this.cashForm.controls['holdemBlinds'].setValue(settingsData[0]?.selectedData);
      this.cashForm.controls['holdemDuration'].setValue(settingsData[0]?.selectedDuration);
    }

    if (
      settingsData[1]?.selectedData ||
      settingsData[1]?.selectedDuration ||
      settingsData[1]?.lastModified
    ) {
      this.cashForm.controls['ploBlinds'].setValue(settingsData[1]?.selectedData);
      this.cashForm.controls['ploDuration'].setValue(settingsData[1]?.selectedDuration);
    }

    if (
      settingsData[2]?.selectedData ||
      settingsData[2]?.selectedDuration ||
      settingsData[2]?.lastModified
    ) {
      this.cashForm.controls['plo5Blinds'].setValue(settingsData[2]?.selectedData);
      this.cashForm.controls['plo5Duration'].setValue(settingsData[2]?.selectedDuration);
    }

    if (
      settingsData[3]?.selectedData ||
      settingsData[3]?.selectedDuration ||
      settingsData[3]?.lastModified
    ) {
      this.cashForm.controls['plo6Blinds'].setValue(settingsData[3]?.selectedData);
      this.cashForm.controls['plo6Duration'].setValue(settingsData[3]?.selectedDuration);
    }

    if (
      settingsData[4]?.selectedData ||
      settingsData[4]?.selectedDuration ||
      settingsData[4]?.lastModified
    ) {
      this.cashForm.controls['blinds'].setValue(settingsData[4]?.selectedData);
      this.cashForm.controls['duration'].setValue(settingsData[4]?.selectedDuration);
    }
    this.enableSubmit = false;
  }

  onSubmit() {
    this.enableSubmit = false;

    const dataArray: {
      blinds: string;
      gameVariant: string;
      duration: string;
      lastModified: string;
      initialDuration: string;
    }[] = [];

    if (this.selectedHoldemBlind && this.selectedHoldemDuration) {
      const selectedBlinds = this.cashForm.controls['holdemBlinds'].value;
      const selectedDuration = this.cashForm.controls['holdemDuration'].value;
      const predefinedBlinds = this.settingsData[0].selectedData;
      const predefinedDuration = this.settingsData[0].selectedDuration;

      if (selectedBlinds !== predefinedBlinds || selectedDuration !== predefinedDuration) {
        dataArray.push({
          blinds: this.selectedHoldemBlind,
          gameVariant: RG_CASH_TAB.GAME_VARIANTS[0],
          duration: this.selectedHoldemDuration,
          lastModified: this.settingsData[0].lastModified,
          initialDuration: this.settingsData[0].selectedDuration
        });
      }
    }

    if (this.selectedPLOBlind && this.selectedPLODuration) {
      const selectedBlinds = this.cashForm.controls['ploBlinds'].value;
      const selectedDuration = this.cashForm.controls['ploDuration'].value;
      const predefinedBlinds = this.settingsData[1].selectedData;
      const predefinedDuration = this.settingsData[1].selectedDuration;

      if (selectedBlinds !== predefinedBlinds || selectedDuration !== predefinedDuration) {
        dataArray.push({
          blinds: this.selectedPLOBlind,
          gameVariant: RG_CASH_TAB.GAME_VARIANTS[1],
          duration: this.selectedPLODuration,
          lastModified: this.settingsData[1].lastModified,
          initialDuration: this.settingsData[1].selectedDuration
        });
      }
    }

    if (this.selectedPLO5Blind && this.selectedPLO5Duration) {
      const selectedBlinds = this.cashForm.controls['plo5Blinds'].value;
      const selectedDuration = this.cashForm.controls['plo5Duration'].value;
      const predefinedBlinds = this.settingsData[2].selectedData;
      const predefinedDuration = this.settingsData[2].selectedDuration;

      if (selectedBlinds !== predefinedBlinds || selectedDuration !== predefinedDuration) {
        dataArray.push({
          blinds: this.selectedPLO5Blind,
          gameVariant: RG_CASH_TAB.GAME_VARIANTS[2],
          duration: this.selectedPLO5Duration,
          lastModified: this.settingsData[2].lastModified,
          initialDuration: this.settingsData[2].selectedDuration
        });
      }
    }

    if (this.selectedPLO6Blind && this.selectedPLO6Duration) {
      const selectedBlinds = this.cashForm.controls['plo5Blinds'].value;
      const selectedDuration = this.cashForm.controls['plo5Duration'].value;
      const predefinedBlinds = this.settingsData[3].selectedData;
      const predefinedDuration = this.settingsData[3].selectedDuration;

      if (selectedBlinds !== predefinedBlinds || selectedDuration !== predefinedDuration) {
        dataArray.push({
          blinds: this.selectedPLO6Blind,
          gameVariant: RG_CASH_TAB.GAME_VARIANTS[3],
          duration: this.selectedPLO6Duration,
          lastModified: this.settingsData[3].lastModified,
          initialDuration: this.settingsData[3].selectedDuration
        });
      }
    }

    if (this.selectedCPBlind && this.selectedCPDuration) {
      const selectedBlinds = this.cashForm.controls['plo5Blinds'].value;
      const selectedDuration = this.cashForm.controls['plo5Duration'].value;
      const predefinedBlinds = this.settingsData[4].selectedData;
      const predefinedDuration = this.settingsData[4].selectedDuration;

      if (selectedBlinds !== predefinedBlinds || selectedDuration !== predefinedDuration) {
        dataArray.push({
          blinds: this.selectedCPBlind,
          gameVariant: RG_CASH_TAB.GAME_VARIANTS[4],
          duration: this.selectedCPDuration,
          lastModified: this.settingsData[4].lastModified,
          initialDuration: this.settingsData[4].selectedDuration
        });
      }
    }

    const validateSaveDataModel = new ValidateSaveDataCashModel();

    validateSaveDataModel.clear();

    validateSaveDataModel.tab = ResponsibleGameTab.RG_CASH;
    validateSaveDataModel.settings = [];
    dataArray.forEach((element: { blinds: string; gameVariant: string; duration: string }) => {
      validateSaveDataModel.settings.push({
        values: [element.blinds],
        prop: element.gameVariant,
        duration: [element.duration]
      });
    });

    const validateSaveData = this.responsibleGamingService
      .toValidateSaveDataCash(validateSaveDataModel)
      .subscribe((res: CustomBaseResponse<ValidateSavedDataResponseModel[]>) => {
        this.enableSubmit = true;
        if (res.respCode === RESPONSIBLE_GAMING.SUCCESS) {
          const [arrayData] = res.respData;
          if (arrayData.code === RESPONSIBLE_GAMING.VALID_OTP) {
            this.openDialog(dataArray);
          } else if (
            arrayData.code === RESPONSIBLE_GAMING.NO_CHANGE ||
            arrayData.code === RESPONSIBLE_GAMING.INVALID_INPUT
          ) {
            this.isShowToast = true;
            this.toastValue = {
              message: MessageConstant.ApiError,
              flag: RG_CASH_TAB.ERROR_FLAG
            };
          } else if (arrayData.code === RESPONSIBLE_GAMING.NOT_VALID) {
            this.showMessage(dataArray);
          }
        }
      });
    this.subscriptions.push(validateSaveData);
  }

  showMessage(
    dataArray: {
      blinds: string;
      gameVariant: string;
      duration: string;
      lastModified: string;
      initialDuration: string;
    }[] = []
  ) {
    if (dataArray.length >= 1 && dataArray.length <= 5) {
      let message = '';

      dataArray.forEach((data, index) => {
        MessageConstant.cashTabMessages.forEach((template) => {
          message += template.replace('%s', data?.gameVariant).replace('%s', data?.initialDuration);
        });

        if (index < dataArray.length - 1) {
          message += ' ';
        }
      });

      this.toastValue = {
        message,
        flag: RG_CASH_TAB.INFO_FLAG
      };
      this.isShowToast = true;
    }
  }

  openDialog(dataArray: { blinds: string; gameVariant: string; duration: string }[]) {
    const dialogRef = this.dialog.open(RestrictTableLimitComponent, {
      ...MAT_DIALOG.AnimatedResponsibleGamingDialog,
      data: {
        from: RG_CASH_TAB.CASH_LABEL,
        details: dataArray
      }
    });

    const dialog = dialogRef.afterClosed().subscribe((res) => {
      if (res === RG_CASH_TAB.SUCCESS_FLAG) {
        this.isShowToast = true;
        this.enableSubmit = false;

        this.toastValue = {
          message: MessageConstant.cashToast,
          flag: RG_CASH_TAB.SUCCESS_FLAG
        };
        this.isBlindSet = true;
      }
    });
    this.subscriptions.push(dialog);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
