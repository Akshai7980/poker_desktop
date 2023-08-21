import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { Subscription } from 'rxjs';
import {
  MAX_VALUE_POT,
  MIN_VALUE,
  Paths,
  SettingsConstants
} from 'projects/shared/src/lib/constants/app-constants';
import {
  GlobalConstant,
  BetOptionChangeType,
  BetOptionStatus,
  DropDown,
  DropDownItem,
  SettingsService,
  MessageConstant
} from 'projects/shared/src/public-api';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';

@Component({
  selector: 'app-settings-bet-option',
  templateUrl: './settings-bet-option.component.html',
  styleUrls: ['./settings-bet-option.component.scss']
})
export class SettingsBetOptionComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 pt-1 ovf-y-auto';

  checkedPreFlop: Array<boolean> = [false, false, false, false, false, false, false];

  checkedPostFlop: Array<boolean> = [false, false, false, false, false, false, false];

  initialCheckPreFlops: Array<boolean>;

  initialCheckPostFlops: Array<boolean>;

  preFlopValues: Array<string> = ['x2', 'x3', 'x5', '1/2', '3/4', 'Pot', 'Max'];

  postFlopValues: Array<string> = ['x2', 'x3', 'x5', '1/2', '3/4', 'Pot', 'Max'];

  maxValue = MAX_VALUE_POT;

  minValue = MIN_VALUE;

  isToggleEnable: boolean;

  selectedValue1: string = 'Big Blinds';

  selectedValue2: string = 'Small Blinds';

  selectedTab: number = 1;

  selecteddropDown: DropDown;

  isShowToast: boolean = false;

  isPostFlop: boolean = false;

  dropDownList: Array<DropDownItem> = [
    {
      name: 'Min',
      keyName: 'Min'
    },
    {
      name: 'Pot 1/2',
      keyName: '1/2'
    },
    {
      name: 'Pot 3/4',
      keyName: '3/4'
    },
    {
      name: 'Pot',
      keyName: 'Pot'
    },
    {
      name: 'BB/Call',
      keyName: 'x'
    },
    {
      name: 'Max',
      keyName: 'Max'
    }
  ];

  dropDownListPf: Array<DropDownItem> = [
    {
      name: 'Min',
      keyName: 'Min'
    },
    {
      name: 'Pot 1/2',
      keyName: '1/2'
    },
    {
      name: 'Pot 3/4',
      keyName: '3/4'
    },
    {
      name: 'Pot',
      keyName: 'Pot'
    },
    {
      name: 'BB/Call',
      keyName: 'x'
    },
    {
      name: 'Pot %',
      keyName: 'Pot%'
    },
    {
      name: 'Max',
      keyName: 'Max'
    }
  ];

  selecteddropDown1: DropDown;

  dropDownListNumber: Array<DropDownItem> = [
    {
      name: '2',
      keyName: ''
    },
    {
      name: '2.5',
      keyName: ''
    },
    {
      name: '3',
      keyName: ''
    },
    {
      name: '3.5',
      keyName: ''
    },
    {
      name: '4',
      keyName: ''
    },
    {
      name: '4.5',
      keyName: ''
    },
    {
      name: '5',
      keyName: ''
    }
  ];

  dropDownListNumberPot: Array<DropDownItem> = [
    {
      name: '30',
      keyName: '30'
    },
    {
      name: '40',
      keyName: '40'
    },
    {
      name: '50',
      keyName: '50'
    },
    {
      name: '60',
      keyName: '60'
    },
    {
      name: '70',
      keyName: '70'
    },
    {
      name: 'Custom',
      keyName: 'Custom'
    }
  ];

  betOptionForm: FormGroup = new FormGroup({});

  toastValue: ToastModel;

  betOptions: any;

  isDisableBtn: boolean = true;

  globalConstant: typeof GlobalConstant = GlobalConstant;

  setDefabult: boolean = false;

  private subscription: Subscription;

  assetsImagePath = Paths.imagePath;

  constructor(
    public cdr: ChangeDetectorRef,
    private settingsService: SettingsService,
    private userPreferencesService: UserPreferencesService
  ) {
    this.betOptions = this.settingsService.betOptionsDefault;
  }

  ngOnInit(): void {
    this.subscription = this.settingsService.userPref.subscribe(
      (userPreference: UserPreferencesService) => {
        this.userPreferencesService = userPreference;
        this.setValuesToView(userPreference.betOptionsObj);
        this.setBetOptionStatus(
          userPreference.preFlopBetOptionStatus,
          userPreference.postFlopBetOptionStatus
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectTab(id: number) {
    this.selectedTab = id;
    if (this.selectedTab === 2) {
      this.isPostFlop = true;
    } else {
      this.isPostFlop = false;
    }
  }

  radio: string = 'Big Blinds';

  onSelectRadio(event: any) {
    this.radio = event.value;
  }

  onSave() {
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.savedSuccessMessage,
      flag: SettingsConstants.Flag.SUCCESS
    };
  }

  onSettingsChange(data?: BetOptionChangeType, value?: string) {
    let stateChanged1 = false;

    if (data === undefined) {
      this.initialCheckPreFlops.forEach((status, index) => {
        if (this.checkedPreFlop[index] !== status) stateChanged1 = true;
      });

      this.initialCheckPostFlops.forEach((status, index) => {
        if (this.checkedPostFlop[index] !== status) stateChanged1 = true;
      });

      this.isDisableBtn = !stateChanged1;
      return;
    }

    if (data.type === 'POSTFLOP' && data.name.includes('_VAL')) {
      this.betOptions[data.type][data.name] = value;
      stateChanged1 = true;
    }

    const savedBetOptionsOnServer = this.userPreferencesService.getBetOptionsObj();
    this.isDisableBtn = true;

    if (
      this.betOptions.betSliderVal.toString() !== savedBetOptionsOnServer.betSliderVal.toString()
    ) {
      stateChanged1 = true;
    }

    Object.keys(this.betOptions.PREFLOP).forEach((key) => {
      if (!key.includes('_VAL')) {
        if (this.betOptions.PREFLOP[key].keyName !== savedBetOptionsOnServer.PREFLOP[key]) {
          stateChanged1 = true;
        }
      } else if (this.betOptions.PREFLOP[key].name !== savedBetOptionsOnServer.PREFLOP[key]) {
        stateChanged1 = true;
      }
    });
    Object.keys(this.betOptions.POSTFLOP).forEach((key) => {
      if (!key.includes('_VAL')) {
        if (this.betOptions.POSTFLOP[key].keyName !== savedBetOptionsOnServer.POSTFLOP[key]) {
          stateChanged1 = true;
        } else if (this.betOptions.POSTFLOP[key].name !== savedBetOptionsOnServer.POSTFLOP[key]) {
          stateChanged1 = true;
        }
      }
    });

    if (data.type === 'POSTFLOP') {
      if (this.betOptions.POSTFLOP[data.name].keyName === 'x') {
        this.betOptions.POSTFLOP[`${data.name}_VAL`].name = '2';
      } else if (this.betOptions.POSTFLOP[data.name].keyName === 'Pot%') {
        this.betOptions.POSTFLOP[`${data.name}_VAL`].name = '30';
      }

      stateChanged1 = true;
    }

    if (data.type === 'PREFLOP') {
      switch (data.name) {
        case 'BUTTON1':
          this.preFlopValues[0] =
            this.betOptions.PREFLOP.BUTTON1.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON1.keyName;
          break;
        case 'BUTTON1_VAL':
          this.preFlopValues[0] = `x${this.betOptions.PREFLOP.BUTTON1_VAL.name}`;
          break;
        case 'BUTTON2':
          this.preFlopValues[1] =
            this.betOptions.PREFLOP.BUTTON2.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON2.keyName;
          break;
        case 'BUTTON2_VAL':
          this.preFlopValues[1] = `x${this.betOptions.PREFLOP.BUTTON2_VAL.name}`;
          break;
        case 'BUTTON3':
          this.preFlopValues[2] =
            this.betOptions.PREFLOP.BUTTON3.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON3.keyName;
          break;
        case 'BUTTON3_VAL':
          this.preFlopValues[2] = `x${this.betOptions.PREFLOP.BUTTON3_VAL.name}`;
          break;
        case 'BUTTON4':
          this.preFlopValues[3] =
            this.betOptions.PREFLOP.BUTTON4.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON4.keyName;
          break;
        case 'BUTTON4_VAL':
          this.preFlopValues[3] = `x${this.betOptions.PREFLOP.BUTTON4_VAL.name}`;
          break;
        case 'BUTTON5':
          this.preFlopValues[4] =
            this.betOptions.PREFLOP.BUTTON5.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON5.keyName;
          break;
        case 'BUTTON5_VAL':
          this.preFlopValues[4] = `x${this.betOptions.PREFLOP.BUTTON5_VAL.name}`;
          break;
        case 'BUTTON6':
          this.preFlopValues[5] =
            this.betOptions.PREFLOP.BUTTON6.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON6.keyName;
          break;
        case 'BUTTON6_VAL':
          this.preFlopValues[5] = `x${this.betOptions.PREFLOP.BUTTON6_VAL.name}`;
          break;
        case 'BUTTON7':
          this.preFlopValues[6] =
            this.betOptions.PREFLOP.BUTTON7.keyName === 'x'
              ? 'x2'
              : this.betOptions.PREFLOP.BUTTON7.keyName;
          break;
        case 'BUTTON7_VAL':
          this.preFlopValues[6] = `x${this.betOptions.PREFLOP.BUTTON7_VAL.name}`;
          break;
        default:
          break;
      }
    } else {
      switch (data.name) {
        case 'BUTTON1':
          if (this.betOptions.POSTFLOP.BUTTON1.keyName === 'x') {
            this.postFlopValues[0] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON1.keyName === 'Pot%') {
            this.postFlopValues[0] = '%30';
          } else {
            this.postFlopValues[0] = this.betOptions.POSTFLOP.BUTTON1.keyName;
          }
          break;
        case 'BUTTON1_VAL':
          this.postFlopValues[0] =
            this.betOptions.POSTFLOP.BUTTON1.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON1_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON1_VAL.name}`;
          break;
        case 'BUTTON2':
          if (this.betOptions.POSTFLOP.BUTTON2.keyName === 'x') {
            this.postFlopValues[1] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON2.keyName === 'Pot%') {
            this.postFlopValues[1] = '%30';
          } else {
            this.postFlopValues[1] = this.betOptions.POSTFLOP.BUTTON2.keyName;
          }
          break;
        case 'BUTTON2_VAL':
          this.postFlopValues[1] =
            this.betOptions.POSTFLOP.BUTTON2.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON2_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON2_VAL.name}`;
          break;
        case 'BUTTON3':
          if (this.betOptions.POSTFLOP.BUTTON3.keyName === 'x') {
            this.postFlopValues[2] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON3.keyName === 'Pot%') {
            this.postFlopValues[2] = '%30';
          } else {
            this.postFlopValues[2] = this.betOptions.POSTFLOP.BUTTON3.keyName;
          }
          break;
        case 'BUTTON3_VAL':
          this.postFlopValues[2] =
            this.betOptions.POSTFLOP.BUTTON3.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON3_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON3_VAL.name}`;
          break;
        case 'BUTTON4':
          if (this.betOptions.POSTFLOP.BUTTON4.keyName === 'x') {
            this.postFlopValues[3] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON4.keyName === 'Pot%') {
            this.postFlopValues[3] = '%30';
          } else {
            this.postFlopValues[3] = this.betOptions.POSTFLOP.BUTTON4.keyName;
          }
          break;
        case 'BUTTON4_VAL':
          this.postFlopValues[3] =
            this.betOptions.POSTFLOP.BUTTON4.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON4_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON4_VAL.name}`;
          break;
        case 'BUTTON5':
          if (this.betOptions.POSTFLOP.BUTTON5.keyName === 'x') {
            this.postFlopValues[4] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON5.keyName === 'Pot%') {
            this.postFlopValues[4] = '%30';
          } else {
            this.postFlopValues[4] = this.betOptions.POSTFLOP.BUTTON5.keyName;
          }
          break;
        case 'BUTTON5_VAL':
          this.postFlopValues[4] =
            this.betOptions.POSTFLOP.BUTTON5.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON5_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON5_VAL.name}`;
          break;
        case 'BUTTON6':
          if (this.betOptions.POSTFLOP.BUTTON6.keyName === 'x') {
            this.postFlopValues[5] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON6.keyName === 'Pot%') {
            this.postFlopValues[5] = '%30';
          } else {
            this.postFlopValues[5] = this.betOptions.POSTFLOP.BUTTON6.keyName;
          }
          break;
        case 'BUTTON6_VAL':
          this.postFlopValues[5] =
            this.betOptions.POSTFLOP.BUTTON6.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON6_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON6_VAL.name}`;
          break;
        case 'BUTTON7':
          if (this.betOptions.POSTFLOP.BUTTON7.keyName === 'x') {
            this.postFlopValues[6] = 'x2';
          } else if (this.betOptions.POSTFLOP.BUTTON7.keyName === 'Pot%') {
            this.postFlopValues[6] = '%30';
          } else {
            this.postFlopValues[6] = this.betOptions.POSTFLOP.BUTTON7.keyName;
          }
          break;
        case 'BUTTON7_VAL':
          this.postFlopValues[6] =
            this.betOptions.POSTFLOP.BUTTON7.keyName === 'x'
              ? `x${this.betOptions.POSTFLOP.BUTTON7_VAL.name}`
              : `%${this.betOptions.POSTFLOP.BUTTON7_VAL.name}`;
          break;
        default:
          break;
      }
    }

    if (data && this.betOptions[data.type][data.name] === 'x') {
      this.betOptions[data.type][`${data.name}_VAL`] = 2;
    }
    if (data && this.betOptions[data.type][data.name] === 'Pot%') {
      this.betOptions[data.type][`${data.name}_VAL`] = 30;
    }

    this.initialCheckPreFlops.forEach((status, index) => {
      if (this.checkedPreFlop[index] !== status) stateChanged1 = true;
    });

    this.initialCheckPostFlops.forEach((status, index) => {
      if (this.checkedPostFlop[index] !== status) stateChanged1 = true;
    });

    if (stateChanged1) {
      this.isDisableBtn = false;
    }
  }

  betOptionsInputValidate(from: string, pos: string, btnNum: string, potValue: string) {
    if (from === 'keyup') {
      if (
        this.betOptions[pos][`${btnNum}_VAL`] !== '' &&
        Number.isNaN(parseFloat(this.betOptions[pos][`${btnNum}_VAL`]))
      ) {
        this.betOptions[pos][`${btnNum}_VAL`] = '1';
      }

      if (pos === 'POSTFLOP' && potValue === 'pot%') {
        if (this.betOptions[pos][`${btnNum}_VAL`] >= 151) {
          this.betOptions[pos][`${btnNum}_VAL`] = '150';
        }
      } else if (this.betOptions[pos][`${btnNum}_VAL`] >= 100) {
        this.betOptions[pos][`${btnNum}_VAL`] = '99';
      }

      if (this.betOptions[pos][`${btnNum}_VAL`] < 0) {
        if (this.betOptions[pos][btnNum] === 'x') {
          this.betOptions[pos][`${btnNum}_VAL`] = '2';
        } else {
          this.betOptions[pos][`${btnNum}_VAL`] = '30';
        }
      }
    } else if (Number.isNaN(parseFloat(this.betOptions[pos][`${btnNum}_VAL`]))) {
      if (this.betOptions[pos][btnNum] === 'x') {
        this.betOptions[pos][`${btnNum}_VAL`] = '2';
      } else {
        this.betOptions[pos][`${btnNum}_VAL`] = '30';
      }
    } else {
      this.betOptions[pos][`${btnNum}_VAL`] = this.betOptions[pos][`${btnNum}_VAL`].replace(
        /^0+/,
        ''
      );

      if (this.betOptions[pos][`${btnNum}_VAL`] === '') {
        if (this.betOptions[pos][btnNum] === 'x') {
          this.betOptions[pos][`${btnNum}_VAL`] = '2';
        } else {
          this.betOptions[pos][`${btnNum}_VAL`] = '30';
        }
      } else if (this.betOptions[pos][btnNum] === 'x') {
        this.betOptions[pos][`${btnNum}_VAL`] = parseFloat(
          this.betOptions[pos][`${btnNum}_VAL`]
        ).toString();
        if (
          Number.isNaN(this.betOptions[pos][`${btnNum}_VAL`]) ||
          this.betOptions[pos][`${btnNum}_VAL`] === '0'
        ) {
          this.betOptions[pos][`${btnNum}_VAL`] = '2';
        }
      } else {
        this.betOptions[pos][`${btnNum}_VAL`] = parseInt(
          this.betOptions[pos][`${btnNum}_VAL`],
          10
        ).toString();
        if (
          Number.isNaN(this.betOptions[pos][`${btnNum}_VAL`]) ||
          this.betOptions[pos][`${btnNum}_VAL`] === '0'
        ) {
          this.betOptions[pos][`${btnNum}_VAL`] = '30';
        }
      }
    }
  }

  changeUserBetPref() {
    this.isDisableBtn = true;
    let obj = [];
    let keyStr = '';
    keyStr = 'NGDESK';
    obj = [
      {
        keyName: this.globalConstant.BET_SLIDER_BLIND,
        keyValue: this.betOptions.betSliderVal,
        keyStatus: 'ACTIVE'
      }
    ];
    Object.keys(this.betOptions.PREFLOP).forEach((key) => {
      if (key.indexOf('_VAL') < 0) {
        const tempObj: any = {};
        tempObj.keyName = `${keyStr}_PREFLOP_${key}`;
        tempObj.keyValue =
          this.betOptions.PREFLOP[key].keyName === 'x'
            ? `${this.betOptions.PREFLOP[key].keyName}_${
                this.betOptions.PREFLOP[`${key}_VAL`].name
              }`
            : this.betOptions.PREFLOP[key].keyName;
        tempObj.keyStatus = this.checkedPreFlop[parseInt(key.replace('BUTTON', ''), 10) - 1]
          ? 'ACTIVE'
          : 'INACTIVE';
        obj.push(tempObj);
      }
    });

    Object.keys(this.betOptions.POSTFLOP).forEach((key) => {
      if (key.indexOf('_VAL') < 0) {
        const tempObj: any = {};
        tempObj.keyName = `${keyStr}_POSTFLOP_${key}`;
        tempObj.keyValue =
          this.betOptions.POSTFLOP[key].keyName === 'x' ||
          this.betOptions.POSTFLOP[key].keyName === 'Pot%'
            ? `${this.betOptions.POSTFLOP[key].keyName}_${
                this.betOptions.POSTFLOP[`${key}_VAL`].name
              }`
            : this.betOptions.POSTFLOP[key].keyName;
        tempObj.keyStatus = this.checkedPostFlop[parseInt(key.replace('BUTTON', ''), 10) - 1]
          ? 'ACTIVE'
          : 'INACTIVE';
        obj.push(tempObj);
      }
    });

    this.userPreferencesService.setUserBet(obj, false);

    this.initialCheckPreFlops = [...this.checkedPreFlop];
    this.initialCheckPostFlops = [...this.checkedPostFlop];
  }

  setValuesToView(paramsData: any) {
    this.betOptions.betSliderVal = paramsData.betSliderVal;
    Object.keys(paramsData.PREFLOP).forEach((element) => {
      const betOptionObj: any = {
        name: '',
        keyName: ''
      };
      if (element.indexOf('_VAL') < 0) {
        betOptionObj.name =
          this.dropDownList.find((item: any) => item.keyName === paramsData.PREFLOP[element])
            ?.name ?? '';
        betOptionObj.keyName = paramsData.PREFLOP[element];
        this.betOptions.PREFLOP[element] = betOptionObj;

        this.preFlopValues[parseInt(element.replace('BUTTON', ''), 10) - 1] = betOptionObj.keyName;
      } else {
        betOptionObj.name = paramsData.PREFLOP[element];
        betOptionObj.keyName = '';
        this.betOptions.PREFLOP[element] = betOptionObj;

        this.preFlopValues[
          parseInt(element.replace('BUTTON', ''), 10) - 1
        ] = `x${betOptionObj.name}`;
      }
    });

    Object.keys(paramsData.POSTFLOP).forEach((element) => {
      const betOptionObj = {
        name: '',
        keyName: ''
      };
      if (element.indexOf('_VAL') < 0) {
        const dropDownItem = this.dropDownListPf.find(
          (item: any) => item.keyName === paramsData.POSTFLOP[element]
        );
        if (dropDownItem) {
          betOptionObj.name = dropDownItem.name;
          betOptionObj.keyName = paramsData.POSTFLOP[element];
          this.betOptions.POSTFLOP[element] = betOptionObj;

          this.postFlopValues[parseInt(element.replace('BUTTON', ''), 10) - 1] =
            betOptionObj.keyName;
        }
      } else {
        betOptionObj.name = paramsData.POSTFLOP[element];
        betOptionObj.keyName = '';
        this.betOptions.POSTFLOP[element] = betOptionObj;

        if (paramsData.POSTFLOP[element.substring(0, element.indexOf('_'))] === 'x') {
          this.postFlopValues[
            parseInt(element.replace('BUTTON', ''), 10) - 1
          ] = `x${betOptionObj.name}`;
        } else {
          this.postFlopValues[
            Object.keys(paramsData.POSTFLOP).indexOf(element.substring(0, element.indexOf('_')))
          ] = `%${betOptionObj.name}`;
        }
      }
    });
  }

  setBetOptionStatus(preFlopStatus: BetOptionStatus, postFlopStatus: BetOptionStatus) {
    let index = 0;
    Object.values(preFlopStatus).forEach((value) => {
      this.checkedPreFlop[index] = value;
      index += 1;
    });

    index = 0;

    Object.values(postFlopStatus).forEach((value) => {
      this.checkedPostFlop[index] = value;
      index += 1;
    });

    this.initialCheckPreFlops = [...this.checkedPreFlop];
    this.initialCheckPostFlops = [...this.checkedPostFlop];
  }
}
