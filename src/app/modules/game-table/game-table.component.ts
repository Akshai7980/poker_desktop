import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { ToFixedPipe } from './models/game-model';
import { ToFixedPipe } from 'projects/shared/src/lib/pipe/to-fixed.pipe';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  Background,
  CopiedTimer,
  DataStorage,
  LobbyService,
  MATDIALOG,
  Paths,
  ScreenId,
  SettingsService,
  SfsCommService,
  SfsRequestService,
  SpinnerService,
  Table,
  WindowCommService,
  WindowManagerConstant
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import * as SFS2X from 'sfs2x-api';
import { CoreCommonService } from 'src/app/core/services/core-common.service';

import { ThemeResponse } from 'projects/shared/src/lib/models/response/theme-response.model';
import { AntiBankingComponent } from './components/anti-banking/anti-banking.component';
import { BuyInComponent } from './components/buy-in/buy-in.component';
import { InfoComponent } from './components/info/info.component';
import { LeaderboardContestDialogComponent } from './components/leaderboard-contest-dialog/leaderboard-contest-dialog.component';
import { TopUpComponent } from './components/top-up/top-up.component';

interface GameInfo {
  tableIdInfo: number;
}

interface CurrentRoomData {
  ringVariant: string;
  roomName: string;
  isDynamic: boolean;
  gameType: string;
  isDecimalTable: boolean;
  smallBlind: number;
  bigBlind: number;
  buyInLow: number;
  buyInHigh: number;
  players: number;
  turnTime: number;
  timeBank: number;
  coolOffTime: number;
}

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.scss']
})
export class GameTableComponent implements OnInit {
  assetsImagePath = Paths.imagePath;

  themeImagePath = Paths.themePath;

  dealerChat: any = [];

  multiSelectList: any = [];

  chatClick: any = 'dealer';

  isActive: boolean = false;

  buyInComponent = BuyInComponent;

  infoComponent = InfoComponent;

  topUpComponent = TopUpComponent;

  antiBankingComponent = AntiBankingComponent;

  dataStorage1 = DataStorage.getInstance();

  settingsWindow: Window | null;

  themeImges: any;

  subscription: Subscription;

  tableColorTheme: Number;

  selectedTable: Table;

  selectedTableIndex: number;

  selectedBackground: Background;

  selectedBackCard: string;

  selectedCardName: string = 'classicCards';

  selectedSeatId: number;

  showJoinSimilarBtn: boolean = true;

  cards = [
    {
      id: 0,
      cardName: 'pink',
      imageSrc: 'settings/cards/pink.png'
    },
    {
      id: 1,
      cardName: 'red',
      imageSrc: 'settings/cards/red.png'
    },
    {
      id: 2,
      cardName: 'green',
      imageSrc: 'settings/cards/green.png'
    },
    {
      id: 3,
      cardName: 'orange',
      imageSrc: 'settings/cards/orange.png'
    }
  ];

  backCards = [
    {
      id: 0,
      cardName: 'back-pink',
      imgSrc: 'settings/cards/backCards/Pink.svg'
    },
    {
      id: 1,
      cardName: 'back-red',
      imgSrc: 'settings/cards/backCards/Red.svg'
    },
    {
      id: 2,
      cardName: 'back-green',
      imgSrc: 'settings/cards/backCards/Green.svg'
    },
    {
      id: 3,
      cardName: 'back-orange',
      imgSrc: 'settings/cards/backCards/Orange.svg'
    }
  ];

  groupCards = [
    {
      id: 0,
      cardName: 'Classic Cards',
      imageSrc: 'settings/cards/Classic-Cards.png'
    },
    {
      id: 1,
      cardName: '4 Colour Deck',
      imageSrc: 'settings/cards/4-Color-Deck.svg'
    },
    {
      id: 2,
      cardName: 'Full Color Gloss',
      imageSrc: 'settings/cards/Full-Color-Gloss.svg'
    }
  ];

  playCards = [
    {
      id: 1,
      cardName: 'A',
      cardType: 's',
      cardStyle: 'fourColorDeck'
    },
    {
      id: 2,
      cardName: '10',
      cardType: 'd',
      cardStyle: 'fullColorGloss'
    },
    {
      id: 3,
      cardName: 'A',
      cardType: 's',
      cardStyle: ''
    },
    {
      id: 4,
      cardName: 'A',
      cardType: 'd',
      cardStyle: 'fullColorGloss'
    },
    {
      id: 5,
      cardName: '10',
      cardType: 's',
      cardStyle: ''
    },
    {
      id: 4,
      cardName: 'A',
      cardType: 'd',
      cardStyle: 'fullColorGloss'
    },
    {
      id: 5,
      cardName: '10',
      cardType: 's',
      cardStyle: ''
    }
  ];

