import { ChangeDetectorRef, Directive, Input, ViewChild } from '@angular/core';
import { ToFixedPipe } from 'projects/shared/src/lib/pipe/to-fixed.pipe';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  BroadcastService,
  ChangeDetector,
  DataStorage,
  GlobalConstant,
  HttpCommService,
  InjectorInstance,
  LobbyService,
  PlatformDetection,
  ServerCommands,
  ServerTimerService,
  SfsCommService,
  SfsRequestService,
  SocketCommService,
  TickerTimerService,
  UserAccountService,
  UtilityService,
  WindowCommService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { PlayerSeat } from 'src/app/core/utility/player-seat';

@Directive()
export abstract class GameModel extends ServerCommands {
  showBankTimer: any;

  roomName: string;

  @Input() joinedRoomObj: any;

  @Input() $index: number;

  @ViewChild('autoActionPanel') autoActionPanel: any;

  @ViewChild('dcPanel', { static: true }) dcPanel: any;

  orgRoomNameFromSection: string;

  playerSeatMap: Map<number, PlayerSeat> = new Map();

  userThemeValues: any = {};

  tableImgUrl: string;

  tableBgImgUrl: string;

  isFullGlossCard: any;

  backFaceCardThemeValue: any;

  isShowPlayersBalloons: any;

  isShowOwnBalloons: any;

  isCheckFTTheme: any;

  hasFinalTable: any;

  ftThemeName: any;

  showMoneybag = false;

  isShowMoneyBagTt = false;

  isShowBountyTt = false;

  moneybagData = null;

  showMoneyLoser = false;

  showMoneyWinner = false;

  parsedCurrRoomName: string;

  chipType: string;

  currRoomData: any;

  ownSeat: boolean;

  public mySeatId = -1;

  isAnonynounsTable: boolean;

  currChipType: string;

  isDynamic: boolean;

  isMR: boolean;

  showTwoThirdPotBtn: boolean;

  showActionPanelAllin: boolean;

  showActionPanel: boolean;

  showPotBtn: boolean;

  myPlayingStatus: number;

  myChipsLeft: number;

  showSitoutCheckBox: boolean;

  isJoinWaitlistBtnDisable = true;

  joinWaitlistBtnText: string;

  isRequestedSitout = false;

  isSitoutNextBBChecked = false;

  showSitOutNextBB = false;

  isAutoPostBBChecked: boolean;

  isShowPostBB: boolean;

  isPostBBChecked: boolean;

  PlayerActionChoices: any = {};

  isFirstGameStatsCmd = true;

  gameStats: any = null;

  showContestJoinBtn: boolean;

  showContestsBar: boolean;

  commCardLen: Map<string, any> = new Map();

  commCardLenMultiRun: Map<string, any> = new Map();

  commCardArrAllinCase: Array<any> = [];

  winnerAnimInProgress: boolean;

  holecardType: string;

  gameVariant: string;

  potList: Array<any> = [];

  potHide: boolean;

  newDealerSeatId = -1;

  gameStartTimerCount: number;

  isDiscardBtnDisabled = true;

  showWinnerReasonNow: boolean;

  isSelectWinningCards: boolean;

  winnerReasonText = '';

  isAllinCase: boolean;

  isShowBuyInPopup: boolean;

  buyInPopupData: any = {};

  waitListCount = -1;

  isShowDiscardedCard = false;

  discardedCard: any = {};

  discardTimerLeft = -1;

  topupBtnClick = false;

  isShowAutoRebuy = true;

  haveHoleCard = false;

  showHoleCardNow: boolean;

  isMuck: boolean;

  isTease: boolean;

  isRabbit: boolean;

  isRabbitDis: boolean;

  dealSwitchData: any = null;

  isMeFolded: boolean;

  disableAddonCheckBox: boolean;

  disableAutoRebuyChkBx = true;

  isInstantRebuyAllowed: boolean;

  isAutoRebuyMttChecked: boolean;

  isAutoRebuyNxMttChecked: boolean;

  showFinalAddonBtnNow: boolean;

  isAutoAddonMttChecked: boolean;

  isInstantRebuyProcessing: false;

  rebuyNxCount: number;

  dealPopupData: any = null;

  isLeaveFromNextHand: boolean;

  showRebuyPopup: boolean;

  isSitout: boolean;

  postBBMsg = '';

  showIMBackBtn: boolean;

  handStrengthMsg = '';

