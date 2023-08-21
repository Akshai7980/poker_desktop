import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';

import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  GlobalConstant,
  MapType,
  MessageConstant,
  SettingsThemeData,
  UserSettingsModel,
  BroadcastService,
  SfsRequestService,
  UserAccountService,
  UtilityService,
  InjectorInstance,
  SettingsService,
  DataStorage,
  PlatformDetection
} from 'projects/shared/src/public-api';

@Directive()
export class SettingsModelNew implements OnDestroy {
  autoFocusOnTurn: boolean;

  addedHotKeys: string[];

  removedHotKeys: string[];

  toastMsgTimer: NodeJS.Timeout;

  avataarArr: Array<number>;

  isOtherSoundsEnable: boolean;

  isAddBtnDisabled: boolean;

  selectedHotkeyAction: string;

  isHotkeyActionSelected: boolean;

  arrHotKeys: any = [];

  arrHotKeysForUI: any = [];

  countHotkeysToRemove: number;

  selectedHotkeysToRemove: any;

  assignedKey: string | undefined;

  showToastMsg: boolean;

  username: string;

  errorMsg: string;

  isDesktop: boolean;

  globalConstant = GlobalConstant;

  betOptions: any;

  isShowHandStrength: boolean;

  isGameSoundOn: string;

  isHideEmptyTables: boolean;

  isHideFullTables: boolean;

  isAutoMuckChecked: boolean;

  isAutoPostBBChecked: boolean;

  isShowStacksinBBForCash: boolean;

  isShowStacksinBBForMtt: boolean;

  isShow4ColorDeck: boolean;

  pageTitle: string;

  isShowMainSetting: boolean;

  isShowSelectAvatar: boolean;

  isShowBetOptions: boolean;

  isShowPreviewTblClrOptn: boolean;

  isShowPreviewBgClrOptn: boolean;

  isShowTableSection: boolean;

  isShowBuyInPref: boolean;

  isShowHotKeyView: boolean;

  isShowChangePassword: boolean;

  isShowEmailHistory: boolean;

  prefTableList: Array<Array<number>>;

  setIndexforCarousal: number;

  oldPassword: string;

  newPassword: string;

  confirmPassword: string;

  oldPasswordErrorMsg: string;

  newPasswordErrorMsg: string;

  confirmPasswordErrorMsg: string;

  isMakeFavTabDefault: boolean;

  selectedTab: number;

  themeSectionTab: number;

  tableColorThemeArray: any;

  tableColorTheme: number;

  defalutTableThemeUrl: string;

  sectionBGThemeArray: any;

  sectionColorTheme: number;

  defaultBgColorUrl: string;

  cardBackFaceArray: Array<UserSettingsModel>;

  backFaceCardThemeValue: number;

  fourColorDeckArray: Array<UserSettingsModel>;

  fourColorDeckThemeValue: string;

  isShowPlayersBalloon: boolean;

  isShowOwnBalloon: boolean;

  betSliderValue: string;

  finalTableTheme: any;

  isAutoBuyInFlag: boolean;

  autoBuyInValue: string;

  isAutoRebuyFlag: boolean;

  autoRebuyFlag: string;

  autoRebuyValue: string;

  addChipsFlag: string;

  tableImgUrl: string;

  showSendItemEmoji: boolean;

  showExpressionEmoji: boolean;

  isExe: boolean;

  gameSoundObj: any;

  isSafariBrowser: boolean;

  addChipsValue: string;

  isDisableBtn: boolean = true;

  isShowToastMsg: boolean;

  toastMsg: string;

  isEnableHotKeysInSetting: boolean;

  msgConstant: any;

  dataStorage: DataStorage;

  map: MapType;

  setDefabult: boolean = false;

  public settingsService = InjectorInstance.get(SettingsService);

  private platformDetection = PlatformDetection.getInstance();

  enableSoundSettingsBtn: boolean = false;

