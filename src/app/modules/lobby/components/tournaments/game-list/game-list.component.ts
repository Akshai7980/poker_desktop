import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  APIResponseCode,
  FilterConstant,
  LobbyMtt,
  LobbyService,
  LocalStorageService,
  MATDIALOG,
  Paths,
  SettingsService,
  SfsRequestService,
  SocketCommService,
  ToastTime,
  UserSettingsModel
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { BaseResponse } from 'projects/profile/src/lib/models/common/base-response.model';
import {
  MttListResponse,
  TableTournament
} from 'projects/shared/src/lib/models/common/lobby.model';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';
import { IconsLegendComponent } from '../../../dialogs/icons-legend/icons-legend.component';
import { InfoPopupComponent } from '../../../dialogs/info-popup/info-popup.component';
import { RegistrationComponent } from '../../../dialogs/registration/registration.component';
import { LobbyTournamentMttSocketResModel } from '../../../models/view/lobby-model';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameListComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-scroll';

  assetsImagePath = Paths.imagePath;

  tournamentList: MttListResponse = {} as MttListResponse;

  isShowEmptyTable: boolean = false;

  filters: any = {
    selectedGameType: [],
    selectedStatus: [],
    selectedBuyInTournament: [],
    selectedFormat: []
  };

  sortOptions = {
    key: '',
    sortOrder: ''
  };

  gameTypes: string[] = [FilterConstant.holdem, FilterConstant.plOmaga];

  statusList: string[] = [
    FilterConstant.registered,
    FilterConstant.registering,
    FilterConstant.lateReg,
    FilterConstant.playing,
    FilterConstant.running,
    FilterConstant.finished
  ];

  buyInsTornaments: string[] = [
    '<= ₹ 100',
    '₹ 101 - ₹ 500',
    '₹ 501 - ₹ 1,000',
    '₹ 1,001 - ₹ 5,000',
    '₹ 5,000 & Above',
    FilterConstant.ticket,
    FilterConstant.freeroll
  ];

  formatList: string[] = [
    FilterConstant.reentry,
    FilterConstant.rebuyAndAddon,
    FilterConstant.knockout,
    FilterConstant.winTheButton,
    FilterConstant.freezeout
  ];

  selectedGame: TableTournament = {} as TableTournament;

  @Output() isFilterActivatedEmit: EventEmitter<boolean>;

  dataCount: number = 0;

  tournamentMttListount: number = 0;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private lobbyService: LobbyService,
    private cdr: ChangeDetectorRef,
    private settingService: SettingsService,
    private sfsRequestService: SfsRequestService,
    private localStorageService: LocalStorageService,
    public socketCommService: SocketCommService
  ) {}

  tournamentTableHeaders: any[] = [
    {
      title: 'Tournament NAME',
      isIcon: true,
      sortOrder: 'desc',
      key: 'remarks',
      isSorted: false
    },
    {
      title: 'Players',
      isIcon: true,
      sortOrder: 'desc',
      key: 'userCount',
      isSorted: false
    },
    {
      title: 'Prizes',
      isIcon: true,
      sortOrder: 'desc',
      key: 'prizeArr',
      isSorted: false
    },
    {
      title: 'Time',
      isIcon: true,
      sortOrder: 'desc',
      key: 'startDate',
      isSorted: false
    },
    {
      title: 'Buy-In',
      isIcon: true,
      sortOrder: 'desc',
      key: 'buyIn',
      isSorted: false
    },
    {
      title: 'Status',
      isIcon: false
    }
  ];

  joinedTournamentTable: any[] = [
    {
      remarks: '1 Cr Nano Main Event Adda Event',
      players: 40,
      prizes: '₹ 10,654',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,030',
      status: 'playing',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true
    },
    {
      remarks: 'NPS Golden Rush 1 Cr',
      players: 40,
      prizes: '35 Tickets',
      prizeCount: 3,
      time: '12:55 AM',
      buyIn: '₹ 1,030',
      status: 'registered',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true
    }
  ];

  joinWithTicketTournamentTable: any[] = [
    {
      remarks: '1 Cr Nano Main Event Adda Event',
      players: 40,
      prizes: '2,000 IB',
      prizeCount: 3,
      time: 'In 26 Min',
      buyIn: 'Ticket',
      status: 'late_reg',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true
    },
    {
      remarks: 'NPS Golden Rush 1 Cr',
      players: 40,
      prizes: '₹ 10,654',
      prizeCount: 3,
      time: '12:55 AM',
      buyIn: 'Ticket',
      status: 'registering',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true
    }
  ];

  lateRegTournamentTable: any[] = [
    {
      remarks: '1 Cr Nano Main Event Adda Event',
      players: 40,
      prizes: '50,000 IB',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,00,000',
      status: 'late_reg',
      IsReentry: true,
      satellite: false,
      IsRebuy: false,
      AddonAllowed: true,
      IsPKO: true,
      IsKO: false,
      IS_WIN_THE_BUTTON: false
    },
    {
      remarks: 'NPS Golden Rush 1 Cr',
      players: 40,
      prizes: '₹ 10,654',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '5,000 Freeroll',
      status: 'late_reg',
      IsReentry: false,
      satellite: false,
      IsRebuy: false,
      AddonAllowed: false,
      IsPKO: false,
      IsKO: true,
      IS_WIN_THE_BUTTON: true
    }
  ];

  startingSoonTournamentTable: any[] = [
    {
      remarks: '1 Cr Nano Main Event Adda Event',
      players: 40,
      prizes: '₹ 10,654',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,030',
      status: 'registering',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true,
      IsPKO: false,
      IsKO: false,
      IS_WIN_THE_BUTTON: false
    },
    {
      remarks: 'NPS Golden Rush 1 Cr',
      players: 40,
      prizes: '3 Tickets',
      prizeCount: 0,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,030',
      status: 'registering',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true,
      IsPKO: false,
      IsKO: false,
      IS_WIN_THE_BUTTON: false
    }
  ];

  runningOrFinishedTournamentTable: any[] = [
    {
      remarks: '1 Cr Nano Main Event Adda Event',
      players: 40,
      prizes: '₹ 10,654',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,030',
      status: 'running',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true,
      IsPKO: false,
      IsKO: false,
      IS_WIN_THE_BUTTON: false
    },
    {
      remarks: '1 Cr Nano Main Event Adda Event',
      players: 40,
      prizes: '₹ 10,654',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,030',
      status: 'cancelled',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true,
      IsPKO: false,
      IsKO: false,
      IS_WIN_THE_BUTTON: false
    },
    {
      remarks: 'NPS Golden Rush 1 Cr',
      players: 40,
      prizes: '3 Tickets',
      prizeCount: 3,
      time: '12 Dec | 12:55 AM',
      buyIn: '₹ 1,030',
      status: 'finished',
      IsReentry: true,
      satellite: true,
      IsRebuy: true,
      AddonAllowed: true,
      IsPKO: false,
      IsKO: false,
      IS_WIN_THE_BUTTON: false
    }
  ];

  ngOnInit(): void {
    const mttListSub = this.lobbyService
      .getLobbyMttData()
      .subscribe((res: BaseResponse<MttListResponse>) => {
        if (res.code === APIResponseCode.SUCCESS) {
          this.tournamentList = res.data;
          this.lobbyService.tournamentMttListount += this.tournamentList.allTables.length;
          this.lobbyService.tournamentMttListount += this.tournamentList.joinWithTickets.length;
          this.lobbyService.tournamentMttListount += this.tournamentList.joinedTables.length;
          this.tournamentMttListount = this.lobbyService.tournamentMttListount;
          this.cdr.detectChanges();
        }
      });

    this.subscriptions.push(mttListSub);

    const socketCommRef = this.socketCommService.lobbyTournamentMttSocketCommandSubject.subscribe(
      (res: LobbyTournamentMttSocketResModel) => {
        switch (res.cmd) {
          case 'mtt_lobby':
            res.params.allTables.forEach((updatedData: any) => {
              updatedData.allTables.forEach(
                (element: { configId: string; userCount: string; status: string }) => {
                  this.tournamentList.allTables.forEach((table) => {
                    const updatedTable = table;
                    if (element.configId === table.id) {
                      updatedTable.userCount = element.userCount;
                      updatedTable.status = element.status;
                    }
                  });
                  this.cdr.detectChanges();
                }
              );
            });
            break;
          default:
            break;
        }
      }
    );

    this.subscriptions.push(socketCommRef);

    const filterSub = this.lobbyService.tournamentFilters.subscribe((val) => {
      this.filters = val;

      if (
        this.filters.selectedGameType.length > 0 ||
        this.filters.selectedStatus.length > 0 ||
        this.filters.selectedBuyInTournament.length > 0 ||
        this.filters.selectedFormat.length > 0
      ) {
        this.lobbyService.isTournamentFilterSelected.next(true);
        this.isShowEmptyTable = false;
      } else {
        this.lobbyService.isTournamentFilterSelected.next(false);
        this.isShowEmptyTable = true;
      }
      this.cdr.detectChanges();
    });

    this.subscriptions.push(filterSub);

    const filter1Sub = this.lobbyService.isFilterChannged.subscribe((data: UserSettingsModel[]) => {
      const token = this.localStorageService.getItem('token');
      if (!token) this.setFilters(data);
    });

    this.subscriptions.push(filter1Sub);

    const settingsSub = this.settingService.userSettings.subscribe((data: UserSettingsModel[]) => {
      const token = this.localStorageService.getItem('token');
      if (token) this.setFilters(data);
    });

    this.subscriptions.push(settingsSub);

    this.sfsRequestService.getUserSettingsData();
  }

  setFilters(data: UserSettingsModel[]) {
    this.filters = {
      selectedGameType: [],
      selectedStatus: [],
      selectedBuyInTournament: [],
      selectedFormat: []
    };
    data.forEach((val: UserSettingsModel) => {
      this.gameTypes.forEach((val2: string) => {
        if (val.keyName === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.filters.selectedGameType.push({
            key: val.keyValue,
            value: val2
          });
        }
      });
      this.statusList.forEach((val2: string) => {
        if (val.keyName === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.filters.selectedStatus.push({
            key: val.keyValue,
            value: val2
          });
        }
      });
      this.buyInsTornaments.forEach((val2: string) => {
        if (val.keyName.replace(/\?/g, '₹') === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.filters.selectedBuyInTournament.push({
            key: val.keyValue,
            value: val2
          });
        }
      });
      this.formatList.forEach((val2: string) => {
        if (val.keyName === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.filters.selectedFormat.push({
            key: val.keyValue,
            value: val2
          });
        }
      });
    });

    if (
      this.filters.selectedGameType.length > 0 ||
      this.filters.selectedStatus.length > 0 ||
      this.filters.selectedBuyInTournament.length > 0 ||
      this.filters.selectedFormat.length > 0
    ) {
      this.lobbyService.isTournamentFilterSelected.next(true);
    } else {
      this.lobbyService.isTournamentFilterSelected.next(false);
    }
    const timeoutVar = setTimeout(() => {
      this.tournamentMttListount = this.lobbyService.tournamentMttListount;
      this.cdr.detectChanges();
      clearTimeout(timeoutVar);
    }, ToastTime.HUNDRED_MS);
    this.cdr.detectChanges();
  }

  calculateStartTime(list: TableTournament): string {
    if (list.startDate) {
      const startDate: any = new Date(list.startDate);
      const endDate: any = new Date();
      const timeDifferenceMillis = startDate - endDate;
      const daysDifference = Math.floor(timeDifferenceMillis / (1000 * 60 * 60 * 24));

      if (daysDifference !== 0) {
        return 'dateAndTime';
      }

      const remainingHours = Math.floor(
        (timeDifferenceMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (remainingHours > 0) {
        return 'time';
      }

      if (remainingHours === 0) {
        const remainingMinutes = Math.floor(
          (timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60)
        );
        return `In ${remainingMinutes} mins`;
      }
    }
    return 'none';
  }

  sortList(key: string, sortOrder: string, idx: number) {
    this.tournamentTableHeaders[idx].sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    for (let i = 0; i < this.tournamentTableHeaders.length; i += 1) {
      const element = this.tournamentTableHeaders[i];
      if (i === idx) {
        element.isSorted = true;
      } else {
        element.isSorted = false;
      }
    }

    this.sortOptions = {
      key,
      sortOrder: sortOrder === 'asc' ? 'desc' : 'asc'
    };
  }

  openRhs(list: TableTournament) {
    const token = this.localStorageService.getItem('token');
    this.selectedGame = {} as TableTournament;
    if (token) {
      this.selectedGame = list;
      this.lobbyService.selectedTournamentMtt.next(list);
    } else {
      this.openLogin();
    }
  }

  openLogin() {
    this.dialog.open(LoginComponent, MATDIALOG.loginDialog);
  }

  openInfoPopup() {
    this.dialog.open(InfoPopupComponent, {
      ...MATDIALOG.actionDialog,
      data: { from: 'tournament' }
    });
  }

  openIconsLegendDialog() {
    this.dialog.open(IconsLegendComponent, {
      ...MATDIALOG.animatedDialog,
      data: { from: 'TOURNAMENT' }
    });
  }

  openRegistrationDialog(val: string) {
    this.dialog.open(RegistrationComponent, {
      ...MATDIALOG.RegistrationDialog,
      data: { from: val, component: 'TOURNAMENTS' }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
