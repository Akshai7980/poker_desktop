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
import { TournamentBuyInOptions } from '../../models/core-model';
import { RestrictTableTabResponseModel } from '../../models/response/restrict-table-tab.response.model';
import { RestrictTableResponseModel } from '../../models/response/restrict-table.response.model';
import { ValidateSavedDataResponseModel } from '../../models/response/validate-save-data.response.model';
import { RestrictTableTabModel } from '../../models/view/restrict-table-tab.view.model';
import { ValidateSaveDataModel } from '../../models/view/validate-save-data.view.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class TournamentComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  isShowToast: boolean = false;
  tournamentForm: FormGroup = new FormGroup({});
  showBuyInLimitInputField: boolean = false;
  subscriptions: Subscription[] = [];
  validity: number = 0;
  prop: string = '';
  selectedLimitRadio: number = 2;
  rhsImages: RhsImages[] = [
    { id: 1, imgSrc: 'image1.png' },
    { id: 2, imgSrc: 'image2.png' },
    { id: 3, imgSrc: 'image3.png' }
  ];
  lastUpdated: string;
  selectedOption: string;
  enableSubmit: boolean = false;
  settingsName: string;
  toastValue: ToastModel;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly responsibleGamingService: ResponsibleGameService
  ) {}

  ngOnInit(): void {
    this.tournamentForm = this.formBuilder.group({
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
    restrictTableViewModel.tab = ResponsibleGameTab.TOURNAMENT;

    const restrictTableTab = this.responsibleGamingService
      .getRestrictTableTab(restrictTableViewModel)
      ?.subscribe(
        (res: CustomBaseResponse<RestrictTableTabResponseModel | RestrictTableResponseModel>) => {
          const respData = res.respData as RestrictTableTabResponseModel;
          this.validity = respData.settings[0].validityPeriod;
          this.prop = respData.settings[0].prop;
          const { lastModified } = respData.settings[0];
          this.lastUpdated = lastModified ?? '';
          this.selectedOption = respData.settings[0]?.selectedData;

          if (Number(this.selectedOption) > RG_SIT_N_GO.BUY_IN_LIMIT_ZERO) {
            this.selectedLimitRadio = RG_SIT_N_GO.SET_LIMIT;
            this.showBuyInLimitInputField = true;
            const buyInLimit = `₹ ${Number(this.selectedOption).toLocaleString('en-IN', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            })}`;
            this.tournamentForm.controls['buyInLimit'].setValue(buyInLimit);
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
                this.tournamentForm.controls['buyInLimit'].setValue(this.validity);
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
      if (limit !== RG_SIT_N_GO.BUY_IN_LIMIT_ONE) {
        this.enableSubmit = true;
        this.showBuyInLimitInputField = false;
      } else {
        if (
          this.tournamentForm.controls['buyInLimit'].value.replace(
            RegexToUnFormatAmount.pattern,
            ''
          ) !== Number(this.selectedOption)
        ) {
          this.enableSubmit = false;
        }
        this.showBuyInLimitInputField = true;
      }
      return;
    }

    if (this.selectedOption) {
      switch (this.selectedOption) {
        case ResponsibleGameTab.SET_LIMIT:
          if (limit !== RG_SIT_N_GO.SET_LIMIT) this.enableSubmit = true;

          break;

        case ResponsibleGameTab.PLAY_ALL:
          if (limit !== RG_SIT_N_GO.PLAY_ALL) this.enableSubmit = true;
          else this.enableSubmit = false;

          break;

        case ResponsibleGameTab.RESTRICT_ALL:
          if (limit !== RG_SIT_N_GO.RESTRICT_ALL) this.enableSubmit = true;
          else this.enableSubmit = false;

          break;
        default:
          break;
      }
    } else {
      switch (settingsName) {
        case ResponsibleGameTab.SET_LIMIT:
          if (limit === RG_SIT_N_GO.SET_LIMIT) this.enableSubmit = true;

          break;

        case ResponsibleGameTab.PLAY_ALL:
          if (limit === RG_SIT_N_GO.PLAY_ALL) this.enableSubmit = false;

          break;

        case ResponsibleGameTab.RESTRICT_ALL:
          if (limit === RG_SIT_N_GO.RESTRICT_ALL) this.enableSubmit = true;
          else this.enableSubmit = false;

          break;
        default:
          break;
      }
    }

    if (limit === RG_SIT_N_GO.BUY_IN_LIMIT_ONE) {
      this.tournamentForm?.get('buyInLimit')?.setValidators([Validators.required]);
      this.tournamentForm?.get('buyInLimit')?.updateValueAndValidity();

      this.showBuyInLimitInputField = true;
    } else {
      this.showBuyInLimitInputField = false;
      this.tournamentForm?.get('buyInLimit')?.removeValidators([Validators.required]);
      this.tournamentForm?.get('buyInLimit')?.updateValueAndValidity();
    }
  }

  getPlayFlag(): string {
    if (this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT) {
      return TournamentBuyInOptions.LIMIT_SPECIFIC_BUY_IN;
    }
    if (this.selectedLimitRadio === RG_SIT_N_GO.PLAY_ALL) {
      return TournamentBuyInOptions.ALL_PLAY;
    }
    return TournamentBuyInOptions.NO_PLAY;
  }

  onSubmit() {
    this.enableSubmit = false;
    let value = '';
    let buyInLimit;
    if (this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT) {
      buyInLimit = this.tournamentForm.controls['buyInLimit'].value.replace(
        RegexToUnFormatAmount.pattern,
        ''
      );
    }
    switch (this.selectedLimitRadio) {
      case RG_SIT_N_GO.SET_LIMIT:
        if (Number(buyInLimit) > RG_SIT_N_GO.BUY_IN_LIMIT_ZERO) {
          value = buyInLimit;
        } else {
          this.tournamentForm.controls['buyInLimit'].reset();
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
    validateSaveDataModel.tab = ResponsibleGameTab.TOURNAMENT;
    validateSaveDataModel.settings = [
      {
        values: [value],
        prop: this.prop
      }
    ];

    const validateSaveData = this.responsibleGamingService
      .toValidateSaveData(validateSaveDataModel)
      ?.subscribe((res: CustomBaseResponse<ValidateSavedDataResponseModel[]>) => {
        this.enableSubmit = true;
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

  openDialog() {
    const dialogRef = this.dialog.open(BuyInLimitComponent, {
      ...MAT_DIALOG.AnimatedResponsibleGamingDialog,
      data: {
        from: ResponsibleGameTab.TOURNAMENT_NAME,
        buyInLimit:
          this.selectedLimitRadio === RG_SIT_N_GO.SET_LIMIT
            ? this.tournamentForm.controls['buyInLimit'].value.replace(
                RegexToUnFormatAmount.pattern,
                ''
              )
            : '',
        tournament_limit: this.getPlayFlag(),
        settingsName: this.settingsName,
        prop: this.prop,
        tabName: ResponsibleGameTab.TOURNAMENT
      }
    });
    const dialog = dialogRef.afterClosed()?.subscribe((res) => {
      if (res) {
        this.getTableRestrictTabs();
        this.enableSubmit = false;
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.successfullySetTournament,
          flag: ResponsibleGameTab.SUCCESS_FLAG
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  onChangeLimit(event: Event) {
    let buyInLimit = this.tournamentForm.controls['buyInLimit'].value.replace(
      RegexToUnFormatAmount.pattern,
      ''
    );
    buyInLimit = Number(buyInLimit);

    if (buyInLimit === RG_SIT_N_GO.BUY_IN_LIMIT_ONE) {
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
      this.tournamentForm.controls['buyInLimit'].patchValue('');
    } else {
      this.tournamentForm.controls['buyInLimit'].setValue(buyInLimit);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }
}
