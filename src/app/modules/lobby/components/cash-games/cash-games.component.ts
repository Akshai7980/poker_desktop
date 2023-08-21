import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { APIResponseCode, Paths, ToastTime } from 'projects/shared/src/lib/constants/app-constants';
import {
  CashGamesList,
  CashGamesListModel,
  CashGamesListResponse,
  Table,
  TableRingList
} from 'projects/shared/src/lib/models/common/lobby.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import {
  BaseResponse,
  CommonService,
  GroupRingListResponse,
  GroupTableListResponse,
  LobbyService,
  LocalStorageService,
  SettingsService,
  SfsRequestService,
  SocketCommService,
  TblArray,
  UserSettingsModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import {
  CommonFilterModel,
  CommonFilterOptionalModel
} from 'src/app/core/models/common-filter-model';

@Component({
  selector: 'app-cash-games',
  templateUrl: './cash-games.component.html',
  styleUrls: ['./cash-games.component.scss']
})
export class CashGamesComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  cashGamesList: CashGamesListResponse = {} as CashGamesListResponse;

  cashGamesListCopy: CashGamesListResponse = {} as CashGamesListResponse;

  selectedGame: CashGamesList;

  showFavorites: boolean = false;

  showTableView: boolean = false;

  subscriptions: Subscription[] = [];

  rRingVariant: string = '';

  userId: number = -1;

  isRecommendedAvailable: boolean = false;

  tableRingList: TableRingList;

  tableRingListCopy: TableRingList;

  isTablesNotAvailable: boolean = false;

  isShowEmptyFaviouriteTable: boolean = false;

  isFiltersApplied: boolean = false;

  tempFilterArr: string[] = ['types', 'blinds', 'userCount-0', 'userCount-6'];

  stacksArr: string[] = ['isMR', 'isFF', 'isStraddle'];

  isUserLoggedIn: boolean = false;

  filters: CommonFilterModel[] = [];

  socketCommRef$: Subscription;

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly localStorageService: LocalStorageService,
    private commonService: CommonService,
    public cdr: ChangeDetectorRef,
    private sfsRequestService: SfsRequestService,
    private authService: AuthService,
    private settingService: SettingsService,
    private readonly socketCommService: SocketCommService
  ) {}

  ngOnInit(): void {
    const userDetails = this.commonService.getUserData();
    this.userId = userDetails && userDetails?.userId ? userDetails.userId : -1;
    this.getFilters();
    this.setSelectedTabAndData();
    this.getJoinedRooms();

    this.isUserLoggedIn = this.localStorageService.getItem('token');

    if (this.isUserLoggedIn) {
      const timeout = setTimeout(() => {
        this.sfsRequestService.getUserSettingsData();
        clearTimeout(timeout);
      }, ToastTime.ONESECOND);
    }
    const loginSub = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      const lobbyCash = setTimeout(() => {
        const userDet = this.localStorageService.getItem('unamedata');
        this.userId = userDet && userDet?.userId ? userDet.userId : -1;
        if (resp) {
          this.lobbyService.addFilters('reset');
          this.sfsRequestService.getUserSettingsData();
        }
        this.ringVariantDetect(this.rRingVariant);

        clearInterval(lobbyCash);
      }, ToastTime.HALFSECOND);
    });

    this.socketCommRef$ = this.socketCommService.socketCommandSubject.subscribe((res: any) => {
      switch (res.cmd) {
        case 'CASH_LOBBY_ROOM':
          res.params.groupArr.forEach((updatedData: any) => {
            this.cashGamesList.allTables.forEach((data: any) => {
              if (updatedData.groupId === data.id) {
                const listData = data;
                listData.userCount = updatedData.userCount;
              }
            });
            this.cashGamesListCopy.allTables.forEach((data: any) => {
              if (updatedData.groupId === data.id) {
                const listData = data;
                listData.userCount = updatedData.userCount;
              }
            });
          });
          this.lobbyService.updatedCashGames.next(this.cashGamesListCopy);
          break;
        case 'CASH_LOBBY_GROUP_ROOM':
          res.params.tableArr.forEach((el: any) => {
            this.tableRingList?.table.forEach((element: any) => {
              if (el.tableId === Number(element.id)) {
                const data = element;
                data.userCount = element.userCount;
              }
            });
          });

          this.lobbyService.updatedRingList.next(this.tableRingList);
          break;
        default:
          break;
      }
    });

    this.subscriptions.push(this.socketCommRef$);

    this.subscriptions.push(loginSub);

    const settingsSub = this.settingService.userSettings.subscribe((data: UserSettingsModel[]) => {
      const tempFiltArr: UserSettingsModel[] = [];
      data.forEach((val: UserSettingsModel) => {
        if (this.tempFilterArr.includes(val.keyName) && val.keyStatus === 'ACTIVE') {
          const tempVal = JSON.parse(val.keyValue);
          if (tempVal.value === '250/500') tempVal.operator = '<=';
          tempFiltArr.push(tempVal);
        }
      });
      this.lobbyService.addFilters(tempFiltArr);
    });

    this.subscriptions.push(settingsSub);
  }

  setSelectedTabAndData() {
    const params = {
      selectedTab: 1
    };
    this.lobbyService.setSelectedTabAndData(params);
  }

  getFilters() {
    const filterSub = this.lobbyService
      .getFilters()
      .subscribe((filters: CommonFilterModel[] | string) => {
        this.setFilters(filters);
      });
    this.subscriptions.push(filterSub);
  }

  setFilters(filters: CommonFilterModel[] | string, type?: string) {
    this.filters = filters as CommonFilterModel[];
    if (filters !== 'reset' && filters?.length > 0) {
      this.isFiltersApplied = true;
      this.lobbyService.filterSelectionChange.next(true);
    } else {
      this.isFiltersApplied = false;
      this.lobbyService.filterSelectionChange.next(false);
    }

    if (!this.tableRingList) return;

    this.isTablesNotAvailable = false;
    this.tableRingListCopy = JSON.parse(JSON.stringify(this.tableRingList));

    if (filters === 'reset') {
      this.cashGamesListCopy.allTables = this.cashGamesList.allTables;
      if (!type) this.lobbyService.cashGamesList.next(this.cashGamesListCopy);
      this.lobbyService.setFilteredTableList(this.tableRingListCopy.table);
      if (this.isUserLoggedIn) {
        this.tempFilterArr.forEach((val: string) => {
          const data = [
            {
              keyName: val,
              keyValue: '',
              keyStatus: 'INACTIVE'
            }
          ];

          this.sfsRequestService.setUserSettingsData(data);
        });
      }
    } else if (filters && filters.length > 0) {
      if (this.isUserLoggedIn) {
        this.tempFilterArr.forEach((val: string) => {
          let idx: number = -1;
          let filterVal: string = '';
          const data = (filters as CommonFilterOptionalModel[]).map(
            (element: CommonFilterOptionalModel, i: number) => {
              if (filterVal === '' && idx === -1) {
                if (element.name === 'userCount' && val === `${element.name}-${element.value}`) {
                  idx = i;
                  filterVal = JSON.stringify(element);
                } else if (
                  val !== 'userCount-0' &&
                  val !== 'userCount-6' &&
                  val !== 'blinds' &&
                  element.name !== 'blinds' &&
                  element.operator === '==' &&
                  this.stacksArr.includes(element.name)
                ) {
                  idx = i;
                  filterVal = JSON.stringify(element);
                } else if (val === element.name) {
                  idx = i;
                  const tempElement = element;
                  if (element.operator === '' || element.value === '250/500') {
                    delete tempElement.operator;
                  }
                  filterVal = JSON.stringify(tempElement);
                }
              }
              return {
                keyName: val,
                keyValue: filterVal,
                keyStatus: idx > -1 ? 'ACTIVE' : 'INACTIVE'
              };
            }
          );
          this.sfsRequestService.setUserSettingsData([data[data.length - 1]]);
        });
      }
      (filters as CommonFilterModel[]).forEach((filter: CommonFilterModel) => {
        if (filter.name === 'blinds') {
          const filteredData: CashGamesList[] = [];
          this.cashGamesList.allTables.forEach((element: CashGamesList) => {
            const filterArray = (filter.value as string).split(',');
            const blinds = (element.blinds as string).split('/').reverse();
            blinds[0] = blinds[0].replace('k', '000');
            blinds[1] = blinds[1].replace('k', '000');

            if (filter.operator && (filter.operator !== '' || filter.value === '250/500')) {
              filterArray.forEach((value: string) => {
                const updatedValue = value.split('/').reverse();
                if (filter.operator === '<=') {
                  if (
                    Number(updatedValue[0].trim()) >= Number(blinds[0].trim()) &&
                    Number(updatedValue[1].trim()) >= Number(blinds[1].trim())
                  ) {
                    filteredData.push(element);
                  }
                } else if (filter.operator === '>=' || filter.value === '250/500') {
                  if (
                    Number(updatedValue[0].trim()) <= Number(blinds[0].trim()) &&
                    Number(updatedValue[1].trim()) <= Number(blinds[1].trim())
                  ) {
                    filteredData.push(element);
                  }
                }
              });
            } else {
              const val1 = filterArray[0].split('/').reverse();
              const val2 = filterArray[1].split('/').reverse();
              if (
                (Number(val1[0].trim()) <= Number(blinds[0].trim()) ||
                  Number(val1[1].trim()) <= Number(blinds[1].trim())) &&
                (Number(val2[0].trim()) >= Number(blinds[0].trim()) ||
                  Number(val2[1].trim()) >= Number(blinds[1].trim()))
              ) {
                filteredData.push(element);
              }
            }
            this.cashGamesListCopy.allTables = filteredData;
            if (
              this.cashGamesList.allTables.length > 0 &&
              this.cashGamesListCopy.allTables.length <= 0
            ) {
              this.isTablesNotAvailable = true;
              if (!this.isShowEmptyFaviouriteTable) {
                this.setSelectedTabAndData();
              }
            } else {
              this.isTablesNotAvailable = false;
            }
          });
        } else if (
          (filter.name === 'isMR' || filter.name === 'isFF' || filter.name === 'isStraddle') &&
          !this.isTablesNotAvailable
        ) {
          const filteredData: Table[] = [];
          this.tableRingListCopy?.table.forEach((element: any) => {
            const field1 = element[filter.name];
            const field2 = filter.value;
            if (Number(field1) === Number(field2)) {
              filteredData.push(element);
            }
          });
          this.tableRingListCopy.table = filteredData;
          this.lobbyService.setFilteredTableList(filteredData);
        } else if (filter.name === 'userCount' && !this.isTablesNotAvailable) {
          const filteredData: Table[] = [];
          this.tableRingListCopy?.table.forEach((element: any) => {
            const field1 = element[filter.name];
            const field2 = filter.value;
            if (Number(field1) !== Number(field2)) {
              filteredData.push(element);
            }
          });
          this.tableRingListCopy.table = filteredData;
          this.lobbyService.setFilteredTableList(filteredData);
        }
        if (!this.isShowEmptyFaviouriteTable || this.isTablesNotAvailable) {
          this.setSelectedTabAndData();
        }
      });
      if (!type) this.lobbyService.cashGamesList.next(this.cashGamesListCopy);
    } else if (
      (this.showFavorites && !this.isShowEmptyFaviouriteTable) ||
      (!this.showFavorites && this.cashGamesList.allTables.length <= 0)
    ) {
      this.isTablesNotAvailable = true;
    }
  }

  showSelectedTableInfo(data: CashGamesList) {
    this.selectedGame = data;
    const tblRingListSub = this.lobbyService
      .getGroupTableList(this.selectedGame.id as string, this.userId)
      .subscribe((resp: BaseResponse<GroupTableListResponse>) => {
        if (resp.code === APIResponseCode.SUCCESS) {
          this.tableRingList = this.convertGroupTableListToViewModel(resp.data);
          this.lobbyService.updatedRingList.next(this.tableRingList);

          this.setFilters(this.filters, 'selectedGame');
        } else {
          this.tableRingList = {} as TableRingList;
        }
      });
    this.subscriptions.push(tblRingListSub);
  }

  ringVariantDetect(event: string) {
    this.rRingVariant = event;
    let ringVariant: string = '';
    switch (event) {
      case 'Hold’em':
        ringVariant = 'HOLDEM';
        break;
      case 'PL Omaha':
        ringVariant = 'OMAHA';
        break;
      case 'PLO 5':
        ringVariant = 'OMAHA_5';
        break;
      case 'PLO 6':
        ringVariant = 'OMAHA_6';
        break;
      default:
        ringVariant = 'PINEAPPLE_CZ';
        break;
    }
    const reqParams = {
      ringVariant,
      chipType: 'cash',
      nid: 0,
      userId: this.userId
    };

    this.getRingGroupList(reqParams);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getRingGroupList(reqParams: CashGamesListModel) {
    const getGroupList = this.lobbyService
      .getGroupRingList(reqParams.ringVariant, reqParams.userId)
      .subscribe(
        (resp: BaseResponse<GroupRingListResponse>) => {
          if (resp.code === APIResponseCode.SUCCESS) {
            this.cashGamesList = this.convertRingGroupToViewModel(resp.data);
            this.cashGamesListCopy = this.convertRingGroupToViewModel(resp.data);

            this.lobbyService.cashGamesList.next(this.cashGamesListCopy);
            this.lobbyService.filterTableData.next(resp.data.favGroups);
            if (this.cashGamesListCopy.allTables.length !== 0) {
              this.showTableView = true;
            } else {
              this.showTableView = false;
            }
            this.lobbyService.addFilters(this.filters);
            this.lobbyService.cashGameData.next(this.cashGamesList);
          } else {
            this.isTablesNotAvailable = true;
            this.cashGamesList = {
              allTables: [],
              favGroups: [],
              groupsJoined: [],
              tablesForYou: [],
              tablesForYouObj: []
            };

            this.lobbyService.selectedTabAndData.next({
              selectedTab: 1,
              selectedTable: 'null'
            });
            this.cashGamesListCopy = this.cashGamesList;
          }
        },
        () => {
          this.isTablesNotAvailable = true;
        }
      );
    this.subscriptions.push(getGroupList);
  }

  convertRingGroupToViewModel(apiResponse: GroupRingListResponse): CashGamesListResponse {
    const viewModel: CashGamesListResponse = {
      tablesForYou: [],
      allTables: [],
      tablesForYouObj: [],
      groupsJoined: [],
      favGroups: []
    };

    apiResponse.groupArr.forEach((element) => {
      const cashGamesList: CashGamesList = {
        id: '',
        remarks: '',
        userCount: '',
        tableCount: '',
        gameType: '',
        bettingRule: '',
        blinds: '',
        minBuyIn: '',
        isFavorite: false,
        isMR: 0,
        isZoom: false,
        isAnonymousTable: false,
        jackpotId: '',
        isRP: false
      };

      const recommendedTable = apiResponse.groupsForYou.find(
        (item) => item.groupId === element.groupId
      );

      cashGamesList.id = element.groupId;
      cashGamesList.remarks = element.groupName;
      cashGamesList.userCount = element.userCount;
      cashGamesList.tableCount = element.tableCount;
      cashGamesList.minBuyIn = element.minBuyIn;
      cashGamesList.blinds = `${element.sb}/${element.bb}`;
      cashGamesList.isRecommended = !!recommendedTable;
      cashGamesList.isFavorite = true;
      if (recommendedTable) cashGamesList.isRP = recommendedTable.isRP;

      viewModel.allTables.push(cashGamesList);

      if (recommendedTable) {
        viewModel.tablesForYou.push({
          id: recommendedTable.groupId,
          isRP: recommendedTable.isRP
        });
      }
    });

    viewModel.favGroups = apiResponse.favGroups;
    this.isRecommendedAvailable = viewModel.tablesForYou.length > 0;
    return viewModel;
  }

  convertGroupTableListToViewModel(apiResponse: GroupTableListResponse): TableRingList {
    const viewModel: TableRingList = {
      gameType: '',
      bettingRule: '',
      blinds: '',
      bonus: '',
      isAnonynoumsTable: false,
      jackpotId: '',
      isAutoBuyin: false,
      isAntiBumHunting: false,
      avgStack: '',
      fee: '',
      id: 0,
      remarks: '',
      maxPlayers: 0,
      ringVariant: '',
      isZoom: false,
      userCount: 0,
      table: []
    };

    apiResponse.tblArr.forEach((element) => {
      const table: Table = {
        id: element.tableId.toString(),
        userCount: element.userCount,
        avgStack: element.avgStack,
        fee: element.minBuyin.toString(),
        isMR: element.isMR,
        isFF: element.isFF,
        isStraddle: element.isStraddle,
        maxPlayers: element.maxUserCount
      };
      viewModel.table.push(table);
    });
    viewModel.userCount = apiResponse.groupInfo.userCount;

    return viewModel;
  }

  getTableDetails(table: TblArray) {
    const params = {
      selectedTab: 1,
      data: {
        selectedTableId: table.tableId
      }
    };
    this.lobbyService.setSelectedTabAndData(params);
  }

  showEmptyFavouriteTable(event: boolean) {
    this.isShowEmptyFaviouriteTable = event;
    this.isTablesNotAvailable = false;
    if (this.showFavorites && !this.isShowEmptyFaviouriteTable) {
      this.isTablesNotAvailable = true;
    }
    this.cdr.detectChanges();
  }

  isFavListOpened(event: boolean) {
    this.showFavorites = event;
    if (this.showFavorites) {
      this.lobbyService.selectedTabAndData.next({
        selectedTab: 1,
        selectedTable: 'null'
      });
    }
    if (!this.isShowEmptyFaviouriteTable || this.isTablesNotAvailable) {
      this.lobbyService.cashGamesList.next(this.cashGamesList);
    }
  }

  getJoinedRooms() {
    const joinedRoomsSfs = setTimeout(() => {
      this.sfsRequestService.getUserJoinedList();
      clearInterval(joinedRoomsSfs);
    }, ToastTime.TWOSECOND);
  }
}
