import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { Subscription } from 'rxjs';

import {
  GlobalConstant,
  MATDIALOG,
  Background,
  Table,
  BroadcastService,
  SettingsService,
  SfsRequestService,
  UserAccountService,
  UtilityService,
  MessageConstant
} from 'projects/shared/src/public-api';
import { Paths, SettingsConstants } from 'projects/shared/src/lib/constants/app-constants';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  BgImg,
  TableImg,
  ThemeResponse
} from 'projects/shared/src/lib/models/response/theme-response.model';
import { SettingsModelNew } from '../../models/settings-new.model';
import { ThemeTablePreviewComponent } from '../theme-table-preview/theme-table-preview.component';
import { TourneyThemeTablePreviewComponent } from '../tourney-theme-table-preview/tourney-theme-table-preview.component';

export interface TableColorThemeModel {
  keyName: string;
  keyValue: string;
  keyStatus: string;
}

export interface CardSideButtonsModel {
  name: string;
  key: string;
}

export interface CardModel {
  id: number;
  cardName: string;
  imageSrc: string;
}

@Component({
  selector: 'app-settings-theme',
  templateUrl: './settings-theme.component.html',
  styleUrls: ['./settings-theme.component.scss']
})
export class SettingsThemeComponent extends SettingsModelNew implements OnInit, OnDestroy {
  @HostBinding('class') class = 'p-rel d-flex flex-column flex-1 pt-1 px-4 pb-4 ovf-y-auto';

  frontBackChecked: boolean = true;

  finalTableChecked: boolean = false;

  arrTableColorTheme: Array<TableColorThemeModel>;

  arrSectionBGTheme: Array<TableColorThemeModel>;

  arrCardBackFace: Array<TableColorThemeModel>;

  arrFourColorDeck: Array<TableColorThemeModel>;

  toastValue: ToastModel;

  myForm: FormGroup;

  disablebtnWithNoActivity: boolean;

  isShowToast: boolean = false;

  isThembtnDisable: boolean = true;

  cardSideButtons: Array<CardSideButtonsModel> = [
    {
      name: 'Front',
      key: 'F'
    },
    {
      name: 'Back',
      key: 'B'
    }
  ];

