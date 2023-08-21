import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import {
  GlobalConstant,
  UserSettingsModel,
  SettingsService,
  SfsRequestService,
  UserAccountService,
  UtilityService,
  BroadcastService,
  MessageConstant
} from 'projects/shared/src/public-api';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { Paths, SettingsConstants } from 'projects/shared/src/lib/constants/app-constants';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import { SettingsModelNew } from '../../models/settings-new.model';

@Component({
  selector: 'app-buy-in-preferences',
  templateUrl: './buy-in-preferences.component.html'
})
export class BuyInPreferencesComponent extends SettingsModelNew implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-1 pt-1 px-4 pb-4 ovf-y-auto';

  arrAutoBuyIn: UserSettingsModel;

  arrAutoBuyInBb: UserSettingsModel;

  arrAutoRebuyInForm: UserSettingsModel;

  arrAutoRebuy: Array<UserSettingsModel>;

  arrAddChips: Array<UserSettingsModel>;

  NG_AUTO_REBUY_VALUE: string;

  toastValue: ToastModel;

  isShowToast: boolean = false;

  override isAutoBuyInFlag = false;

  assetsImagePath = Paths.imagePath;

  constructor(
    public override utilityService: UtilityService,
    public override http: HttpClient,
    public override windowCommService: WindowCommService,
    public override cdr: ChangeDetectorRef,
    public override userAccountService: UserAccountService,
    public override userPreferencesService: UserPreferencesService,
    public override sfsRequestService: SfsRequestService,
    public override broadcastService: BroadcastService,
    public override settingsService: SettingsService
  ) {
    super(
      utilityService,
      http,
      windowCommService,
      cdr,
      userAccountService,
      userPreferencesService,
      sfsRequestService,
      broadcastService
    );

    this.arrAutoBuyIn = {
      keyName: GlobalConstant.AUTO_BUY_IN_SETTINGS,
      keyValue: '0',
      keyStatus: 'ACTIVE'
    };

    this.arrAutoBuyInBb = {
      keyName: GlobalConstant.AUTO_BUY_IN_BB_SETTINGS,
      keyValue: '',
      keyStatus: 'ACTIVE'
    };

    this.arrAutoRebuyInForm = {
      keyName: GlobalConstant.AUTO_REBUY_IN_FORM,
      keyValue: '0',
      keyStatus: 'ACTIVE'
    };

    this.arrAutoRebuy = [
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: '0',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: 'BB-',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: '2',
        keyStatus: 'INACTIVE'
      }
    ];

    this.arrAddChips = [
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '0',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '1',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '2',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '4BB-',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_FOCUS_USER_TURN,
        keyValue: '4BB-',
        keyStatus: 'INACTIVE'
      }
    ];
  }

  setValueToSettingsModel() {
    const obj = {
      NG_AUTO_BUYIN_FLAG: this.arrAutoBuyIn.keyValue !== '0',
      NG_AUTO_BUYIN_VALUE: this.arrAutoBuyInBb.keyValue,
      NG_AUTO_REBUY_FLAG: this.arrAutoRebuyInForm.keyValue !== '0',
      NG_AUTO_REBUY_VALUE: '0',
      NG_ADD_CHIPS_VALUE: '0',
      autoRebuyFlag: '',
      autoRebuyValue: '',
      addChipsFlag: '',
      addChipsValue: ''
    };
    this.arrAutoRebuy.forEach((item) => {
      if (item.keyStatus === 'ACTIVE') {
        if (item.keyValue.toString().indexOf('BB-') !== -1) {
          obj.autoRebuyFlag = '1';
          obj.autoRebuyValue = item.keyValue.replace('BB-', '');
          obj.NG_AUTO_REBUY_VALUE = item.keyValue.replace('BB-', '');
        } else {
          obj.autoRebuyFlag = item.keyValue;
          obj.autoRebuyValue = '';
          obj.NG_AUTO_REBUY_VALUE = '';
        }
      }
    });
    this.arrAddChips.forEach((item) => {
      if (item.keyStatus === 'ACTIVE') {
        if (item.keyValue.toString().indexOf('BB-') !== -1) {
          obj.addChipsFlag = '3';
          obj.addChipsValue = item.keyValue.replace('4BB-', '');
          obj.NG_ADD_CHIPS_VALUE = item.keyValue.replace('4BB-', '');
        } else {
          obj.addChipsFlag = item.keyValue;
          obj.addChipsValue = '';
          obj.NG_ADD_CHIPS_VALUE = '';
        }
      }
    });

    return obj;
  }

  ngOnInit(): void {
    super.OnInit();

    this.settingsService.userSettings.subscribe((params: Array<UserSettingsModel>) => {
      this.isAutoBuyInFlag = false;

      params.forEach((param) => {
        switch (param.keyName) {
          case GlobalConstant.AUTO_BUY_IN_SETTINGS:
            this.handleAutoBuyInSetting(param);
            break;

          case GlobalConstant.AUTO_BUY_IN_BB_SETTINGS:
            this.handleAutoBuyInBbSetting(param);
            break;

          case GlobalConstant.AUTO_REBUY_IN_FORM:
            this.handleAutoRebuyInForm(param);
            break;

          case GlobalConstant.AUTO_REBUY_SETTINGS:
            this.handleAutoRebuySettings();
            break;

          case GlobalConstant.ADD_CHIPS_SETTINGS:
            this.handleAddChipsSettings();
            break;

          default:
            break;
        }
      });
    });
  }

  handleAutoBuyInSetting(param: UserSettingsModel) {
    this.isAutoBuyInFlag = param.keyValue.toString() === '1';
    this.arrAutoBuyIn.keyStatus = param.keyStatus;
  }

  handleAutoBuyInBbSetting(param: UserSettingsModel) {
    this.autoBuyInValue = param.keyValue.toString();
    this.arrAutoBuyInBb.keyStatus = param.keyStatus;
  }

  handleAutoRebuyInForm(param: UserSettingsModel) {
    this.isAutoRebuyFlag = param.keyValue.toString() === '1';
    this.arrAutoRebuyInForm.keyStatus = param.keyStatus;
  }

  handleAutoRebuySettings() {
    this.arrAutoRebuy.forEach((item) => {
      if (item.keyValue.toString().indexOf('BB-') !== -1) {
        this.autoRebuyFlag = '1';
        this.autoRebuyValue = item.keyValue.replace('BB-', '');
      } else {
        this.autoRebuyFlag = item.keyValue;
        this.autoRebuyValue = '';
      }
    });
  }

  handleAddChipsSettings() {
    this.arrAddChips.forEach((item) => {
      if (item.keyValue.toString().indexOf('4BB-') !== -1) {
        this.addChipsFlag = '3';
        this.addChipsValue = item.keyValue.replace('4BB-', '');
      } else {
        this.addChipsFlag = item.keyValue;
        this.addChipsValue = '';
      }
    });
  }

  onSave() {
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.savedSuccessMessage,
      flag: SettingsConstants.Flag.SUCCESS
    };
  }

  preventText($event: Event | InputEvent | KeyboardEvent) {
    if ($event?.target) {
      const inputElement = $event.target as HTMLInputElement;
      const value = inputElement.value.replace(/\D/g, '');
      inputElement.value = value;
    }
  }
}