  constructor(
    public utilityService: UtilityService,
    public http: HttpClient,
    public windowCommService: WindowCommService,
    public cdr: ChangeDetectorRef,
    public userAccountService: UserAccountService,
    public userPreferencesService: UserPreferencesService,
    public sfsRequestService: SfsRequestService,
    public broadcastService: BroadcastService
  ) {
    this.betOptions = this.settingsService.betOptionsDefault;
    this.isOtherSoundsEnable = true;

    this.settingsService.userSettings.subscribe((resp: Array<UserSettingsModel>) => {
      if (resp && this.betOptions === this.settingsService.betOptionsDefault) {
        this.gameSoundObj = JSON.parse(
          JSON.stringify(this.userPreferencesService.getGameSoundObj(null))
        );
        if (this.gameSoundObj.MUTE_ALL === true) {
          this.isOtherSoundsEnable = false;
        } else {
          this.isOtherSoundsEnable = true;
        }

        if (this.gameSoundObj !== undefined) {
          this.gameSoundObj = {
            MUTE_ALL: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.MUTE_ALL],
            COMM_CARDS_SOUND:
              this.userPreferencesService.gameSoundPrefObj[GlobalConstant.COMM_CARDS_SOUND],
            HOLE_CARDS_SOUND:
              this.userPreferencesService.gameSoundPrefObj[GlobalConstant.HOLE_CARDS_SOUND],
            TURN_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.TURN_SOUND],
            BET_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.BET_SOUND],
            CALL_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.CALL_SOUND],
            CHECK_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.CHECK_SOUND],
            FOLD_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.FOLD_SOUND],
            TURN_HURRY_SOUND:
              this.userPreferencesService.gameSoundPrefObj[GlobalConstant.TURN_HURRY_SOUND],
            WINNING_SOUND:
              this.userPreferencesService.gameSoundPrefObj[GlobalConstant.WINNING_SOUND]
          };
        }

        this.pageTitle = 'Bet Options';
        this.isShowMainSetting = false;
        this.isShowBetOptions = true;
        this.betOptions = this.userPreferencesService.deepClone(
          this.userPreferencesService.getBetOptionsObj()
        );
        this.betOptions.betSliderVal = this.betOptions.betSliderVal.toString();
      }
    });
  }

  OnInit() {
    this.map = {
      16: false // shift
    };

    this.showChat();
    this.showAnimation();
    this.showThemes();
    this.msgConstant = MessageConstant;
    this.dataStorage = DataStorage.getInstance();
    this.tableImgUrl = this.dataStorage?.dynamicImagData?.imagePath;
    this.isDesktop = this.platformDetection.isDesktop;
    this.betOptions = {};
    this.avataarArr = this.globalConstant.avataarArr;
    this.isShowHandStrength = this.userPreferencesService.getShowHandStrength();
    this.isGameSoundOn = (!JSON.parse(
      this.userPreferencesService.getGameSoundObj('MUTE_ALL')
    )).toString();
    this.isHideEmptyTables = this.userPreferencesService.getHideEmptyTablesPref();
    this.isHideFullTables = this.userPreferencesService.getHideFullTablesPref();
    this.isAutoMuckChecked = this.userPreferencesService.getAutoMuck();

    this.isAutoPostBBChecked = this.userPreferencesService.getAutoPostBB();
    this.isShowStacksinBBForCash = this.userPreferencesService.getShowStacksInBBForCash();
    this.isShowStacksinBBForMtt = this.userPreferencesService.getShowStacksInBBForMtt();
    this.isShow4ColorDeck = this.userPreferencesService.get4ColorDeck();
    this.autoFocusOnTurn = Boolean(this.userPreferencesService.getAutoFocusOnTurn().keyValue);
    this.pageTitle = 'Settings';
    this.isShowMainSetting = true;
    this.isShowSelectAvatar = false;
    this.isShowBetOptions = false;
    this.isShowPreviewTblClrOptn = false;
    this.isShowPreviewBgClrOptn = false;
    this.isShowTableSection = false;
    this.isShowBuyInPref = false;
    this.isShowHotKeyView = false;
    this.isShowChangePassword = false;
    this.isShowEmailHistory = false;
    this.prefTableList = this.globalConstant.PREF_TABLE_ARR;
    this.setIndexforCarousal = 0;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.oldPasswordErrorMsg = '';
    this.newPasswordErrorMsg = '';
    this.confirmPasswordErrorMsg = '';
    this.isMakeFavTabDefault = this.userPreferencesService.getFavTabAsDefault();
    this.themeSectionTab = 0;
    this.tableColorTheme = 0;
    this.sectionBGThemeArray = this.dataStorage.dynamicImagData?.bgImgs;
    this.sectionColorTheme = 0;
    this.cardBackFaceArray = this.userPreferencesService.arrCardBackFace;
    this.backFaceCardThemeValue = 0;
    this.fourColorDeckArray = this.userPreferencesService.arrFourColorDeck;
    this.fourColorDeckThemeValue = '0';
    this.isShowPlayersBalloon = Boolean(this.userPreferencesService.playersChatBalloons.keyValue);
    this.isShowOwnBalloon = Boolean(this.userPreferencesService.ownChatBalloons.keyValue);
    this.betSliderValue = '1';
    this.finalTableTheme = this.userPreferencesService.getFinalTableTheme();
    this.isAutoBuyInFlag = Boolean(this.userPreferencesService.arrAutoBuyIn.keyValue);
    this.autoBuyInValue = this.userPreferencesService.arrAutoBuyInBb.keyValue;
    this.isAutoRebuyFlag = this.userPreferencesService.getBuyInPref().NG_AUTO_REBUY_FLAG;

    this.autoRebuyFlag = this.userPreferencesService.setValueToSettingsModel().autoRebuyFlag;
    this.autoRebuyValue = this.userPreferencesService.setValueToSettingsModel().autoRebuyValue;
    this.addChipsFlag = this.userPreferencesService.setValueToSettingsModel().addChipsFlag;
    this.addChipsValue = this.userPreferencesService.setValueToSettingsModel().NG_ADD_CHIPS_VALUE;
    this.showSendItemEmoji = Boolean(this.userPreferencesService.showSendItemAnimation.keyValue);
    this.showExpressionEmoji = Boolean(this.userPreferencesService.showEmojiAnimation.keyValue);
    this.isExe = this.platformDetection.isExe;
    this.gameSoundObj = {
      MUTE_ALL: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.MUTE_ALL],
      COMM_CARDS_SOUND:
        this.userPreferencesService.gameSoundPrefObj[GlobalConstant.COMM_CARDS_SOUND],
      HOLE_CARDS_SOUND:
        this.userPreferencesService.gameSoundPrefObj[GlobalConstant.HOLE_CARDS_SOUND],
      TURN_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.TURN_SOUND],
      BET_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.BET_SOUND],
      CALL_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.CALL_SOUND],
      CHECK_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.CHECK_SOUND],
      FOLD_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.FOLD_SOUND],
      TURN_HURRY_SOUND:
        this.userPreferencesService.gameSoundPrefObj[GlobalConstant.TURN_HURRY_SOUND],
      WINNING_SOUND: this.userPreferencesService.gameSoundPrefObj[GlobalConstant.WINNING_SOUND]
    };
    if (this.isDesktop) {
      this.betOptions = {
        PREFLOP: {
          BUTTON1: 'x',
          BUTTON1_VAL: '2',
          BUTTON2: 'x',
          BUTTON2_VAL: '3',
          BUTTON3: 'x',
          BUTTON3_VAL: '5',
          BUTTON4: '1/2',
          BUTTON5: '3/4',
          BUTTON6: 'Pot',
          BUTTON7: 'Max'
        },
        POSTFLOP: {
          BUTTON1: 'x',
          BUTTON1_VAL: '2',
          BUTTON2: 'x',
          BUTTON2_VAL: '3',
          BUTTON3: 'x',
          BUTTON3_VAL: '5',
          BUTTON4: '1/2',
          BUTTON5: '3/4',
          BUTTON6: 'Pot',
          BUTTON7: 'Max'
        }
      };
      if (this.platformDetection.currentBrowser === this.globalConstant.BROWSER_TYPE.SAFARI) {
        this.isSafariBrowser = true;
      }
    }

    if (this.platformDetection.currentBrowser === this.globalConstant.BROWSER_TYPE.SAFARI) {
      this.isSafariBrowser = true;
    }
    this.isDisableBtn = true;
    this.isShowToastMsg = false;
    this.toastMsg = '';
    this.resetHotKeysFromUserPref();
    this.userPreferencesService.setValueToSettingsModel();

    // if setting window opened from Buy-In preferences
    // of Buy-In popup then auto select Buy-In Preferences Tab
    if (this.dataStorage.IS_BUY_IN_PREFERENCE_CLICKED) {
      this.selectedTab = 2;
      this.setSettingTab(2);
      this.dataStorage.IS_BUY_IN_PREFERENCE_CLICKED = false;
    } else {
      this.selectedTab = 1;
    }

    // if setting window focus from Buy-In preferences of Buy-In popup
    this.broadcastService.$on('showBuyInPrefAfterFocus', (data: any) => {
      if (data.isFromBuyIn) {
        this.selectedTab = 2;
        this.setSettingTab(2);
      }
    });

    if (this.gameSoundObj.MUTE_ALL === true) {
      this.isOtherSoundsEnable = false;
    } else {
      this.isOtherSoundsEnable = true;
    }
  }

  OnAfterViewInit() {
    if (window.opener?.parent) {
      //
    } else {
      document.body.innerHTML = '';
    }
  }

  getScaleAmt() {
    return {
      width: `${this.globalConstant.GAME_AREA_INCREASED_PERCENT}%`,
      height: `${this.globalConstant.GAME_AREA_INCREASED_PERCENT}%`,
      '-webkit-transform': `scale(${this.globalConstant.GAME_AREA_SCALE_AMT})`,
      transform: `scale(${this.globalConstant.GAME_AREA_SCALE_AMT})`
    };
  }

  showSettingMainPage() {
    this.pageTitle = 'Settings';
    this.isShowMainSetting = true;
    this.isShowSelectAvatar = false;
    this.isShowBetOptions = false;
    this.isShowHotKeyView = false;
    this.isShowChangePassword = false;
    this.isShowEmailHistory = false;
    this.themeSectionTab = 0;
  }

  showBetOptions() {
    this.pageTitle = 'Bet Options';
    this.isShowMainSetting = false;
    this.isShowBetOptions = true;
    this.betOptions = this.userPreferencesService.deepClone(
      this.userPreferencesService.getBetOptionsObj()
    );
    this.betOptions.betSliderVal = this.betOptions.betSliderVal.toString();
  }

  showThemes() {
    this.pageTitle = 'Themes';
    this.isShowMainSetting = false;

    const userTheme = this.userPreferencesService.getUserTheme();
    this.tableColorTheme = userTheme.NG_TABLE_COLOR_VALUE;
    this.sectionColorTheme = userTheme.NG_BACKGROUND_COLOR_VALUE;
    this.setCurrentSelTableTheme();
    this.setCurrentSelTableBgTheme();
    this.backFaceCardThemeValue = userTheme.NG_CARD_BACKGROUND_VALUE;
    this.fourColorDeckThemeValue = userTheme.FOUR_COLOR_DECK_VALUE.toString();
    this.finalTableTheme = userTheme.SHOW_FINAL_TABLE_THEME;
  }

  // show user chat preferences view
  showChat() {
    this.pageTitle = 'Chat';
    this.isShowMainSetting = false;
    const playerBalloons = this.userPreferencesService.getPlayersChatBalloons();
    const ownBalloons = this.userPreferencesService.getOwnChatBalloons();
    this.isShowPlayersBalloon = playerBalloons.keyValue;
    this.isShowOwnBalloon = ownBalloons.keyValue;
  }

  showTableSection(event: any, id: number) {
    this.themeSectionTab = id;

    this.isShowToastMsg = false;
  }

  // To show preview table color options
  showPreviewTblClrOptn(event: Event | InputEvent | KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (this.isShowPreviewTblClrOptn === false) {
      this.isShowPreviewTblClrOptn = true;
      // To show preview table color options
      this.isShowPreviewBgClrOptn = false;
    } else if (event && target.closest('[data-close-dropdown]') !== null) {
      // To close table dropdown in Settings -> Themes
      this.isShowPreviewTblClrOptn = false;
    }
  }

  showAnimation() {
    this.pageTitle = 'Animation';
    this.isShowMainSetting = false;
    const sendItemAnimation = this.userPreferencesService.getAnimationEnabled();
    const expressionsAnimation = this.userPreferencesService.getEmojiAnimationEnabled();
    this.showSendItemEmoji = sendItemAnimation.keyValue;
    this.showExpressionEmoji = expressionsAnimation.keyValue;
  }

  closeShowPreviewTblClrOptn() {
    this.isShowPreviewTblClrOptn = false;
  }

  closeShowPreviewBgClrOptn() {
    this.isShowPreviewBgClrOptn = false;
  }

  // To change preview background color
  changePreviewBgColor(index: number) {
    this.sectionColorTheme = index;
    this.setCurrentSelTableBgTheme();
  }

  // To change preview table color
  changePreviewTableColor(index: number) {
    this.tableColorTheme = index;
    this.setCurrentSelTableTheme();
  }

  setBackFaceCard(index: number) {
    this.backFaceCardThemeValue = index;
  }

  setFrontFaceCard(index: number) {
    this.fourColorDeckThemeValue = index.toString();
  }

  showHotkeys() {
    this.resetHotKeysFromUserPref();
    this.pageTitle = 'Hotkeys';
    this.isShowMainSetting = false;
    this.isShowHotKeyView = true;
  }

  changeTheme() {
    this.toastMsg = '';
    this.isDisableBtn = true;
    const obj = [
      {
        keyName: this.globalConstant.TABLE_COLOR_THEME_NAME,
        keyValue: this.tableColorTheme.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.SECTION_BG_THEME_NAME,
        keyValue: this.sectionColorTheme.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.CARD_BACK_FACE_NAME,
        keyValue: this.backFaceCardThemeValue.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.FOUR_COLOR_DECK_THEME,
        keyValue: this.fourColorDeckThemeValue.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.FINAL_TABLE_THEME,
        keyValue: this.finalTableTheme.toString(),
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setUserTheme(obj, false);
    this.toastMsgFunc();
  }

  // change user chat preferences
  changeUserChatPref() {
    this.toastMsg = '';
    this.isDisableBtn = true;
    const obj = [
      {
        keyName: this.globalConstant.PLAYER_CHAT_BALLOONS,
        keyValue: this.isShowPlayersBalloon.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.OWN_CHAT_BALLOONS,
        keyValue: this.isShowOwnBalloon.toString(),
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setUserChat(obj, false);
    this.toastMsgFunc();
  }

  onChangesshowOwnChat() {
    const obj = [
      {
        keyName: this.globalConstant.OWN_CHAT_BALLOONS,
        keyValue: this.isShowOwnBalloon.toString(),
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setUserChat(obj, false);
    this.toastMsgFunc();
  }

  onChangeshowPlayerChat(ev: any) {
    const obj = [
      {
        keyName: this.globalConstant.PLAYER_CHAT_BALLOONS,
        keyValue: this.isShowPlayersBalloon.toString(),
        keyStatus: 'ACTIVE',
        update: ev.checked.toString()
      }
    ];
    this.userPreferencesService.setUserChat(obj, false);
  }

  changeAnimationEmoji() {
    this.toastMsg = '';
    this.isDisableBtn = true;
    const obj = [
      {
        keyName: this.globalConstant.SHOW_SEND_ITEM_ANIMATION,
        keyValue: this.showSendItemEmoji.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.SHOW_EMOJI_ANIMATION,
        keyValue: this.showExpressionEmoji.toString(),
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setAnimationSettings(obj, false);
    this.toastMsgFunc();
  }

  // change game sound preferences
  changeGameSoundPref(e: any, soundOf: string) {
    this.toastMsg = '';
    this.enableSoundSettingsBtn = false;

    if (!this.platformDetection.isDesktop) {
      this.updateGameSound(soundOf, e);

      const obj = this.generateObjArray();

      this.userPreferencesService.setGameSound(obj, false);
      this.toastMsgFunc();
      this.cdr.detectChanges();
    }
  }

  updateGameSound(soundOf: string, e: any) {
    switch (soundOf.toLowerCase()) {
      case 'muteall':
        if (this.gameSoundObj[this.globalConstant.MUTE_ALL]) {
          this.isOtherSoundsEnable = false;
        } else {
          this.isOtherSoundsEnable = true;
        }
        this.gameSoundObj[this.globalConstant.MUTE_ALL] = e.MUTE_ALL;
        break;
      case 'commcard':
        this.gameSoundObj[this.globalConstant.COMM_CARDS_SOUND] = e.COMM_CARDS_SOUND;
        break;
      case 'betraise':
        this.gameSoundObj[this.globalConstant.BET_SOUND] = e.BET_SOUND;
        break;
      case 'call':
        this.gameSoundObj[this.globalConstant.CALL_SOUND] = e.CALL_SOUND;
        break;
      case 'check':
        this.gameSoundObj[this.globalConstant.CHECK_SOUND] = e.CHECK_SOUND;
        break;
      case 'fold':
      case 'userturn':
        this.gameSoundObj[this.globalConstant.FOLD_SOUND] = e.FOLD_SOUND;
        break;
      case 'criticaltimer':
        this.gameSoundObj[this.globalConstant.TURN_HURRY_SOUND] = e.TURN_HURRY_SOUND;
        break;
      case 'pottowinner':
        this.gameSoundObj[this.globalConstant.WINNING_SOUND] = e.WINNING_SOUND;
        break;
      default:
        break;
    }
  }

  generateObjArray() {
    return [
      {
        keyName: this.globalConstant?.MUTE_ALL,
        keyValue: this.gameSoundObj[this.globalConstant.MUTE_ALL]
          ? this.gameSoundObj[this.globalConstant.MUTE_ALL].toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.COMM_CARDS_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.COMM_CARDS_SOUND]
          ? this.gameSoundObj[this.globalConstant.COMM_CARDS_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.HOLE_CARDS_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.HOLE_CARDS_SOUND]
          ? this.gameSoundObj[this.globalConstant.HOLE_CARDS_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.TURN_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.TURN_SOUND]
          ? this.gameSoundObj[this.globalConstant.TURN_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.BET_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.BET_SOUND]
          ? this.gameSoundObj[this.globalConstant.BET_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.CALL_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.CALL_SOUND]
          ? this.gameSoundObj[this.globalConstant.CALL_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.CHECK_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.CHECK_SOUND]
          ? this.gameSoundObj[this.globalConstant.CHECK_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.FOLD_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.FOLD_SOUND]
          ? this.gameSoundObj[this.globalConstant.FOLD_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.TURN_HURRY_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.TURN_HURRY_SOUND]
          ? this.gameSoundObj[this.globalConstant.TURN_HURRY_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant?.WINNING_SOUND,
        keyValue: this.gameSoundObj[this.globalConstant.WINNING_SOUND]
          ? this.gameSoundObj[this.globalConstant.WINNING_SOUND]?.toString()
          : 'false',
        keyStatus: 'ACTIVE'
      }
    ];
  }

  // change user chat preferences
  changeFocusOnUserTurn() {
    const obj = [
      {
        keyName: this.globalConstant.AUTO_FOCUS_USER_TURN,
        keyValue: this.autoFocusOnTurn.toString(),
        keyStatus: 'ACTIVE',
        update: this.autoFocusOnTurn.toString()
      }
    ];
    this.userPreferencesService.setAutoFocusOnTurn(obj);
  }

  showBuyInPref() {
    this.pageTitle = 'Buy-In Preferences';
    this.isShowMainSetting = false;
    this.isShowBuyInPref = true;

    const buyInPref = this.userPreferencesService.getBuyInPref();
    this.isAutoBuyInFlag = buyInPref.NG_AUTO_BUYIN_FLAG;
    this.autoBuyInValue = buyInPref.NG_AUTO_BUYIN_VALUE;
    this.isAutoRebuyFlag = buyInPref.NG_AUTO_REBUY_FLAG;
    if (buyInPref.NG_AUTO_REBUY_VALUE.indexOf('BB-') !== -1) {
      this.autoRebuyFlag = '1';
      this.autoRebuyValue = buyInPref.NG_AUTO_REBUY_VALUE.substring(3);
    } else {
      this.autoRebuyFlag = buyInPref.NG_AUTO_REBUY_VALUE;
      this.autoRebuyValue = '';
    }
    if (buyInPref.NG_ADD_CHIPS_VALUE.indexOf('4BB-') !== -1) {
      this.addChipsFlag = '3';
      this.addChipsValue = buyInPref.NG_ADD_CHIPS_VALUE.substring(4);
    } else {
      this.addChipsFlag = buyInPref.NG_ADD_CHIPS_VALUE;
      this.addChipsValue = '';
    }
  }

  changeBuyInPreferences() {
    this.isDisableBtn = true;
    const obj = [
      {
        keyName: this.globalConstant.AUTO_BUY_IN_SETTINGS,
        keyValue: this.isAutoBuyInFlag === true ? '1' : '0',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.AUTO_BUY_IN_BB_SETTINGS,
        keyValue: this.autoBuyInValue.toString(),
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.AUTO_REBUY_IN_FORM,
        keyValue: this.isAutoRebuyFlag === true ? '1' : '0',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.AUTO_REBUY_SETTINGS,
        keyValue: this.autoRebuyFlag === '1' ? `BB-${this.autoRebuyValue}` : this.autoRebuyFlag,
        keyStatus: 'ACTIVE'
      },
      {
        keyName: this.globalConstant.ADD_CHIPS_SETTINGS,
        keyValue: this.addChipsFlag === '3' ? `4BB-${this.addChipsValue}` : this.addChipsFlag,
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setBuyInPreferences(obj, false);

    this.toastMsgFunc();
    localStorage.setItem(
      'buyinPre',
      JSON.stringify({
        userId: this.userAccountService.getMyUserId(),
        addChipsValue: this.addChipsValue,
        autoRebuyValue: this.autoRebuyValue
      })
    );
  }

  defaultAutoBuyInValue() {
    if (this.isAutoBuyInFlag) {
      if (this.autoBuyInValue === '' || parseInt(this.autoBuyInValue, 10) <= 0) {
        this.autoBuyInValue = '1';
      }
    }
  }

  defaultAutoRebuyValue() {
    if (this.autoRebuyFlag) {
      if (this.autoRebuyValue === '' || parseInt(this.autoRebuyValue, 10) <= 0) {
        this.autoRebuyValue = '1';
      }
    }
  }

  defaultAddChipsValue() {
    if (!(!this.autoBuyInValue || this.addChipsFlag !== '3')) {
      if (this.addChipsValue === '' || parseInt(this.addChipsValue, 10) <= 0) {
        this.addChipsValue = '1';
      }
    }
  }

  autoReBuyInInput() {
    this.onSettingsChange('fromBuyinpref', null);
  }

  autoBuyInInput() {
    if (!this.isAutoBuyInFlag) {
      //
    } else if (this.autoBuyInValue === '') {
      this.autoBuyInValue = '1';
    }
    this.onSettingsChange('fromBuyinpref', null);
  }

  defaultRebuyInput() {
    if (this.autoRebuyFlag === '1') {
      if (this.autoRebuyValue === '') {
        this.autoRebuyValue = '1';
      }
    }
    this.onSettingsChange('fromBuyinpref', null);
  }

  clearRebuyInput() {
    this.onSettingsChange('fromBuyinpref', null);
  }

  defaultAddChipsInput() {
    if (this.addChipsFlag === '3') {
      if (this.addChipsValue === '') {
        this.addChipsValue = '1';
      }
    }
    this.onSettingsChange('fromBuyinpref', null);
  }

  clearAddChipsInput() {
    this.onSettingsChange('fromBuyinpref', null);
  }

  // change user bet preference
  changeUserBetPref() {
    this.toastMsg = '';
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
        const tempObj: UserSettingsModel = {
          keyName: '',
          keyStatus: '',
          keyValue: ''
        };
        tempObj.keyName = `${keyStr}_PREFLOP_${key}`;
        tempObj.keyValue =
          this.betOptions.PREFLOP[key].name === 'x' || this.betOptions.PREFLOP[key].name > -1
            ? `${this.betOptions.PREFLOP[key].name}_${this.betOptions.PREFLOP[key].name}_VAL`
            : this.betOptions.PREFLOP[key].name;
        tempObj.keyStatus = 'ACTIVE';
        obj.push(tempObj);
      }
    });

    Object.keys(this.betOptions.POSTFLOP).forEach((key) => {
      if (key.indexOf('_VAL') < 0) {
        const tempObj: UserSettingsModel = {
          keyName: '',
          keyStatus: '',
          keyValue: ''
        };
        tempObj.keyName = `${keyStr}_POSTFLOP_${key}`;
        tempObj.keyValue =
          this.betOptions.POSTFLOP[key].name === 'x' || this.betOptions.POSTFLOP[key].name > -1
            ? `${this.betOptions.POSTFLOP[key].name}_${this.betOptions.POSTFLOP[key].name}_VAL`
            : this.betOptions.POSTFLOP[key].name;
        tempObj.keyStatus = 'ACTIVE';
        obj.push(tempObj);
      }
    });

    this.userPreferencesService.setUserBet(obj, false);
    this.toastMsgFunc();
  }

  showChangePassword() {
    this.pageTitle = 'Change Password';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.oldPasswordErrorMsg = '';
    this.newPasswordErrorMsg = '';
    this.confirmPasswordErrorMsg = '';
    this.isShowMainSetting = false;
    this.isShowChangePassword = true;
  }

  showEmailHistory() {
    this.pageTitle = 'Email Hand History';
    this.isShowMainSetting = false;
    this.isShowEmailHistory = true;
  }

  setShowHandStrength(e: any) {
    if (!this.platformDetection.isDesktop) {
      this.isShowHandStrength = e.checked;
    }
    this.userPreferencesService.setShowHandStrength(this.isShowHandStrength);
  }

  onOffGameSound() {
    this.toastMsg = '';
    this.isDisableBtn = true;
    const obj = [
      {
        keyName: this.globalConstant.MUTE_ALL,
        keyValue: (!JSON.parse(this.isGameSoundOn)).toString(),
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setGameSound(obj, false);
    this.toastMsgFunc();
  }

  setAutoPostBB(e: any) {
    if (!this.platformDetection.isDesktop) {
      this.isAutoPostBBChecked = e.checked;
    }
    this.userPreferencesService.setAutoPostBB(this.isAutoPostBBChecked);
  }

  setShowStatsBBForCash() {
    const obj = [
      {
        keyName: this.globalConstant.SHOW_STATS_BB_CASH,
        update: true,
        keyValue: this.isShowStacksinBBForCash.toString(),
        keyStatus: 'ACTIVE'
      }
    ];

    this.userPreferencesService.setShowStacksInBBForCash(obj, this.isShowStacksinBBForCash);
  }

  setShowStatsBBForMtt() {
    const obj = [
      {
        keyName: this.globalConstant.SHOW_STATS_BB_MTT,
        update: true,
        keyValue: this.isShowStacksinBBForMtt.toString(),
        keyStatus: 'ACTIVE'
      }
    ];
    this.userPreferencesService.setShowStacksInBBForMTT(obj, this.isShowStacksinBBForMtt);
  }

  setAutoMuck(e: any) {
    if (!this.platformDetection.isDesktop) {
      this.isAutoMuckChecked = e.checked;
    }

    this.userPreferencesService.setAutoMuck(this.isAutoMuckChecked);
  }

  showHide4ColorDeck(e: any) {
    this.isShow4ColorDeck = e.isChecked;
    this.userPreferencesService.set4ColorDeck(this.isShow4ColorDeck);
  }

  changePaswordResp() {
    this.toastMsgFunc();
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.cdr.detectChanges();
  }

  validatePwd(event?: any) {
    const clickOrEnter = !!(
      (event.key && event.key.toLowerCase() === 'enter') ||
      (event.type && event.type.toLowerCase() === 'click') ||
      event === 'fromtokenexpire'
    );
    if (clickOrEnter) {
      if (event.type) {
        event.stopPropagation();
      }
    }
    this.toastMsg = '';
    this.isDisableBtn = true;
    this.oldPasswordErrorMsg = '';
    this.newPasswordErrorMsg = '';
    this.confirmPasswordErrorMsg = '';
    if (this.oldPassword && this.newPassword && this.confirmPassword) {
      if (this.newPassword === this.oldPassword) {
        this.newPasswordErrorMsg = this.msgConstant.pwdSameAsOldPwdMsg;
      } else if (this.newPassword.length >= 8 && this.newPassword.length <= 20) {
        if (/\W+$/.test(this.newPassword)) {
          this.newPasswordErrorMsg = this.msgConstant.invalidPwdMsg;
        } else if (this.newPassword === this.username) {
          this.newPasswordErrorMsg = this.msgConstant.pwdSameAsUsernameMsg;
        } else {
          this.confirmPasswordErrorMsg = this.msgConstant.pwdNotMatchingWithConfirmPwdMsg;
        }
      } else {
        this.newPasswordErrorMsg = this.msgConstant.invalidPwdLengthMsg;
      }
    } else {
      this.oldPasswordErrorMsg = !this.oldPassword ? this.msgConstant.validPwdMsg : '';
      this.newPasswordErrorMsg = !this.newPassword ? this.msgConstant.validPwdMsg : '';
      this.confirmPasswordErrorMsg = this.confirmPassword ? this.msgConstant.validPwdMsg : '';
    }
    if (event) {
      event.target.blur();
    }
  }

  deepClone(object: any): any {
    const cloneObj = object.constructor();
    const attributes = Object.keys(object);
    attributes.forEach((attribute: string) => {
      const property = object[attribute];
      cloneObj[attribute] = typeof property === 'object' ? this.deepClone(property) : property;
    });
    return cloneObj;
  }

  onSettingsChange(changeSetting: string, data?: any, pos?: any, btnNum?: string, id?: string) {
    this.isDisableBtn = false;

    switch (changeSetting) {
      case 'fromChat':
        this.changeUserChatPref();
        break;
      case 'fromTheme': {
        const userTheme = this.userPreferencesService.getUserTheme();
        this.isDisableBtn = false;
        if (
          this.tableColorTheme === userTheme.NG_TABLE_COLOR_VALUE &&
          this.sectionColorTheme === userTheme.NG_BACKGROUND_COLOR_VALUE &&
          this.backFaceCardThemeValue === userTheme.NG_CARD_BACKGROUND_VALUE &&
          this.fourColorDeckThemeValue === userTheme.FOUR_COLOR_DECK_VALUE.toString() &&
          this.finalTableTheme === userTheme.SHOW_FINAL_TABLE_THEME
        ) {
          this.isDisableBtn = true;
        }
        break;
      }

      case 'fromSound': {
        const savedSoundPref = this.userPreferencesService.getGameSoundObj(null);
        let stateChanged = false;
        this.enableSoundSettingsBtn = false;
        if (data?.soundClicked && data?.soundClicked === 'MUTE_ALL') {
          if (this.gameSoundObj.MUTE_ALL) {
            this.isOtherSoundsEnable = false;
          } else {
            this.isOtherSoundsEnable = true;
          }
        }
        stateChanged = false;
        this.enableSoundSettingsBtn = false;
        Object.keys(this.gameSoundObj).forEach((key) => {
          if (this.gameSoundObj[key] !== savedSoundPref[key]) {
            stateChanged = true;
          }
        });
        if (stateChanged) {
          this.enableSoundSettingsBtn = true;
        }
        break;
      }
      case 'fromBetOptions': {
        const savedBetOptionsOnServer = this.userPreferencesService.deepClone(
          this.userPreferencesService.getBetOptionsObj()
        );
        let stateChanged1 = false;

        if (
          this.betOptions.betSliderVal.toString() !==
          savedBetOptionsOnServer.betSliderVal.toString()
        ) {
          stateChanged1 = true;
        }
        Object.keys(this.betOptions.PREFLOP).forEach((key) => {
          if (this.betOptions.PREFLOP[key] !== savedBetOptionsOnServer.PREFLOP[key]) {
            stateChanged1 = true;
          }
        });
        Object.keys(this.betOptions.POSTFLOP).forEach((key) => {
          if (this.betOptions.POSTFLOP[key] !== savedBetOptionsOnServer.POSTFLOP[key]) {
            stateChanged1 = true;
          }
        });

        if (pos) {
          const elem: any = document.querySelector(`#${id}`);
          const str = `${elem.value}`;
          this.setDefabult = false;
          const timeOutId = setTimeout(() => {
            if (this.betOptions[pos][`${btnNum}_VAL`].toLowerCase() === 'custom') {
              if (this.setDefabult) {
                this.betOptions[pos][`${btnNum}_VAL`] = '1';
              } else {
                this.betOptions[pos][`${btnNum}_VAL`] = str;
              }
              this.utilityService.setFocusOnElement(`#${id}`);
            }
            this.cdr.detectChanges();
            clearTimeout(timeOutId);
          }, 20);
        }
        if (data && this.betOptions[data.type][data.name] === 'x') {
          this.betOptions[data.type][`${data.name}_VAL`] = 2;
        }
        if (data && this.betOptions[data.type][data.name] === 'Pot%') {
          this.betOptions[data.type][`${data.name}_VAL`] = 30;
        }
        if (!stateChanged1) {
          this.isDisableBtn = true;
        }
        break;
      }
      case 'fromPassword':
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.isDisableBtn = true;
        }
        break;
      case 'fromBuyinpref': {
        const buyInPrefObj = this.userPreferencesService.getBuyInPref();
        const autoBuyInValue = this.autoBuyInValue.toString();
        const autoRebuyValue =
          this.autoRebuyFlag === '1' ? `BB-${this.autoRebuyValue}` : this.autoRebuyFlag;
        const autoAddonValue =
          this.addChipsFlag === '3' ? `4BB-${this.addChipsValue}` : this.addChipsFlag;
        if (
          this.isAutoBuyInFlag === buyInPrefObj.NG_AUTO_BUYIN_FLAG &&
          autoBuyInValue === buyInPrefObj.NG_AUTO_BUYIN_VALUE &&
          this.isAutoRebuyFlag === buyInPrefObj.NG_AUTO_REBUY_FLAG &&
          autoRebuyValue === buyInPrefObj.NG_AUTO_REBUY_VALUE &&
          autoAddonValue === buyInPrefObj.NG_ADD_CHIPS_VALUE
        ) {
          this.isDisableBtn = true;
        }
        break;
      }
      case 'fromHotKeys': {
        const hotKeysObj = this.userPreferencesService.getHotKeysSettings();
        if (!data.enableClick) {
          if (this.addedHotKeys.length === this.removedHotKeys.length) {
            this.addedHotKeys.forEach((hotKey) => {
              if (this.removedHotKeys.includes(hotKey)) {
                this.removedHotKeys.splice(this.removedHotKeys.indexOf(hotKey), 1);
              }
            });
            if (this.removedHotKeys.length > 0) {
              this.isDisableBtn = false;
            } else {
              this.isDisableBtn = true;
            }
          } else {
            this.isDisableBtn = false;
          }
        } else if (this.isEnableHotKeysInSetting !== hotKeysObj.isEnableHotKeys) {
          this.isDisableBtn = false;
        } else if (this.isEnableHotKeysInSetting === hotKeysObj.isEnableHotKeys) {
          if (this.isEnableHotKeysInSetting) {
            if (this.addedHotKeys.length > 0 || this.removedHotKeys.length > 0) {
              this.isDisableBtn = false;
            } else {
              this.isDisableBtn = true;
            }
          } else {
            this.isDisableBtn = true;
          }
        }
        break;
      }
      case 'fromAnimation':
        this.changeAnimationEmoji();
        break;
      default:
        break;
    }
    this.cdr.detectChanges();
  }

  // DESKTOP GLOBAL SETTING START
  setSettingTab(id: number) {
    this.isDisableBtn = true;
    this.isShowToastMsg = false;
    this.addedHotKeys = [];
    this.removedHotKeys = [];
    this.selectedTab = id;
    if (this.selectedTab === 3) {
      this.showChat();
    } else if (this.selectedTab === 4) {
      this.showThemes();
    } else if (this.selectedTab === 6) {
      this.isOtherSoundsEnable = true;
      this.gameSoundObj = JSON.parse(
        JSON.stringify(this.userPreferencesService.getGameSoundObj(null))
      );
      if (this.gameSoundObj.MUTE_ALL === true) {
        this.isOtherSoundsEnable = false;
      } else {
        this.isOtherSoundsEnable = true;
      }
    } else if (this.selectedTab === 7) {
      this.showHotkeys();
    } else if (this.selectedTab === 8) {
      //
    } else if (this.selectedTab === 10) {
      this.showAnimation();
    } else if (this.selectedTab === 2) {
      this.showBuyInPref();
    } else if (this.selectedTab === 11) {
      this.showBetOptions();
    }
    if (this.isDesktop) {
      this.showSettingMainPage();
      this.cdr.detectChanges();
    }
  }

  /* HOT KEYS */

  addHotKey() {
    let isKeyAlreadyAssigned = false;
    let alreadyAssignedAction = '';
    Object.keys(this.arrHotKeys).forEach((i) => {
      const actionSet = this.arrHotKeys[i];
      if (actionSet.assignedKey === this.assignedKey) {
        isKeyAlreadyAssigned = true;
        alreadyAssignedAction = actionSet.value;
      }
    });
    if (!isKeyAlreadyAssigned || alreadyAssignedAction === this.selectedHotkeyAction) {
      this.arrHotKeys[this.selectedHotkeyAction].assignedKey = this.assignedKey;
      this.arrHotKeysForUI.forEach((hotKey: any) => {
        const element = hotKey;
        if (element.value === this.selectedHotkeyAction) {
          element.assignedKey = this.assignedKey;
        }
      });
      this.addedHotKeys.push(this.selectedHotkeyAction);
      this.onSettingsChange('fromHotKeys', { enableClick: false });
    } else {
      //
    }
    this.enableDisableAddBtn();
  }

  checkActionToRemove() {
    this.countHotkeysToRemove = 0;
    Object.keys(this.arrHotKeys).forEach((i) => {
      if (this.selectedHotkeysToRemove[i]) {
        this.countHotkeysToRemove += 1;
      }
    });
  }

  removeHotkeys() {
    Object.keys(this.arrHotKeys).forEach((i) => {
      if (this.selectedHotkeysToRemove[i]) {
        this.arrHotKeys[i].assignedKey = '';
        this.removedHotKeys.push(i);
      }
      this.selectedHotkeysToRemove[i] = false;
    });

    this.countHotkeysToRemove = 0;
    this.onSettingsChange('fromHotKeys', { enableClick: false });
    this.enableDisableAddBtn();
  }

  resetHotKeysFromUserPref() {
    const obj = this.userPreferencesService.getHotKeysSettings();
    this.isEnableHotKeysInSetting = obj.isEnableHotKeys;
    this.selectedHotkeyAction = '';
    this.isHotkeyActionSelected = false;
    this.arrHotKeys = {};
    this.arrHotKeysForUI = [
      {
        name: ' < Choose an option >',
        value: 'Default',
        assignedKey: ''
      }
    ];
    this.countHotkeysToRemove = 0;
    this.selectedHotkeysToRemove = [];
    this.assignedKey = '';
    this.enableDisableAddBtn();
    Object.keys(obj.arrHotKeys).forEach((i) => {
      const { keyName, name, keyValue } = obj.arrHotKeys[i];
      this.arrHotKeys[keyName] = {
        name,
        value: keyName,
        assignedKey: keyValue
      };
      this.arrHotKeysForUI.push(this.arrHotKeys[keyName]);
      this.selectedHotkeysToRemove[i] = false;
    });
  }

  setSettingsToUserPreferences() {
    this.toastMsg = '';
    this.isDisableBtn = true;
    this.addedHotKeys = [];
    this.removedHotKeys = [];
    const obj = {
      isEnableHotKeys: this.isEnableHotKeysInSetting,
      arrHotKeys: this.arrHotKeys
    };
    this.userPreferencesService.setHotKeysSettings(obj, false);
    this.toastMsgFunc();
  }

  enableDisableAddBtn() {
    if (
      this.assignedKey !== '' &&
      this.assignedKey !== this.arrHotKeys[this.selectedHotkeyAction].assignedKey
    ) {
      this.isAddBtnDisabled = false;
    } else {
      this.isAddBtnDisabled = true;
    }
    this.cdr.detectChanges();
  }

  setCurrentSelTableTheme() {
    if (!this.tableColorThemeArray?.length) {
      this.defalutTableThemeUrl = GlobalConstant.LOCAL_THEME.TABLE;
      return;
    }
    if (this.tableColorTheme === 0) {
      this.tableColorTheme = this.dataStorage.dynamicImagData.defaultImgs.tableImgId;
    }
    const data: SettingsThemeData = this.userPreferencesService.getCurrentSelTheme(
      this.tableColorThemeArray,
      this.tableColorTheme
    );
    this.tableColorTheme = data.id;
    this.defalutTableThemeUrl = this.tableImgUrl + data.url;
  }

  setCurrentSelTableBgTheme() {
    if (!this.sectionBGThemeArray?.length) {
      this.defaultBgColorUrl = GlobalConstant.LOCAL_THEME.TABLE_BG;
      return;
    }
    if (this.sectionColorTheme === 0) {
      this.sectionColorTheme = this.dataStorage.dynamicImagData.defaultImgs.bgImgId;
    }
    const data: SettingsThemeData = this.userPreferencesService.getCurrentSelTheme(
      this.sectionBGThemeArray,
      this.sectionColorTheme
    );
    this.sectionColorTheme = data.id;
    this.defaultBgColorUrl = this.tableImgUrl + data.url;
  }

  // Custom toast message
  toastMsgFunc() {
    const msgDuration = 1 * 1000;
    this.toastMsg = 'Saved Successfully';
    this.isShowToastMsg = true;
    this.cdr.detectChanges();
    clearTimeout(this.toastMsgTimer);
    this.toastMsgTimer = setTimeout(() => {
      this.isShowToastMsg = false;
      this.cdr.detectChanges();
    }, msgDuration);
  }

  // call on component destroy
  ngOnDestroy() {
    this.broadcastService.$off('showBuyInPrefAfterFocus');
    this.broadcastService.$off('updateUserThemeSetting');
  }
}