  cards: Array<CardModel> = [
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

  backCards: Array<CardModel> = [
    {
      id: 0,
      cardName: 'back-pink',
      imageSrc: 'settings/cards/backCards/Pink.svg'
    },
    {
      id: 1,
      cardName: 'back-red',
      imageSrc: 'settings/cards/backCards/Red.svg'
    },
    {
      id: 2,
      cardName: 'back-green',
      imageSrc: 'settings/cards/backCards/Green.svg'
    },
    {
      id: 3,
      cardName: 'back-orange',
      imageSrc: 'settings/cards/backCards/Orange.svg'
    }
  ];

  groupCards: Array<CardModel> = [
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

  selectedTable: Table;

  selectedTableIndex: number;

  SelectedBackgroundIndex: number;

  selectedBackground: Background;

  assetsImagePath = Paths.imagePath;

  themImagePathe = Paths.themePath;

  themeImges: ThemeResponse;

  selected: CardSideButtonsModel;

  private subscription: Subscription;

  constructor(
    public override utilityService: UtilityService,
    public override http: HttpClient,
    public override windowCommService: WindowCommService,
    public override cdr: ChangeDetectorRef,
    public override userAccountService: UserAccountService,
    public override userPreferencesService: UserPreferencesService,
    public override sfsRequestService: SfsRequestService,
    public override broadcastService: BroadcastService,
    public override settingsService: SettingsService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
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
    this.getImges();
    [this.selected] = this.cardSideButtons;

    this.subscription = this.settingsService.userPref.subscribe(
      (params: UserPreferencesService) => {
        const updatedArrTableColorTheme = [...params.arrTableColorTheme];
        const updatedArrSectionBGTheme = [...params.arrSectionBGTheme];
        const updatedArrCardBackFace = [...params.arrCardBackFace];
        const updatedArrFourColorDeck = [...params.arrFourColorDeck];

        if (updatedArrTableColorTheme[0].keyStatus.toString() === 'ACTIVE') {
          this.userPreferencesService = params;
          this.themeImges.data.tableImgs.forEach((item: TableImg) => {
            if (updatedArrTableColorTheme[0].keyValue === '0') {
              updatedArrTableColorTheme[0].keyValue = '1';
              if (item.id.toString() === updatedArrTableColorTheme[0].keyValue.toString()) {
                this.tableColorTheme = Number(updatedArrTableColorTheme[0].keyValue);
                this.selectedTable = item;
                this.selectedTableIndex = this.selectedTable.id - 1;
              }
            } else if (item.id.toString() === updatedArrTableColorTheme[0].keyValue.toString()) {
              this.tableColorTheme = Number(updatedArrTableColorTheme[0].keyValue);
              this.selectedTable = item;
              this.selectedTableIndex = this.selectedTable.id - 1;
            }
          });
        } else {
          const defaultselectedTable = this.themeImges.data.defaultImgs.tableImgId;
          this.tableColorTheme = Number(defaultselectedTable);
          this.selectedTable = this.themeImges.data.tableImgs[defaultselectedTable];
          this.selectedTableIndex = this.selectedTable.id - 1;
        }

        if (updatedArrSectionBGTheme[0].keyStatus.toString() === 'ACTIVE') {
          this.themeImges.data.bgImgs.forEach((item: BgImg) => {
            if (updatedArrSectionBGTheme[0].keyValue === '0') {
              updatedArrSectionBGTheme[0].keyValue = '1';
              if (item.id.toString() === updatedArrSectionBGTheme[0].keyValue.toString()) {
                this.sectionColorTheme = item.id;
                this.selectedBackground = item;
                this.SelectedBackgroundIndex = this.selectedBackground.id - 1;
              }
            } else if (item.id.toString() === updatedArrSectionBGTheme[0].keyValue.toString()) {
              this.sectionColorTheme = item.id;
              this.selectedBackground = item;
              this.SelectedBackgroundIndex = this.selectedBackground.id - 1;
            }
          });
        } else {
          const defaultSelectedBg = this.themeImges.data.defaultImgs.bgImgId;
          this.sectionColorTheme = defaultSelectedBg;
          this.selectedBackground = this.themeImges.data.bgImgs[defaultSelectedBg];
        }

        updatedArrCardBackFace.forEach((card) => {
          if (card.keyStatus.toString() === 'ACTIVE') {
            this.backCards.forEach((item) => {
              if (card.keyValue.toString() === item.id.toString()) {
                this.selectedBackCard = item.cardName;
              }
            });
          }
        });

        updatedArrFourColorDeck.forEach((card) => {
          if (card.keyStatus.toString() === 'ACTIVE') {
            const keyValue = card.keyValue.toString();
            switch (keyValue) {
              case '0':
                this.selectedCard = 0;
                this.selectedCardName = 'classic-cards';
                break;
              case '1':
                this.selectedCard = 1;
                this.selectedCardName = 'four-color-deck';
                break;
              case '2':
                this.selectedCard = 2;
                this.selectedCardName = 'full-color-gloss';
                break;
              default:
                break;
            }
          }
        });

        this.finalTableTheme = params.showFinalTableTheme.keyValue !== 'false';
      }
    );

    this.arrTableColorTheme = [
      {
        keyName: GlobalConstant.TABLE_COLOR_THEME_NAME,
        keyValue: '0',
        keyStatus: 'ACTIVE'
      }
    ];

    this.arrSectionBGTheme = [
      {
        keyName: GlobalConstant.SECTION_BG_THEME_NAME,
        keyValue: '0',
        keyStatus: 'ACTIVE'
      }
    ];

    this.arrCardBackFace = [
      {
        keyName: GlobalConstant.CARD_BACK_FACE_NAME,
        keyValue: '0',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.CARD_BACK_FACE_NAME,
        keyValue: '1',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.CARD_BACK_FACE_NAME,
        keyValue: '2',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.CARD_BACK_FACE_NAME,
        keyValue: '3',
        keyStatus: 'INACTIVE'
      }
    ];

    this.arrFourColorDeck = [
      {
        keyName: GlobalConstant.FOUR_COLOR_DECK_THEME,
        keyValue: '0',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.FOUR_COLOR_DECK_THEME,
        keyValue: '1',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.FOUR_COLOR_DECK_THEME,
        keyValue: '2',
        keyStatus: 'INACTIVE'
      }
    ];
  }

  ngOnInit(): void {
    this.buildForm();
    [this.selectedThemeTab] = this.themeTabs;
    this.selectedCard = 1;
    this.selectedBackCard = this.backCards[0].cardName;

    this.showThemes();

    this.themeSectionTab = 0;
    this.tableColorTheme = 1;
    this.cardBackFaceArray = this.userPreferencesService.arrCardBackFace;
    this.backFaceCardThemeValue = 0;
    this.fourColorDeckArray = this.userPreferencesService.arrFourColorDeck;
    this.fourColorDeckThemeValue = '0';
  }

  override ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSelectedTable(table: Table) {
    this.selectedTable = table;
    this.selectedTableIndex = this.selectedTable.id - 1;
    this.isThembtnDisable = false;
    this.changePreviewTableColor(table.id);
    this.onSettingsChange('fromTheme');
  }

  onSelectedBackground(background: Background) {
    this.selectedBackground = background;
    this.SelectedBackgroundIndex = this.selectedBackground.id - 1;
    this.changePreviewBgColor(background.id);
    this.isThembtnDisable = false;

    this.onSettingsChange('fromTheme');
  }

  selectedCard: number;

  selectedCardName: string = 'classic-cards';

  onSelectedCards(cardIndex: number) {
    this.isThembtnDisable = false;

    if (cardIndex === 0) {
      this.selectedCard = 0;
      this.selectedCardName = 'classic-cards';
    } else if (cardIndex === 1) {
      this.selectedCard = 1;
      this.selectedCardName = 'four-color-deck';
    } else if (cardIndex === 2) {
      this.selectedCard = 2;
      this.selectedCardName = 'full-color-gloss';
    }

    this.setFrontFaceCard(this.selectedCard);
    this.onSettingsChange('fromTheme');
  }

  selectedThemeTab: string;

  themeTabs: string[] = ['Table', 'Background', 'Cards'];

  onThemesTabSelect(tab: string) {
    this.selectedThemeTab = tab;
  }

  buildForm(): void {
    this.myForm = this.formBuilder.group({
      myRadioInput: []
    });
  }

  selectedBackCard: string;

  onSelectBackCard(backCard: number) {
    this.isThembtnDisable = false;
    this.backCards.forEach((item: CardModel) => {
      if (backCard.toString() === item.id.toString()) {
        this.selectedBackCard = item.cardName;
      }
    });
    this.setBackFaceCard(backCard);
    this.onSettingsChange('fromTheme');
  }

  getImges() {
    this.themeImges = this.settingsService.themeData;
  }

  onSave() {
    this.isThembtnDisable = true;

    this.isDisableBtn = true;
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.settingsAppliedMsg,
      flag: SettingsConstants.Flag.SUCCESS
    };
  }

  openThemePreviewDialog(tableImg: string, cardName: string, backCard: string, background: string) {
    this.dialog.open(ThemeTablePreviewComponent, {
      ...MATDIALOG.themePreviewDialog,
      data: {
        tableImg,
        cardName,
        backCard,
        background
      }
    });
  }

  openTourneyThemePreviewDialog(
    tableImg: string,
    cardName: string,
    backCard: string,
    background: string
  ) {
    let updatedBackground = background;
    let updateTableImg = tableImg;
    let updateCardName = cardName;
    let updateBackCard = backCard;

    if (!this.finalTableTheme) {
      updatedBackground = 'settings/tourney-theme-preview.svg';
      updateTableImg = 'settings/tourney-table-preview.svg';
      updateCardName = 'classic-cards';
      updateBackCard = 'back-pink';
    }
    this.dialog.open(TourneyThemeTablePreviewComponent, {
      ...MATDIALOG.themePreviewDialog,
      data: {
        tableImg: updateTableImg,
        cardName: updateCardName,
        backCard: updateBackCard,
        background: updatedBackground
      }
    });
  }

  selectedRadioIndex: number = 1;

  onSelectedRadioIndex(index: number) {
    this.selectedRadioIndex = index;
  }
}