  isTopupRequested: boolean;

  isShowBounty: boolean;

  userChatArr: Array<any> = [];

  playerWaitingMsg: string;

  disableButtonsBeforeGameStart: boolean;

  hideMyTurnTimer = true;

  showDiscardPanel: boolean;

  showDiscardTimer: boolean;

  isSitHereClicked: boolean;

  addonChipsCredit: number;

  bountyLevel = 0;

  bountyAmount: number;

  isShow4ColorDeck: boolean;

  isSmileyPopupOpen: boolean;

  showContestBtn: boolean;

  isShowHandStrengthChecked: boolean;

  isShowHandStrengthDisabled: boolean;

  isAutoMuckDisable: boolean;

  isAutoMuckChecked: boolean;

  isAutoPostBBDisable: boolean;

  isStatsBtnDisable: boolean;

  showLasthandBtn: boolean;

  mttBreakMsg = '';

  isDataFromGameInfo: boolean;

  isRecoveryMode: boolean;

  breakTimerLeft = -1;

  showWaitMsg: boolean;

  isCommCardAnimDisabled: boolean;

  isEliminatedSitout: boolean;

  gameConfigId: number;

  isRunItTwiceChecked: boolean;

  leaveNextHandChecked: boolean;

  isTableAutoMuckChecked: boolean;

  newServer: boolean;

  showUserExpOnCapsule = false;

  // user-exp variables
  showUserExpPopup = false;

  showUserExpOn = -1;

  isShowUserExpression = false;

  isUserExpEnabled = false;

  userExpAnimationList = [];

  // Send-items variables
  showSIOnCapsule = false;

  showSendItemsPopup = false;

  sendItemsTo = -1;

  sendItemToNewSeatId = -1;

  itemsToSend = -1;

  sendItemsAnimationList = [];

  playItemsAnimationList = [];

  sentAnimationCount = 0;

  sendAnimationLimit = 0;

  isSendItemEnabled = false;

  showcontestToastMsg = false;

  contestToastData = {};

  isShowRespPopup: boolean;

  respData: any;

  isShowAddon = false;

  isShowRebuy = false;

  showFinalAddOnPopup = false;

  isFromOfferedRebuy = false; // flag to decide visibilty of 2x in rebuy form

  rebuyChipInfoData: any = null;

  isFromVipCovertPopup = false;

  isRebuyNxChecked = 'f'; // assign string because it's based on value of radio button (radio button value attribute

  realChips = 0;

  addOnAmt = 0;

  addOnTime = 3;

  sngMttBal = 0;

  rebuyChipsToBeGranted: any;

  rebuyPopupTimeLeftInterval: any = null;

  rebuyTimerText: String = '';

  showFinalAddOnMessageTimer = false;

  addonTimerLeft = -1;

  addonPopupTimerLeft: any = -1;

  addonPopupTimerLeftDisp: any = 0;

  showTableDestoryPoppup = false;

  tablDestroyMsg = '';

  tablDestroyTimer = -1;

  tablDestroyTimerDisp = 0;

  showVipToWalletMsgData = {
    isShow: false,
    vipAmt: 0
  };

  rebuyLeftCount: any = 0;

  showRebuyleftText = false;

  rebuyAmountCheckBox0 = false;

  rebuyAmountCheckBox1 = false;

  rebuyAmountCheckBox2 = false;

  isVipFlag = false;

  newTdsFlow = false;

  handForHandMsg = '';

  finalAddonMsgRunning: boolean;

  tableNameInGameArea = this.utilityService.navName;

  sessionHandAmount = 0;

  sessionHandAmountAdded = 0;

  sessionHandAmountType = '';

  isAfterFirstAnimEnd = false;

  isAnimEndHandSession = false;

  isAnimInProgess = false;

  cashBal: any;

  tbBal: any;

  public gameStateKey = 0;

  protected dataStorage = DataStorage.getInstance();

  protected platformDetection = PlatformDetection.getInstance();

  public isShowAccountBlockPopup = false;

  allowTakeSeatFlag = false;

  allowTakeSeatData: any;

  isShowSttBuyInPopup = false;

  public buyInSng: any;

  public feeSng: any;

  seatId: any;

  isVipToPokerConversion = false;

  hasSendCardCheaseReq = false;

  buyInSngAmount: any;

  tickTimerMap: Map<String, any> = new Map();

  parsedRoomCurrName: any;

