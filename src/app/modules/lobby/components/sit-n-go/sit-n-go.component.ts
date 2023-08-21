import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SngGamesDataResponse } from 'projects/shared/src/lib/models/response/sng-game-data.response.model';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import {
  APIResponseCode,
  BaseResponse,
  CashierDataResponse,
  CommonService,
  LobbyService,
  MATDIALOG,
  Paths,
  SettingsService,
  SfsRequestService,
  // SocketCommService,
  UserSettingsModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { CommonFilterModel } from 'src/app/core/models/common-filter-model';
import { CoreCommonService } from 'src/app/core/services/core-common.service';

import { FiltersComponent } from '../../dialogs/filters/filters.component';
import { MyTicketsAndOffersComponent } from '../../dialogs/my-tickets-and-offers/my-tickets-and-offers.component';
import { RegistrationComponent } from '../../dialogs/registration/registration.component';
import { SngList, SngListViewModel } from '../../models/view/sng-view-model';

@Component({
  selector: 'app-sit-n-go',
  templateUrl: './sit-n-go.component.html',
  styleUrls: ['./sit-n-go.component.scss']
})
export class SitNGoComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  Array = Array;

  subscriptions: Subscription[] = [];

  isTablesNotAvailable: boolean = false;

  sngViewModel = new SngListViewModel([], [], []);

  sngViewModelCopy = new SngListViewModel([], [], []);

  joinedSNGTableCopy: Array<SngList>;

  joinTicketSNGTableCopy: Array<SngList>;

  runningOrFinishedSNGTableCopy: Array<SngList>;

  filters: any;

  isFilterSelected: boolean = false;

  cashData: CashierDataResponse;

  registeringCopy: any[];

  userId: number = -1;

  tempFilterArr: string[] = [
    'maxPlayers',
    '501-1,000',
    '1,000-1,500',
    '101-500',
    '>=1,501',
    '<=100'
  ];

  isUserLoggedIn: boolean = false;

  nameAscend: boolean = false;

  joinedPlayersAscend: boolean = false;

  prizesAscend: boolean = false;

  feeAscend: boolean = false;

  isShowMyTiketsAndOffers: boolean = false;

  socketCommRef$: Subscription;

  constructor(
    public readonly dialog: MatDialog,
    private readonly lobbyService: LobbyService,
    private coreCommonService: CoreCommonService,
    public cdr: ChangeDetectorRef,
    private sfsRequestService: SfsRequestService,
    private settingService: SettingsService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private commonService: CommonService // private readonly socketCommService: SocketCommService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.localStorageService.getItem('token');

    const userDetails = this.commonService.getUserData();
    this.userId = userDetails && userDetails?.userId ? userDetails.userId : -1;

    if (this.isUserLoggedIn) {
      this.isShowMyTiketsAndOffers = true;
      this.sfsRequestService.getUserSettingsData();
    } else {
      this.isShowMyTiketsAndOffers = false;
    }
    const loginSub = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp) {
        this.lobbyService.addFilters('reset');
        this.sfsRequestService.getUserSettingsData();
        this.isShowMyTiketsAndOffers = true;
      } else {
        this.isShowMyTiketsAndOffers = false;
      }
    });

    this.subscriptions.push(loginSub);
    this.getFilters();
    this.getSngTableData();
    this.getCashierData();

    const settingsSub = this.settingService.userSettings.subscribe((data: UserSettingsModel[]) => {
      const tempFiltArr: any = [];
      data.forEach((val: any) => {
        if (this.tempFilterArr.includes(val.keyName) && val.keyStatus === 'ACTIVE') {
          if (val.keyName === 'maxPlayers') {
            const filter = {
              name: val.keyName,
              value: val.keyValue,
              operator: '=='
            };
            tempFiltArr.push(filter);
          } else {
            const filter = {
              name: 'amount',
              label: val.keyName,
              operator: val.keyValue,
              value: val.keyName === '>=1,501' ? '1501' : '100'
            };
            tempFiltArr.push(filter);
          }
        }
      });
      this.lobbyService.addFilters(tempFiltArr);
    });
    this.subscriptions.push(settingsSub);

    // no need to remove the code once socket connection done

    // this.socketCommRef$ = this.socketCommService.socketCommandSubject.subscribe((res: any) => {
    //   switch (res.cmd) {
    //     case 'SNG_lobby':
    //       res.params.allTables.forEach((updatedData: any) => {

    //       });

    //       break;
    //     default:
    //       break;
    //   }
    // });
  }

  getSub(a: number, b: number) {
    return a - b;
  }

  onClickSng(data: SngList): void {
    this.lobbyService.detectSngRowClick.next(data);
    this.lobbyService.joinTable(data.Id);
  }

  getFilters() {
    const filterSub = this.lobbyService.getFilters().subscribe((filters: any) => {
      this.filters = filters;
      if (filters !== 'reset' && filters && filters.length > 0) {
        this.isFilterSelected = true;
      } else {
        this.isFilterSelected = false;
      }
      this.joinedSNGTableCopy = [...this.sngViewModel.joinedSNGTable];
      this.joinTicketSNGTableCopy = [...this.sngViewModel.joinTicketSNGTable];
      this.runningOrFinishedSNGTableCopy = [...this.sngViewModel.runningOrFinishedSNGTable];
      this.registeringCopy = [...this.sngViewModel.registering];

      if (filters === 'reset') {
        this.sngViewModel.registering = this.sngViewModelCopy.registering;
        this.sngViewModel.runningOrFinishedSNGTable =
          this.sngViewModelCopy.runningOrFinishedSNGTable;
        this.sngViewModel.joinTicketSNGTable = this.sngViewModelCopy.joinTicketSNGTable;
        this.sngViewModel.joinedSNGTable = this.sngViewModelCopy.joinedSNGTable;
        if (this.isUserLoggedIn) {
          this.tempFilterArr.forEach((val: any) => {
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
        if (
          this.sngViewModel.joinedSNGTable.length === 0 &&
          this.sngViewModel.joinTicketSNGTable.length === 0 &&
          this.sngViewModel.registering.length === 0 &&
          this.sngViewModel.runningOrFinishedSNGTable.length === 0
        ) {
          this.isTablesNotAvailable = true;
          this.lobbyService.isSngTableEmpty.next(false);
        } else {
          this.isTablesNotAvailable = false;
          this.lobbyService.isSngTableEmpty.next(false);
        }
      } else if (filters && filters.length > 0) {
        this.isTablesNotAvailable = false;
        if (this.isUserLoggedIn) {
          this.tempFilterArr.forEach((val: any) => {
            let idx: number = -1;
            let filterVal = '';
            filters.forEach((element: any, i: number) => {
              if (val === 'maxPlayers' && val === element.name) {
                idx = i;
                filterVal = element.value;
              } else if (val !== 'maxPlayers' && val === element.label) {
                idx = i;
                filterVal = element.operator;
              }
            });
            const data = [
              {
                keyName: val,
                keyValue: filterVal,
                keyStatus: idx > -1 ? 'ACTIVE' : 'INACTIVE'
              }
            ];
            this.sfsRequestService.setUserSettingsData(data);
          });
        }

        const joinedSNG = this.sngViewModelCopy.joinedSNGTable;
        const joinedTicketSNG = this.sngViewModelCopy.joinTicketSNGTable;
        const runningOrFinishedSNG = this.sngViewModelCopy.runningOrFinishedSNGTable;
        const { registering } = this.sngViewModelCopy;

        let joinedSNGFilterData: SngList[] = [];
        let joinedTicketSNGFilterData: SngList[] = [];
        let runningOrFinishedSNGFilterData: SngList[] = [];
        let registeringFilterData: SngList[] = [];
        let joinedSNGArray: SngList[] = [];
        let joinedTicketSNGArray: SngList[] = [];
        let runningOrFinishedSNGArray: SngList[] = [];
        let registeringArray: SngList[] = [];
        let isMaxPlayerSelected: boolean = false;
        let isAmountSelected: boolean = false;

        filters.forEach((val: CommonFilterModel) => {
          if (val.name === 'maxPlayers') {
            isMaxPlayerSelected = true;
            joinedSNGFilterData = [...joinedSNGFilterData, ...this.filterData(joinedSNG, val)];
            joinedTicketSNGFilterData = [
              ...joinedTicketSNGFilterData,
              ...this.filterData(joinedTicketSNG, val)
            ];
            runningOrFinishedSNGFilterData = [
              ...runningOrFinishedSNGFilterData,
              ...this.filterData(runningOrFinishedSNG, val)
            ];
            registeringFilterData = [
              ...registeringFilterData,
              ...this.filterData(registering, val)
            ];
          } else if (val.name === 'amount') {
            joinedSNGArray = [...joinedSNGArray, ...this.filterData(joinedSNG, val)];
            joinedTicketSNGArray = [
              ...joinedTicketSNGArray,
              ...this.filterData(joinedTicketSNG, val)
            ];
            runningOrFinishedSNGArray = [
              ...runningOrFinishedSNGArray,
              ...this.filterData(runningOrFinishedSNG, val)
            ];
            registeringArray = [...registeringArray, ...this.filterData(registering, val)];
            isAmountSelected = true;
          }
        });

        this.sngViewModel.joinedSNGTable = this.getFinalResult(
          joinedSNGFilterData,
          joinedSNGArray,
          isMaxPlayerSelected && isAmountSelected
        );
        this.sngViewModel.joinTicketSNGTable = this.getFinalResult(
          joinedTicketSNGFilterData,
          joinedTicketSNGArray,
          isMaxPlayerSelected && isAmountSelected
        );
        this.sngViewModel.runningOrFinishedSNGTable = this.getFinalResult(
          runningOrFinishedSNGFilterData,
          runningOrFinishedSNGArray,
          isMaxPlayerSelected && isAmountSelected
        );
        this.sngViewModel.registering = this.getFinalResult(
          registeringFilterData,
          registeringArray,
          isMaxPlayerSelected && isAmountSelected
        );

        if (
          this.sngViewModel.joinedSNGTable.length === 0 &&
          this.sngViewModel.joinTicketSNGTable.length === 0 &&
          this.sngViewModel.registering.length === 0 &&
          this.sngViewModel.runningOrFinishedSNGTable.length === 0
        ) {
          this.isTablesNotAvailable = true;
          this.lobbyService.isSngTableEmpty.next(true);
        }
      }
    });

    this.subscriptions.push(filterSub);
  }

  sortList(param: keyof SngList) {
    const currentJoinTicketSNGTable = [...this.sngViewModel.joinedSNGTable];
    const currentJoinedSNGTable = [...this.sngViewModel.joinTicketSNGTable];
    const currentRunningOrFinishedSNGTable = [...this.sngViewModel.runningOrFinishedSNGTable];
    const currentRegistering = [...this.sngViewModel.registering];

    this.sngViewModel.joinedSNGTable = this.sngViewModel.joinedSNGTable.sort(
      (a: SngList, b: SngList) => Number(b[param]) - Number(a[param])
    );
    this.sngViewModel.joinTicketSNGTable = this.sngViewModel.joinTicketSNGTable.sort(
      (a: SngList, b: SngList) => Number(b[param]) - Number(a[param])
    );
    this.sngViewModel.runningOrFinishedSNGTable = this.sngViewModel.runningOrFinishedSNGTable.sort(
      (a: SngList, b: SngList) => Number(b[param]) - Number(a[param])
    );
    this.sngViewModel.registering = this.sngViewModel.registering.sort(
      (a: SngList, b: SngList) => Number(b[param]) - Number(a[param])
    );

    if (
      JSON.stringify(currentJoinTicketSNGTable) === JSON.stringify(this.sngViewModel.joinedSNGTable)
    ) {
      this.sngViewModel.joinedSNGTable = this.sngViewModel.joinedSNGTable.sort(
        (a: SngList, b: SngList) => Number(a[param]) - Number(b[param])
      );
    }

    if (
      JSON.stringify(currentJoinedSNGTable) === JSON.stringify(this.sngViewModel.joinTicketSNGTable)
    ) {
      this.sngViewModel.joinTicketSNGTable = this.sngViewModel.joinTicketSNGTable.sort(
        (a: any, b: any) => a[param] - b[param]
      );
    }

    if (
      JSON.stringify(currentRunningOrFinishedSNGTable) ===
      JSON.stringify(this.sngViewModel.runningOrFinishedSNGTable)
    ) {
      this.sngViewModel.runningOrFinishedSNGTable =
        this.sngViewModel.runningOrFinishedSNGTable.sort((a: any, b: any) => a[param] - b[param]);
    }

    if (JSON.stringify(currentRegistering) === JSON.stringify(this.sngViewModel.registering)) {
      this.sngViewModel.registering = this.sngViewModel.registering.sort(
        (a: any, b: any) => a[param] - b[param]
      );
    }

    const value = Reflect.get(this, `${param}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${param}Ascend`, !value);
    }
  }

  sortStringList(param: string) {
    const currentJoinTicketSNGTable = [...this.sngViewModel.joinedSNGTable];
    const currentJoinedSNGTable = [...this.sngViewModel.joinTicketSNGTable];
    const currentRunningOrFinishedSNGTable = [...this.sngViewModel.runningOrFinishedSNGTable];
    const currentRegistering = [...this.sngViewModel.registering];

    this.sngViewModel.joinedSNGTable = this.sngViewModel.joinedSNGTable.sort((a: any, b: any) =>
      b[param].toString().localeCompare(a[param].toString())
    );
    this.sngViewModel.joinTicketSNGTable = this.sngViewModel.joinTicketSNGTable.sort(
      (a: any, b: any) => b[param].toString().localeCompare(a[param].toString())
    );
    this.sngViewModel.runningOrFinishedSNGTable = this.sngViewModel.runningOrFinishedSNGTable.sort(
      (a: any, b: any) => b[param].toString().localeCompare(a[param].toString())
    );
    this.sngViewModel.registering = this.sngViewModel.registering.sort((a: any, b: any) =>
      b[param].toString().localeCompare(a[param].toString())
    );

    if (
      JSON.stringify(currentJoinTicketSNGTable) === JSON.stringify(this.sngViewModel.joinedSNGTable)
    ) {
      this.sngViewModel.joinedSNGTable = this.sngViewModel.joinedSNGTable.sort((a: any, b: any) =>
        a[param].toString().localeCompare(b[param].toString())
      );
    }

    if (
      JSON.stringify(currentJoinedSNGTable) === JSON.stringify(this.sngViewModel.joinTicketSNGTable)
    ) {
      this.sngViewModel.joinTicketSNGTable = this.sngViewModel.joinTicketSNGTable.sort(
        (a: any, b: any) => a[param].toString().localeCompare(b[param].toString())
      );
    }

    if (
      JSON.stringify(currentRunningOrFinishedSNGTable) ===
      JSON.stringify(this.sngViewModel.runningOrFinishedSNGTable)
    ) {
      this.sngViewModel.runningOrFinishedSNGTable =
        this.sngViewModel.runningOrFinishedSNGTable.sort((a: any, b: any) =>
          a[param].toString().localeCompare(b[param].toString())
        );
    }

    if (JSON.stringify(currentRegistering) === JSON.stringify(this.sngViewModel.registering)) {
      this.sngViewModel.registering = this.sngViewModel.registering.sort((a: any, b: any) =>
        a[param].toString().localeCompare(b[param].toString())
      );
    }
    const value = Reflect.get(this, `${param}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${param}Ascend`, !value);
    }
  }

  getFinalResult(arr1: SngList[], arr2: SngList[], isMultiSelect?: boolean) {
    const finalArrMap: any = {};
    let finalArrayCopy: SngList[] = [];
    if (
      !isMultiSelect &&
      ((arr1.length > 0 && arr2.length <= 0) || (arr2.length > 0 && arr1.length <= 0))
    ) {
      finalArrayCopy = [...arr1, ...arr2];
    }
    arr1.forEach((element1) => {
      arr2.forEach((element2) => {
        if (element1.Id === element2.Id) {
          if (!finalArrMap[element1.Id]) {
            finalArrayCopy.push(element1);
            finalArrMap[element1.Id] = element1.Id;
          }
        }
      });
    });
    return finalArrayCopy;
  }

  filterData(data: SngList[], filter: CommonFilterModel) {
    const filteredData: SngList[] = [];
    data.forEach((element: SngList) => {
      const field1 = filter.name === 'maxPlayers' ? element.maxPlayers : element.fee;
      const { operator } = filter;
      const field2 = filter.value.toString().replace(',', '');
      const operators = operator.split('-');
      if (operator === '==' && Number(field1) === Number(field2)) {
        filteredData.push(element);
      } else if (operator === '>=' && Number(field1) >= Number(field2)) {
        filteredData.push(element);
      } else if (operator === '<=' && Number(field1) <= Number(field2)) {
        filteredData.push(element);
      } else if (operators[0] === '>=' && operators[1] === '<=') {
        const field = filter.label.split('-');
        field[0] = field[0].toString().replace(',', '');
        field[1] = field[1].toString().replace(',', '');
        if (Number(field1) >= Number(field[0]) && Number(field1) <= Number(field[1])) {
          filteredData.push(element);
        }
      }
    });
    return filteredData;
  }

  openMyTicketsAndOffersDialog() {
    this.coreCommonService.loginForCTA(() => {
      const getCashierData = this.lobbyService
        .getCashierData()
        .subscribe((resp: BaseResponse<CashierDataResponse>) => {
          this.dialog.open(MyTicketsAndOffersComponent, {
            data: { totalAmount: resp.data.total, from: 'SNG' },
            ...MATDIALOG.myTicketsAndOffersDialog
          });
        });

      this.subscriptions.push(getCashierData);
    });
  }

  openFilterDialog() {
    this.lobbyService.addFilters(this.filters);
    const dialogRef = this.dialog.open(FiltersComponent, {
      ...MATDIALOG.filterDialog,
      data: {
        from: 'SNG',
        filters: this.lobbyService.lastSelectedFilter
      }
    });

    const dialogRefSub = dialogRef.afterClosed().subscribe((val) => {
      this.filters = val;
    });
    this.subscriptions.push(dialogRefSub);
  }

  openRegistrationDialog(data: any) {
    if (data.status === 'registering') {
      let val = '';
      const tickets = data.buyInArr.map((item: any) => item.ticketName);
      const dataToSend = {
        userBalance: this.cashData && this.cashData.total ? this.cashData.total : 0,
        minBuyIn: data.buyInArr[0].amount,
        fee: data.buyInArr[0].fee,
        hasTicket: data.buyInArr.length > 1,
        hasTicketForSNG: data.buyInArr.length > 1,
        tickets: tickets.filter((item: any) => item !== undefined),
        name: data.name
      };

      if (dataToSend.userBalance < dataToSend.minBuyIn) {
        val = 'INSUFFICIENT_BALANCE';
      } else {
        val = 'SUFFICIENT_BALANCE';
      }

      this.dialog.open(RegistrationComponent, {
        ...MATDIALOG.RegistrationDialog,
        data: { from: val, component: 'SIT_AND_GO', details: dataToSend }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getSngTableData() {
    const sngListSub = this.lobbyService.getSngTableList(this.userId).subscribe(
      (res: BaseResponse<SngGamesDataResponse>) => {
        if (res.code === APIResponseCode.SUCCESS) {
          this.sngViewModel.convertToViewModel(res?.data);
          this.sngViewModelCopy = JSON.parse(JSON.stringify(this.sngViewModel));
          this.lobbyService.addFilters(this.filters);

          const defaultTableToShow = this.sngViewModel.getDefaultTable();
          if (defaultTableToShow) {
            this.lobbyService.detectSngRowClick.next(defaultTableToShow);
            this.lobbyService.joinTable(defaultTableToShow.Id);
          }
        }
      },
      (err) => {
        this.isTablesNotAvailable = true;
      }
    );
    this.subscriptions.push(sngListSub);
  }

  sortSngList(param: keyof SngList) {
    this.sortList(param);
  }

  sortSngStringList(param: string) {
    this.sortStringList(param);
  }

  getCashierData() {
    const getCashierData = this.lobbyService
      .getCashierData()
      .subscribe((resp: BaseResponse<CashierDataResponse>) => {
        this.cashData = resp.data;
      });
    this.subscriptions.push(getCashierData);
  }
}