  playersArray: Array<any> = [];

  dataFromParent: any;

  private dataStorage = DataStorage.getInstance();

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload() {
    this.triggerUnLoadEventToParent();
  }

  showCopied: boolean = false;

  gameInfo: GameInfo;

  currRoomData: CurrentRoomData;

  constructor(
    private el: ElementRef,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private coreCommonService: CoreCommonService,
    public userPreferencesService: UserPreferencesService,
    public http: HttpClient,
    public sfsRequestService: SfsRequestService,
    private clipboard: Clipboard,
    public lobbyService: LobbyService,
    public sfsCommService: SfsCommService,
    public toFixedPipe: ToFixedPipe,
    public settingsService: SettingsService,
    private windowCommService: WindowCommService
  ) {
    this.subscription = this.settingsService.userPref.subscribe(
      (params: UserPreferencesService) => {
        const updatedArrTableColorTheme = [...params.arrTableColorTheme];
        const updatedArrSectionBGTheme = [...params.arrSectionBGTheme];
        const updatedArrCardBackFace = [...params.arrCardBackFace];
        const updatedArrFourColorDeck = [...params.arrFourColorDeck];

        if (updatedArrTableColorTheme[0].keyStatus.toString() === 'ACTIVE') {
          this.userPreferencesService = params;
          this.themeImges.data.tableImgs.filter((item: any) => {
            if (updatedArrTableColorTheme[0].keyValue === '0') {
              updatedArrTableColorTheme[0].keyValue = '1';
              if (item.id.toString() === updatedArrTableColorTheme[0].keyValue.toString()) {
                this.tableColorTheme = updatedArrTableColorTheme[0].keyValue;
                this.selectedTable = item;
                // this.selectedTableIndex = this.selectedTable.id - 1;
              }
            } else if (item.id.toString() === updatedArrTableColorTheme[0].keyValue.toString()) {
              this.tableColorTheme = updatedArrTableColorTheme[0].keyValue;
              this.selectedTable = item;
              // this.selectedTableIndex = this.selectedTable.id - 1;
            }
            return true;
          });
        }

        if (updatedArrSectionBGTheme[0].keyStatus.toString() === 'ACTIVE') {
          this.themeImges.data.bgImgs.filter((item: any) => {
            if (updatedArrSectionBGTheme[0].keyValue === '0') {
              updatedArrSectionBGTheme[0].keyValue = '1';
              if (item.id.toString() === updatedArrSectionBGTheme[0].keyValue.toString()) {
                // this.sectionColorTheme = item.id;
                this.selectedBackground = item;
                // this.SelectedBackgroundIndex = this.selectedBackground.id - 1;
              }
            } else if (item.id.toString() === updatedArrSectionBGTheme[0].keyValue.toString()) {
              // this.sectionColorTheme = item.id;
              this.selectedBackground = item;
              // this.SelectedBackgroundIndex = this.selectedBackground.id - 1;
            }
            return true;
          });
        } else {
          const defaultSelectedBg = this.themeImges.data.defaultImgs.bgImgId;
          // this.sectionColorTheme = defaultSelectedBg;
          this.selectedBackground = this.themeImges.data.bgImgs[defaultSelectedBg];
        }

        for (let i = 0; i < updatedArrCardBackFace.length; i += 1) {
          if (updatedArrCardBackFace[i].keyStatus.toString() === 'ACTIVE') {
            this.backCards.forEach((item: any) => {
              if (updatedArrCardBackFace[i].keyValue.toString() === item.id.toString()) {
                this.selectedBackCard = item.cardName;
              }
            });
          }
        }

        for (let i = 0; i < updatedArrFourColorDeck.length; i += 1) {
          if (updatedArrFourColorDeck[i].keyStatus.toString() === 'ACTIVE') {
            if (updatedArrFourColorDeck[i].keyValue.toString() === '0') {
              // this.selectedCard = 0;
              this.selectedCardName = 'classicCards';
            } else if (updatedArrFourColorDeck[i].keyValue.toString() === '1') {
              // this.selectedCard = 1;
              this.selectedCardName = 'fourColorDeck';
            } else if (updatedArrFourColorDeck[i].keyValue.toString() === '2') {
              // this.selectedCard = 2;
              this.selectedCardName = 'fourColorDeck';
            }
          }
        }
      }
    );

    this.lobbyService.sfsCommandResult.subscribe((resp) => {
      const tblNameFromParent = this.dataFromParent.roomName
        ? this.dataFromParent.roomName
        : this.dataFromParent.tbl;
      if (resp.param.roomName !== tblNameFromParent) {
        return;
      }

      if (resp.cmd === 'game.seatinfo') {
        this.playersArray = [];
        const seatInfo = resp.param.seatinfo;

        const joinedPlayers = seatInfo.seats.filter(
          (element: any) => element.playerId !== 0 && element.playerId !== -1
        ).length;

        seatInfo.seats.forEach((element: any) => {
          const player = {
            name: element.playerName,
            seatId: element.seatId,
            className: `player-caps${seatInfo.seats.length}-${element.seatId}`,
            avatar: element.avatar,
            chips: element.chips,
            joinedPlayers
          };

          this.playersArray.push(player);
        });
      } else if (resp.cmd === 'game.roomdata') {
        if (resp.param.isDynamic)
          this.initSfsCommand('game.clientready', this.dataFromParent.roomName);
        else {
          this.showJoinSimilarBtn = false;
          this.initSfsCommand('game.clientready', this.dataFromParent.tbl);
        }
        const { param } = resp;
        this.currRoomData = param;
      } else if (resp.cmd === 'game.allowTakeseat') {
        if (resp.param.isDynamic)
          this.initSfsCommand('game.takeseat', this.dataFromParent.roomName);
        else this.initSfsCommand('game.takeseat', this.dataFromParent.tbl);
      } else if (resp.cmd === 'game.gameinfo') {
        const { param } = resp;
        this.gameInfo = param;
      }
    });
  }