  activeUsersListForWaitBBMsg: Array<any> = [];

  isRunAnim: boolean;

  isFoldToAnyBet = false;

  hideAAPanel = true;

  minRaiseAmt: any;

  maxRaiseAmt: any;

  startTimeBankTimer: any;

  tbtimer: any;

  showGameStartTimer: boolean;

  userActionPanelObj: any = {};

  countdownSubscriptionRef$: Subscription;

  isTeaseDis: boolean;

  betOptionsObj: any = {
    betSliderValue: 0,
    PreFlop: {},
    PostFlop: {}
  };

  showRecogIcon = false;

  userJOinedObj: any = {};

  gamePlayersObj: any = {};

  reEnterDataObj: any = {};

  showRecognition: boolean;

  recognitionData: any = {};

  isFav = false;

  mttWinnerDataObj: any = {};

  sttWinnerDataObj: any = {};

  isShowMttWinnerPopup = false;

  isShowReEnterPopup = false;

  isSTTWinner = false;

  criticalSoundStart: boolean;

  toPlayCriticalSound = false;

  public gameInfoObj: any = {};

  public prizeArr = [];

  public blindsObj: any = {};

  isSitoutAllTabChecked: boolean;

  isFoldToAnyBetChecked: boolean;

  disableFoldToBet = true;

  collapseGameOptions: any;

  playersName: any = [];

  vipToWalletOpenFor: any;

  contestRoomName: any;

  // variable for bounty in ring
  subBountyInRing$: Subscription;

  isBountyTable: boolean;

  showBountyMsg = false;

  bountyMsg = 'bounty won';

  bountyDataInRing: any = null;

  stopBountyBlink: any;

  public showHHR: boolean;

  public seatReservedForMe = false;

  isNewUser: boolean;

  nujCongoData: any = {};

  showNUJCongoPopup: boolean;

  showSessionHandCount: boolean;

  contestBtnGlow: boolean;

  sessionContestsData: any = {};

  sessionContestsObj: any = null;

  enableSitoutButton: boolean;

  sitoutEnableTimeLeft: number = -1;

  sitoutEnableTimeLeftDisp: number = -1;

  ibRestrictionOnPrivateTable = false;

  public isGameInfo: boolean;

  public isGameStats: boolean;

  public isSettingsOpen = false;

  public isShowFoldToAnyBet = false;

  public isShowRespGamePopup = false;

  public cdr: ChangeDetector;

  public isShowDcPreHand = false;

  contestsBarData: any;

  isShowContestPopup: any = {};

  tableNameMobile: any;

  protected userAccountServiceInstance: UserAccountService =
    InjectorInstance.get(UserAccountService);

  tbVal: any;

  isShowBuyChipsPopup: any;

  reEnterOkBtn: any;

  isAntiBumGame = false;

  showBBFormate = false;

  showStackBBForCash = false;

  showStackBBForMTT = false;

  selectedSngChipType: string = '';

  selectedUserId = -1;

  hudPannelData: any = {};

  seatHovered: string = '';

  public isShowBotDetectionPopup: boolean = false;

  public BotorExeName: any;

  public newSignupData: any;

  public timerfunction: any;

  public isExe = this.platformDetection.isExe;

  gameStartTimeRef$: Subscription;

  constructor(
    public sfsRequestService: SfsRequestService,
    public cdrf: ChangeDetectorRef,
    public userAccountService: UserAccountService,
    public userPreferencesService: UserPreferencesService,
    public windowCommService: WindowCommService,
    public broadcastService: BroadcastService,
    public tickerTimerService: TickerTimerService,
    public serverTimerService: ServerTimerService,
    public utilityService: UtilityService,
    public httpCommService: HttpCommService,
    public socketCommService: SocketCommService,
    public lobbyService: LobbyService,
    public sfsCommService: SfsCommService,
    public toFixedPipe: ToFixedPipe
  ) {
    super(true, true);
    this.cdr = new ChangeDetector(cdrf);
  }

