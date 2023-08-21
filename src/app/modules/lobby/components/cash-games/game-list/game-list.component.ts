import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATDIALOG } from 'projects/cashier/src/lib/constants/dialog.constants';
import {
  CashGamesHoldemModel,
  CashGamesList,
  CashGamesListResponse
} from 'projects/shared/src/lib/models/common/lobby.model';
import { AddFavoriteModel } from 'projects/shared/src/lib/models/view/addFavourite.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  CommonService,
  LobbyService,
  LocalStorageService,
  Paths,
  SfsRequestService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { InfoPopupComponent } from '../../../dialogs/info-popup/info-popup.component';
import { jsonString } from '../../../static/data';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameListComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-scroll';

  assetsImagePath = Paths.imagePath;

  showFavorites: boolean = false;

  recommendedGames: Array<CashGamesHoldemModel> = [];

  favoriteGames: Array<CashGamesList> = [];

  @Input() cashGamesList: CashGamesList[] = [];

  @Input() isFavoriteSelected = false;

  @Input() rRingVariant? = 'Hold’em';

  @Input() isRecommendedAvailable = false;

  @Output() selectedGameDetails = new EventEmitter();

  @Output() isFaviouriteListEmpty = new EventEmitter();

  @Output() isTableEmpty = new EventEmitter();

  fav: any;

  subscription: Subscription[] = [];

  sampleRecords: any;

  favoriteFilterData: Array<number> = [];

  isUserLoggedIn: boolean;

  isShowFavIcon: boolean = true;

  remarksAscend: boolean = true;

  blindsAscend: boolean = true;

  minBuyInAscend: boolean = true;

  userCountAscend: boolean = false;

  tableCountAscend: boolean = true;

  userId: number;

  private addFavouriteModel: AddFavoriteModel = new AddFavoriteModel(0, 0);

  constructor(
    public dialog: MatDialog,
    public lobbyService: LobbyService,
    public sfsRequestService: SfsRequestService,
    public localStorageService: LocalStorageService,
    public cdr: ChangeDetectorRef,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    let currentValue: any;
    Object.entries(changes).forEach(([propName, change]) => {
      currentValue = JSON.stringify(change.currentValue);
      if (propName === 'rRingVariant') {
        this.sortByRingVariant(JSON.parse(currentValue), '');
      }
    });
  }

  ngOnInit(): void {
    const userDetails = this.commonService.getUserData();
    this.userId = userDetails && userDetails?.userId ? userDetails.userId : -1;
    this.sampleRecords = jsonString;
    const userSub = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp) {
        this.isShowFavIcon = true;
      } else {
        this.isShowFavIcon = false;
        this.lobbyService.addFilters('reset');
      }
    });

    this.isUserLoggedIn = this.localStorageService.getItem('token');
    if (!this.isUserLoggedIn) {
      this.isShowFavIcon = false;
    } else {
      this.isShowFavIcon = true;
    }
    this.sortByRingVariant('userCount', 'number');

    this.subscription.push(userSub);
    this.isUserLoggedIn = this.localStorageService.getItem('token');
    if (!this.isUserLoggedIn) {
      this.isShowFavIcon = false;
    } else {
      this.isShowFavIcon = true;
    }

    const updatedcashGameListSub = this.lobbyService.updatedCashGames.subscribe(
      (list: CashGamesListResponse) => {
        this.cashGamesList = list.allTables;

        this.favoriteFilterData = list.favGroups;
        this.showFavourite();

        this.sortFavorites(this.isFavoriteSelected);
        this.showGameTables(this.cashGamesList[0], 'cashGamesList');
        this.cdr.detectChanges();
      }
    );
    this.subscription.push(updatedcashGameListSub);

    const cashGameListSub = this.lobbyService.cashGamesList.subscribe(
      (list: CashGamesListResponse) => {
        this.cdr.detectChanges();
        this.cashGamesList = list.allTables;
        if (this.cashGamesList && this.cashGamesList.length !== 0) {
          this.favoriteFilterData = list.favGroups;
          this.showFavourite();

          this.sortFavorites(this.isFavoriteSelected);
          this.showGameTables(this.cashGamesList[0], 'cashGamesList');
        }
      }
    );

    this.subscription.push(cashGameListSub);

    const dataSub = this.lobbyService.getSelectedTabAndData().subscribe((res) => {
      if (res.selectedTable && res.selectedTable === 'null' && this.fav.length > 0) {
        this.showGameTables(this.fav[0], 'fav');
      }
    });

    this.subscription.push(dataSub);
  }

  showFavourite() {
    this.cashGamesList = this.cashGamesList.map((val: any) => {
      if (this.favoriteFilterData.includes(Number(val.id))) {
        return { ...val, isFavorite: true };
      }
      return { ...val, isFavorite: false };
    });
    this.filterFavList();
  }

  showGameTables(game: CashGamesList, type: string) {
    let updatedCashGamesList: CashGamesList[] = [];
    if (type === 'fav') {
      updatedCashGamesList = this.fav;
    } else {
      updatedCashGamesList = this.cashGamesList;
    }
    updatedCashGamesList = updatedCashGamesList.map((data) => ({
      ...data,
      isSelected: data.id === game.id
    }));
    if (type === 'fav') {
      this.fav = updatedCashGamesList;
    } else {
      this.cashGamesList = updatedCashGamesList;
    }

    const selectedGame: any = updatedCashGamesList.find((item) => item.isSelected === true);
    if (selectedGame) {
      this.selectedGameDetails.emit(selectedGame);
    }
  }

  sortFavorites(isOptionChecked: boolean) {
    this.showFavorites = isOptionChecked;
    this.showFavourite();
  }

  private filterFavList() {
    this.fav = this.cashGamesList.filter((val) => val.isFavorite);
    if (this.fav.length > 0) {
      this.showGameTables(this.fav[0], 'fav');
      this.isFaviouriteListEmpty.emit(true);
    } else {
      this.isFaviouriteListEmpty.emit(false);
    }
  }

  toggleFavorite(id: number | string, favorite: boolean) {
    this.addFavouriteModel.groupId = Number(id);
    this.addFavouriteModel.playerId = this.userId;

    if (!favorite) {
      const favSub = this.lobbyService.addFavorite(this.addFavouriteModel).subscribe((res: any) => {
        this.favoriteFilterData.push(res.data.groupId);
        this.showFavourite();
      });
      this.subscription.push(favSub);
    } else {
      const dialogRef = this.dialog.open(InfoPopupComponent, {
        ...MATDIALOG.actionDialog,
        data: { from: 'CASH_GAMES' }
      });
      const dialofSub = dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const delSub = this.lobbyService
            .deleteFavorite(this.addFavouriteModel)
            .subscribe((res: any) => {
              const index = this.favoriteFilterData.indexOf(Number(res.data.groupId));

              this.favoriteFilterData.splice(index, 1);

              this.showFavourite();
            });
          this.subscription.push(delSub);
        }
      });
      this.subscription.push(dialofSub);
    }
  }
  sortByRingVariant(ringVariant: string, ringVariantType: string) {
    if (ringVariantType === 'string') this.sortCashGamesStrings(ringVariant);
    else if (ringVariantType === 'number') this.sortCashGamesNumbers(ringVariant);
    this.cdr.detectChanges();
  }

  sortCashGamesStrings(parameter: any) {
    const currentList = [...this.cashGamesList];
    const currentFavList = [...this.fav];

    this.cashGamesList = this.cashGamesList.sort((a: any, b: any) =>
      a[parameter].toString().localeCompare(b[parameter].toString())
    );

    this.fav = this.fav.sort((a: any, b: any) =>
      a[parameter].toString().localeCompare(b[parameter].toString())
    );

    if (JSON.stringify(this.cashGamesList) === JSON.stringify(currentList)) {
      this.cashGamesList = this.cashGamesList.sort((a: any, b: any) =>
        b[parameter].toString().localeCompare(a[parameter].toString())
      );
    }

    if (JSON.stringify(this.fav) === JSON.stringify(currentFavList)) {
      this.fav = this.fav.sort((a: any, b: any) =>
        b[parameter].toString().localeCompare(a[parameter].toString())
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  sortCashGamesNumbers(parameter: string) {
    this.fav = this.fav ? this.fav : [];
    const currentList = [...this.cashGamesList];
    const currentFavList = [...this.fav];

    this.cashGamesList = this.cashGamesList.sort((a: any, b: any) => {
      const aParam = a[parameter].toString().replace('k', '000');
      const bParam = b[parameter].toString().replace('k', '000');
      return parseInt(aParam, 10) - parseInt(bParam, 10);
    });

    this.fav = this.fav.sort((a: any, b: any) => {
      const aParam = a[parameter].toString().replace('k', '000');
      const bParam = b[parameter].toString().replace('k', '000');
      return parseInt(bParam, 10) - parseInt(aParam, 10);
    });

    if (JSON.stringify(this.cashGamesList) === JSON.stringify(currentList)) {
      this.cashGamesList = this.cashGamesList.sort((a: any, b: any) => {
        const aParam = a[parameter].toString().replace('k', '000');
        const bParam = b[parameter].toString().replace('k', '000');
        return parseInt(bParam, 10) - parseInt(aParam, 10);
      });
    }
    if (JSON.stringify(this.fav) === JSON.stringify(currentFavList)) {
      this.fav = this.fav.sort((a: any, b: any) => {
        const aParam = a[parameter].toString().replace('k', '000');
        const bParam = b[parameter].toString().replace('k', '000');
        return parseInt(bParam, 10) - parseInt(aParam, 10);
      });
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }
}