  joinSimilar() {
    this.initSfsCommand('game.joinSimilar', this.dataFromParent.roomName);
  }

  onCashGamesTableJoin(data: any) {
    this.windowCommService.openWindow(
      WindowManagerConstant.WINDOW_TYPE.GAMETABLE,
      data.param.rooms[0],
      { data: { tbl: '', roomName: data.param.rooms[0] } }
    );
  }

  ngOnInit(): void {
    // super.onInit();
    this.dealerChat = [
      {
        chat: 'reidf7 Raise to 876BB'
      },
      {
        chat: 'Bidyut007 Check'
      },
      {
        chat: 'Flop #Hand 345665657'
      },
      {
        chat: 'reidf7 Raise to 876BB'
      },
      {
        chat: 'reidf7 Raise to 876BB'
      },
      {
        chat: 'Bidyut007 Check'
      }
    ];

    this.multiSelectList = [
      {
        item: 'Sitout 0:30'
      },
      {
        item: 'Fold To Any Bet'
      },
      {
        item: 'Run It Twice'
      },
      {
        item: 'Auto Muck'
      },
      {
        item: 'Sitout Next BB'
      },
      {
        item: 'Sitout All Cash'
      }
    ];

    window.childWindow = {
      setData: this.setData.bind(this),
      setUserPreference: this.setUserPreference.bind(this),
      setSmartFox: this.setSmartFox.bind(this)
    };
    this.triggerLoadEventToParent();
  }

  setUserPreference(userPreferencesService: UserPreferencesService) {
    this.userPreferencesService = userPreferencesService;
    this.settingsService.userPref.next(userPreferencesService);
  }

  openSettingsWindow() {
    this.coreCommonService.loginForCTA(() => {
      if (this.settingsWindow && !this.settingsWindow.closed) {
        this.settingsWindow.focus();
        let isWindFocused: boolean = false;
        this.settingsWindow.onfocus = () => {
          isWindFocused = true;
        };
        const winTimeout = setTimeout(() => {
          if (!isWindFocused) {
            this.settingsWindow = window.open(
              ScreenId.SETTINGS,
              ScreenId.SETTINGS,
              `width=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[0]}px,
              height=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[1]}px`
            );
          }
          clearTimeout(winTimeout);
        }, 500);
        return;
      }
      this.settingsWindow = window.open(
        ScreenId.SETTINGS,
        ScreenId.SETTINGS,
        `width=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[0]}px,
        height=${WindowManagerConstant.WINDOW_SIZE.SETTINGS_WINDOW[1]}px`
      );
      this.settingsWindow?.addEventListener('resize', () => {
        this.settingsWindow?.resizeTo(844, 630);
      });
      // window.allWindow.set(ScreenId.SETTINGS, this.settingsWindow);
      this.settingsWindow?.addEventListener('load', () => {
        const toastVar = setTimeout(() => {
          this.settingsWindow?.childWindow.setData(this.dataStorage1);

          this.settingsWindow?.childWindow.setSmartFox(this.dataStorage1.sfs, SFS2X);
          this.settingsWindow?.childWindow.setUserPreference(this.userPreferencesService);
          clearTimeout(toastVar);
        }, 1000);
      });
    });
  }