  protected onInit() {
    if (this.isExe && !this.platformDetection.isDmg) {
      // this.exeHeaderServiceRef = InjectorInstance.get(ExeHeaderService);
      this.isShowBotDetectionPopup = this.dataStorage.isShowBotDetectionPopup;
    }

    this.newSignupData = this.dataStorage.newSignupData;
    // this.collapseGameOptions = this.gameService.getGameOptionsCollapseVal();
    this.newServer = this.dataStorage?.newServer;
    this.isVipFlag = this.dataStorage?.isVipFlag;
    this.newTdsFlow = this.dataStorage?.newTdsFlow;
    // if (!this.dataStorage.isVipFlag || !this.dataStorage.newTdsFlow) {
    //     this.mainService.getNewTdsContentFlag().subscribe((response: any) => {
    //         if (response.respCode === 200) {
    //             const dataRcvd = JSON.parse(response.respData);
    //             GlobalConstant.isVipFlag = dataRcvd.tourneyPlayFromVip === 'true' ? true : false;
    //             GlobalConstant.newTdsFlow = dataRcvd.newTdsFlow === 'true' ? true : false;
    //             this.isVipFlag = GlobalConstant.isVipFlag;
    //             this.newTdsFlow = GlobalConstant.newTdsFlow;
    //             this.dataStorage.isVipFlag = this.isVipFlag;
    //             this.dataStorage.newTdsFlow = this.newTdsFlow;
    //         }
    //     }, error => {
    //         console.error('getNewTds api error', error);
    //     });
    // }

    // this.callTimers();
    this.orgRoomNameFromSection = this.joinedRoomObj?.name;
    // this.parsedRoomCurrName = this.orgRoomNameFromSection.replace('#', '');
    // this.gameService.setFoldToAnyBet(false, this.orgRoomNameFromSection);
    this.tableNameMobile = this.joinedRoomObj?.navName;
    // this.gameService.tourneyLocalData = {};
    // filter commands by specific roomName
    // this.filterCommandsByRoomName(this.orgRoomNameFromSection);
    // for (const player of this.joinedRoomObj?.maxPlayerCount) {
    //     const playerSeat = new PlayerSeat(player.seatId, this.cdrf, this.orgRoomNameFromSection);
    //     this.playerSeatMap.set(player.seatId, playerSeat);
    // }

    // this.seatInfoService.updateSeatMap(this.playerSeatMap);
    // this.gameConfigId = Number(this.sfsRequestService
    //  .getRoomByName(this.orgRoomNameFromSection)._variables.get('configId').value);
    this.onGameLoadInitialisation();
    // this.updateRingVariantFeatures();

    this.broadcastService.$on('updateUserThemeSetting', () => {
      this.userThemeValues = this.userPreferencesService.getUserTheme();
      if (this.platformDetection.isDesktop) {
        const userTheme = this.userThemeValues;
        // const scaleAmt = GlobalConstant.GAME_AREA_SCALE_AMT;
        this.isShow4ColorDeck = userTheme.FOUR_COLOR_DECK_VALUE === 1;
        this.isFullGlossCard = userTheme.FOUR_COLOR_DECK_VALUE === 2;
        this.backFaceCardThemeValue = userTheme.NG_CARD_BACKGROUND_VALUE;
        this.isShowPlayersBalloons = userTheme.SHOW_PLAYERS_CHAT_BALLOONS;
        this.isShowOwnBalloons = userTheme.SHOW_OWN_CHAT_BALLOONS;
        this.isSendItemEnabled = userTheme.USER_ANIMATION_ENABLED;
        this.isUserExpEnabled = userTheme.USER_EMOJI_ENABLED;
        this.isCheckFTTheme = userTheme.SHOW_FINAL_TABLE_THEME;
        this.setCurrentSelTableTheme();
        this.setCurrentSelTableBgTheme();
        // if (this.hasFinalTable && this.isCheckFTTheme) {
        //     if (this.ftThemeName === GlobalConstant.FTABLE_THEME_NAME.SPECIAL_NAME) {
        //         this.onUpdateFinalTableTheme({
        //            value: GlobalConstant.FTABLE_THEME_NAME.SPECIAL_VALUE });
        //     } else {
        //         this.onUpdateFinalTableTheme({
        //            value: GlobalConstant.FTABLE_THEME_NAME.DEFALUT_VALUE });
        //     }
        // }
        // if (this.isShow4ColorDeck) {
        //     this.setColorDeck();
        // } else {
        //     this.setColorDeck('reset');
        // }
      }
      this.cdr.detectChanges();
    });

    // this.broadcastService.$on('reconnectionStart', (data: any) => {
    //     this.showRecognition = false;
    //     this.msgDialogService.open(MessageConstant.reconnectionStartMsg,
    //       { closeOnBackdrop: false, closeOnEscape: false, showOkButton: false,
    //         showCancelButton: false, dialogFor: 'disconnection' })
    //        .subscribe((e: DialogEventInterface) => {
    //     });
    //     this.cdr.detectChanges();
    // });

    // this.broadcastService.$on('onReconnectionStart', (data: any) => {
    //     this.showRecognition = false;
    //     this.closeGameSettings();
    //     this.onMobileGameInfoClose();
    //     this.onMobileGameStatsClose();
    //     this.closeDcPreHand();
    //     this.closeTableDesroyPopup();
    //     if (!this.platformDetection.isDesktop) {
    //         this.showUserExpPopup = false;
    //         // Empty OTT hole cards in cse of reconnection
    //         const obj = {
    //             roomName: this.currRoomData.roomName,
    //             holeCards: []
    //         };
    //         this.broadcastService.$broadcast('openTableHoleCardsForAllWindow', obj);
    //     }
    //     this.msgDialogService.open(MessageConstant.reconnectionStartMsg,
    //         { closeOnBackdrop: false, closeOnEscape: false, showOkButton: false,
    //           showCancelButton: false, dialogFor: 'disconnection' })
    //          .subscribe((e: DialogEventInterface) => {
    //     });
    //     this.cdr.detectChanges();
    // });

    this.isFav = this.dataStorage.favTableList.includes(this.gameConfigId);
    this.isNewUser = this.dataStorage.isNewUser;
    // this.isFoldToAnyBet = this.gameService.getFoldToAnyBet(this.currRoomData.roomName);
    this.tbVal = this.userAccountServiceInstance.isTBVisible;

    // TODO: Remove hardcode true value of isTBVisible
    this.dataStorage.isTBVisible = true;
    this.cdr.detectChanges();
  }

  private onGameLoadInitialisation() {
    window.scrollTo(0, 0);
    this.isShowHandStrengthChecked = this.userPreferencesService.getShowHandStrength();
    // this.betOptionsEval(this.userPreferencesService.getBetOptionsObj());

    this.userThemeValues = this.userPreferencesService.getUserTheme();
    const userTheme = this.userThemeValues;
    this.isShow4ColorDeck = userTheme.FOUR_COLOR_DECK_VALUE === 1;
    this.isFullGlossCard = userTheme.FOUR_COLOR_DECK_VALUE === 2;
    this.isCheckFTTheme = userTheme.SHOW_FINAL_TABLE_THEME;
    this.backFaceCardThemeValue = userTheme.NG_CARD_BACKGROUND_VALUE;
    this.isShowPlayersBalloons = userTheme.SHOW_PLAYERS_CHAT_BALLOONS;
    this.isShowOwnBalloons = userTheme.SHOW_OWN_CHAT_BALLOONS;
    this.isSendItemEnabled = userTheme.USER_ANIMATION_ENABLED;
    this.isUserExpEnabled = userTheme.USER_EMOJI_ENABLED;
    this.isAutoMuckChecked = this.userPreferencesService.getAutoMuck();
    this.isAutoPostBBChecked = this.userPreferencesService.getAutoPostBB();
    if (!this.platformDetection.isDesktop) {
      this.isShow4ColorDeck = this.userPreferencesService.get4ColorDeck();
    }
    this.setCurrentSelTableTheme();
    this.setCurrentSelTableBgTheme();
    // this.currRoomData = this.gameService.getRoomData(this.orgRoomNameFromSection);
    // this.ibRestrictionOnPrivateTable = this.currRoomData.ibRestrictionOnPrivateTable;
    // this.isAntiBumGame = this.currRoomData.isAntiBumHunting;
    // this.showStackBBForCash = this.userPreferencesService.getShowStacksInBBForCash();
    // this.showStackBBForMTT = this.userPreferencesService.getShowStacksInBBForMtt();

    // if (this.currRoomData.gameType === GlobalConstant.RING_VARIANT.STT
    // || this.currRoomData.gameType === GlobalConstant.RING_VARIANT.MTT) {
    //     this.enableSitoutButton = true;
    //     this.showBBFormate = this.showStackBBForMTT;
    // } else {
    //     this.showBBFormate = this.showStackBBForCash;
    // }
    // if (this.currRoomData.roomName !== undefined && this.currRoomData.roomName !== null) {
    //     [,this.gameInfoObj.tableIdInfo] = this.currRoomData.roomName.split('#');
    // }
    // if (this.currRoomData.coolOffTime === null
    // || this.currRoomData.coolOffTime === undefined
    // || this.currRoomData.coolOffTime === '' || Number(this.currRoomData.coolOffTime) === 0) {
    //     this.gameInfoObj.antiBankingTimer = '-';
    // } else {
    //     this.gameInfoObj.antiBankingTimer = `${this.currRoomData.coolOffTime} Min`;
    // }
    // if (this.currRoomData.isTimeBank) {
    //     this.gameInfoObj.timeBankValue = `${this.currRoomData.timeBank} Sec
    //  / ${this.currRoomData.timeBankMaxHands} Min`;
    // } else {
    //     this.gameInfoObj.timeBankValue = 'Disabled';
    // }
    // if (this.currRoomData.amount) {
    // const amountArr = this.currRoomData.amount.split(',');
    // for (const elem of amountArr) {
    //     if (elem !== '') {
    //         const val = elem.split('#');
    //         this.prizeArr.push({
    //             prizeRank: Number(val[0]),
    //             prizeVal: Number(val[1]),
    //             prizeType: val[2]
    //         });
    //     }
    // }
    // }
    // this.parsedCurrRoomName = this.orgRoomNameFromSection.split('#').join('');

    // this.currChipType = this.currRoomData.chipType;
    // this.isAnonynounsTable = this.currRoomData.isAnonynounsTable;
    // this.isDynamic = this.currRoomData.isDynamic;
    // this.isMR = this.currRoomData.isMR;

    // if (this.isAnonynounsTable || !this.isDynamic
    // || this.currChipType.toLowerCase() === 'freeroll'
    // || this.currRoomData.gameType === GlobalConstant.RING_VARIANT.MTT
    // || this.currRoomData.gameType === GlobalConstant.RING_VARIANT.STT) {
    //     this.showContestBtn = false;
    // } else {
    //     this.showContestBtn = true;
    // }

    // if (this.currRoomData.gameType === GlobalConstant.RING_VARIANT.MTT
    // || this.currRoomData.gameType === GlobalConstant.RING_VARIANT.STT) {
    //     this.isAutoPostBBDisable = true;
    //     this.isAutoPostBBChecked = false;
    //     this.isStatsBtnDisable = true;
    // this.mttConfigId = Number(this.gameService.mttConfigId[this.orgRoomNameFromSection]);
    // if (this.gameService.tourneyLocalData !== undefined
    // && this.gameService.tourneyLocalData[this.mttConfigId] !== undefined) {
    //     this.isAutoAddonMttChecked = this.gameService
    //      .tourneyLocalData[this.mttConfigId].isAutoAddonChecked;
    //     this.isAutoRebuyMttChecked = this.gameService
    //      .tourneyLocalData[this.mttConfigId].isAutoRebuyChecked || false;
    //     this.isAutoRebuyNxMttChecked = this.gameService
    //      .tourneyLocalData[this.mttConfigId].isAutoRebuyNxChecked || false;
    // }
    // }
    // if (this.currChipType.toLowerCase() !== 'freeroll') {
    //     if ((this.currRoomData.gameType === GlobalConstant.RING_VARIANT.RING
    //       && (this.currRoomData.ringVariant !== GlobalConstant.RING_VARIANT.CRAZY_PINEAPPLE))
    //         || this.currRoomData.gameType === GlobalConstant.RING_VARIANT.MTT
    // || this.currRoomData.gameType === GlobalConstant.RING_VARIANT.STT) {
    //         this.showHHR = true;
    //     } else {
    //         this.showHHR = false;
    //     }
    // } else {
    //     this.showHHR = false;
    // }

    // remove SeatMe index from seatMeRoomList in game area once used.
    // const seatMeIndex = this.dataStorage.seatMeRoomList.indexOf(this.orgRoomNameFromSection);
    // let seatMeConfigIndex = -1;
    // if (!this.gameConfigId) {
    // setTimeout(() => {
    //     this.gameConfigId = Number(this.sfsRequestService
    //      .getRoomByName(this.orgRoomNameFromSection)._variables.get('configId').value);
    //     if (!this.isNewUser) {
    //         this.callContestSessionApi();
    //     }
    // }, 100);
    // } else {
    //     if (!this.isNewUser) {
    //         // this.callContestSessionApi();
    //     }
    //     seatMeConfigIndex = this.dataStorage.seatMeRoomList.indexOf(`${this.gameConfigId}`);
    // }

    // if (seatMeIndex > -1 || seatMeConfigIndex > -1) {
    //     // seatMeIndex > -1 ? this.dataStorage.seatMeRoomList
    //      .splice(seatMeIndex, 1) : this.dataStorage.seatMeRoomList.splice(seatMeConfigIndex, 1);
    //     if (seatMeConfigIndex > -1) {
    //         this.windowCommService.sendDataToWindow({
    //             cmd: 'updateSeatmeData',
    //             data: { configId: this.gameConfigId, type: 'delete' },
    //             windowType: WindowManagerConstant.WINDOW_TYPE.LOBBY,
    //         });
    //     }
    //     this.utilityService.sendEventToGA(GAConstant.EventCategory.JOIN_ROOM,
    //       GAConstant.EventAction.JOIN_ROOM.SEAT_ME, `${this.gameConfigId}`);
    // }
    setTimeout(() => {
      // let params: any = ((seatMeIndex !== -1 || seatMeConfigIndex !== -1)
      //     || this.currRoomData.gameType.toUpperCase() === GlobalConstant.RING_VARIANT.STT) ?
      //     { seatMe: true } : {};

      // if (!this.dataStorage.autoBuyinFalg && this.checkAutobuyin(this.gameConfigId)) {
      //     params.seatMe = true;
      // }

      // send client ready now
      // if(this.newSignupData && this.newSignupData
      //   && this.gameConfigId === this.newSignupData.welcomeTableConfig ){
      //     params.isNewUser = true;
      //     params.seatMe = true;
      //     this.newSignupData = null;
      //     this.windowCommService.sendDataToWindow({
      //         cmd: 'resetNewSignupData',
      //         data: {},
      //         windowType: WindowManagerConstant.WINDOW_TYPE.LOBBY
      //     });
      // }
      // this.sfsRequestService.sendClientReady(this.orgRoomNameFromSection, params);
      this.cdr.detectChanges();
    }, 500);
  }