  setData(parentData: any, settingData: ThemeResponse) {
    this.dataFromParent = parentData.data;
    this.settingsService.themeData = settingData;
    this.getImges();
    this.spinnerService.close();
  }

  private setSmartFox(smartfox: any, childSFS2X: any) {
    this.dataStorage.sfs2X = childSFS2X;
    this.sfsCommService.removeSfsListeners();
    this.sfsCommService.sfs = smartfox;
    this.dataStorage1.sfs = smartfox;
    this.sfsCommService.addSfsListeners();

    setTimeout(() => {
      if (this.dataFromParent.roomName && this.dataFromParent.roomName.toString() !== '')
        this.initSfsCommand('game.joinRoom', this.dataFromParent.roomName);
      else this.initSfsCommand('game.joinRoom', this.dataFromParent.tbl);
    }, 1000);
  }

  getImges() {
    this.themeImges = this.settingsService.themeData;
  }

  toggle() {
    this.isActive = !this.isActive;
  }

  optionsExpand() {
    const expandable = this.el.nativeElement.querySelector('.game-left-options-container');
    const child = this.el.nativeElement.querySelector('.game-left-options');

    if (expandable.classList.contains('optionsExpanded')) {
      expandable.classList.remove('optionsExpanded');
      child.classList.remove('optionsExpanded');
    } else {
      expandable.classList.add('optionsExpanded');
      child.classList.add('optionsExpanded');
    }
  }

  chatExpand() {
    const chatExpandable = this.el.nativeElement.querySelector('.game-table-left-footer-container');
    const child = this.el.nativeElement.querySelector('.game-table-chat-left');
    if (chatExpandable.classList.contains('chat-expanded')) {
      chatExpandable.classList.remove('chat-expanded');
      child.classList.remove('chat-expanded');
    } else {
      chatExpandable.classList.add('chat-expanded');
      child.classList.remove('chat-expanded');
    }
  }

  chatHeightExpand() {
    const chatHeightExpandable = this.el.nativeElement.querySelector(
      '.game-table-chat-right-container'
    );
    if (chatHeightExpandable.classList.contains('chat-height-expanded')) {
      chatHeightExpandable.classList.remove('chat-height-expanded');
    } else {
      chatHeightExpandable.classList.add('chat-height-expanded');
    }
  }

  openDialog(component: any) {
    if ([this.buyInComponent, this.topUpComponent, this.antiBankingComponent].includes(component)) {
      this.dialog.open(component, {
        data: this.currRoomData,
        ...MATDIALOG.gameTableBuyInDialog
      });
    } else if (component === this.infoComponent) {
      this.dialog.open(component, {
        ...MATDIALOG.gameTableInfoDialog
      });
    }
  }

  initSfsCommand(command: string, roomName: any = null) {
    switch (command) {
      case 'game.joinRoom':
        // These will be uncommented once made generic
        this.sfsRequestService.joinRoomRequest(roomName);
        break;
      case 'game.clientready': {
        const param = { seatMe: false };
        this.sfsRequestService.sendClientReady(roomName, param);
        break;
      }
      case 'game.takeseat':
        this.sfsRequestService.takeSeatRequest(
          {
            seatid: this.selectedSeatId,
            amt: 100,
            autoRebuy: false
          },
          roomName
        );
        break;
      case 'game.joinSimilar':
        this.sfsRequestService.joinRoomExtensionRequest(
          {
            Id: this.dataFromParent.tbl,
            roomName
          },
          roomName
        );
        break;
      default:
        break;
    }
  }

  triggerLoadEventToParent() {
    const loadEvent = new CustomEvent('ngLoad', {
      detail: { isWindowLoaded: true }
    });
    window.dispatchEvent(loadEvent);
  }

  triggerUnLoadEventToParent() {
    const loadEvent = new CustomEvent('ngUnload', {
      detail: { isWindowLoaded: false, configId: this.dataFromParent.configId }
    });
    window.dispatchEvent(loadEvent);
  }

  viewLeaderboard() {
    this.dialog.open(LeaderboardContestDialogComponent, {
      ...MATDIALOG.gameTableLeaderboardDialog
    });
  }

  seatMe(seatId: number) {
    this.selectedSeatId = parseInt(seatId.toString(), 10);
    const reserveSeatData = {
      seatId,
      reserve: true,
      isWaiting: false
    };
    this.sfsRequestService.seatReservationRequest(reserveSeatData, this.dataFromParent.tbl);
  }

  copyToClipBoard(code: string) {
    this.showCopied = true;
    this.clipboard.copy(code);
    const timer = setTimeout(() => {
      this.showCopied = false;
      clearTimeout(timer);
    }, CopiedTimer);
  }
}