  setCurrentSelTableTheme() {
    if (
      !this.dataStorage.dynamicImagData?.tableImgs ||
      !this.dataStorage.dynamicImagData?.tableImgs.length
    ) {
      if (this.platformDetection.isDesktop) {
        this.tableImgUrl = GlobalConstant.LOCAL_THEME.TABLE;
        return;
      }
      this.tableImgUrl = GlobalConstant.LOCAL_THEME_MOBILE.TABLE;
      return;
    }
    if (this.userThemeValues.NG_TABLE_COLOR_VALUE === 0 || !this.platformDetection.isDesktop) {
      this.userThemeValues.NG_TABLE_COLOR_VALUE =
        this.dataStorage.dynamicImagData?.defaultImgs.tableImgId;
    }
    const data: any = this.userPreferencesService.getCurrentSelTheme(
      this.dataStorage.dynamicImagData?.tableImgs,
      this.userThemeValues.NG_TABLE_COLOR_VALUE
    );
    this.userThemeValues.NG_TABLE_COLOR_VALUE = data.id;
    this.tableImgUrl = this.dataStorage.dynamicImagData.imagePath + data.url;
  }

  setCurrentSelTableBgTheme() {
    if (
      !this.dataStorage.dynamicImagData?.bgImgs ||
      !this.dataStorage.dynamicImagData?.bgImgs?.length
    ) {
      if (this.platformDetection.isDesktop) {
        this.tableBgImgUrl = GlobalConstant.LOCAL_THEME.TABLE_BG;
        return;
      }
      this.tableBgImgUrl = GlobalConstant.LOCAL_THEME_MOBILE.TABLE_BG;
      return;
    }

    if (this.userThemeValues.NG_BACKGROUND_COLOR_VALUE === 0 || !this.platformDetection.isDesktop) {
      this.userThemeValues.NG_BACKGROUND_COLOR_VALUE =
        this.dataStorage.dynamicImagData?.defaultImgs?.bgImgId;
    }
    const data: any = this.userPreferencesService.getCurrentSelTheme(
      this.dataStorage.dynamicImagData?.bgImgs,
      this.userThemeValues.NG_BACKGROUND_COLOR_VALUE
    );
    this.userThemeValues.NG_BACKGROUND_COLOR_VALUE = data.id;
    this.tableBgImgUrl = this.dataStorage.dynamicImagData.imagePath + data.url;
  }
}
