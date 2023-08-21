import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FilterConstant, LobbyMtt, Paths } from 'projects/shared/src/lib/constants/app-constants';
import {
  LobbyService,
  LocalStorageService,
  SettingsService,
  SfsRequestService,
  UserSettingsModel
} from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { KeyValuePair } from 'projects/shared/src/lib/models/common/lobby.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  stakes = [FilterConstant.micro, FilterConstant.low, FilterConstant.mid, FilterConstant.high];

  types = [
    FilterConstant.nonRit,
    FilterConstant.rit,
    FilterConstant.fastFold,
    FilterConstant.straddle
  ];

  selectedStakes: string;

  selectedTypes: string;

  isFullTableSelected: boolean = false;

  isEmptyTableSelected: boolean = false;

  buyInsSelected: any = [];

  filters: any = [];

  filtersCopy: any = [];

  assetsImagePath = Paths.imagePath;

  subscriptions: Subscription[] = [];

  buyInSelected: any = [];

  tableSizes: any[] = [2, 4, 6];

  selectedTableSize: string = '';

  buyIns: any[] = ['<=100', '101-500', '501-1,000', '1,001-1,500', '>=1,501'];

  selectedBuyIn: any;

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

  selectedGameType: KeyValuePair[] = [];

  selectedStatus: KeyValuePair[] = [];

  selectedGameTypes: any;

  selectedBuyIns: Array<any> = [];

  filteredTableSize: any = [];

  buyInFiltered: any = [];

  selectedBuyInTournament: KeyValuePair[] = [];

  selectedFormat: KeyValuePair[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FiltersComponent>,
    private lobbyService: LobbyService,
    private authService: AuthService,
    public cdr: ChangeDetectorRef,
    private sfsRequestService: SfsRequestService,
    private settingService: SettingsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const userSub = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp === false) {
        this.onClickResetFilter();
      }
    });
    this.subscriptions.push(userSub);
    const filterSub = this.lobbyService.getFilters().subscribe((filters) => {
      this.setSelectedFilter(filters);
      this.filtersCopy = JSON.parse(JSON.stringify(filters));
      this.cdr.detectChanges();
    });
    this.subscriptions.push(filterSub);
    if (this.data.filters && this.data.filters.length > 0) {
      this.setSelectedFilter(this.data.filters);
      this.filters = this.data.filters;
      this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    } else {
      if (this.data.from === 'CASH_GAMES') {
        this.data = {
          from: this.data.from,
          filters:
            this.data.selectedSubMenu === 'PLO 6'
              ? [
                  {
                    name: 'isMR',
                    operator: '==',
                    value: 1
                  }
                ]
              : []
        };
      }

      if (this.data.from === 'SNG') {
        this.data = {
          from: this.data.from,
          filters: []
        };
      }
      if (this.data.from === 'CASH_GAMES' || this.data.from === 'SNG') {
        this.filters = this.data.filters;
        this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
        this.lobbyService.addFilters(this.filters);
      }
    }

    const { tournamentFlters } = this.lobbyService;

    const token = this.localStorageService.getItem('token');

    if (!token) this.setMttFilters(tournamentFlters);

    const settingsSub = this.settingService.userSettings.subscribe((data: UserSettingsModel[]) => {
      this.setMttFilters(data);
    });

    this.subscriptions.push(settingsSub);

    this.sfsRequestService.getUserSettingsData();
  }

  setMttFilters(data: UserSettingsModel[]) {
    data.forEach((val: UserSettingsModel) => {
      this.gameTypes.forEach((val2: string) => {
        if (val.keyName === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.onGameTypeSelected(val2);
        }
      });
      this.statusList.forEach((val2: string) => {
        if (val.keyName === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.onStatusSelected(val2);
        }
      });
      this.buyInsTornaments.forEach((val2: string) => {
        if (val.keyName.replace(/\?/g, '₹') === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.onBuyInTournamentSelected(val2);
        }
      });
      this.formatList.forEach((val2: string) => {
        if (val.keyName === val2 && val.keyStatus === LobbyMtt.ACTIVE) {
          this.onFormatSelected(val2);
        }
      });
    });
    const filters = {
      selectedGameType: this.selectedGameType,
      selectedStatus: this.selectedStatus,
      selectedBuyInTournament: this.selectedBuyInTournament,
      selectedFormat: this.selectedFormat
    };
    this.lobbyService.tournamentFilters.next(filters);
    this.cdr.detectChanges();
  }

  setSelectedFilter(filters: any) {
    if (filters === 'reset') {
      this.filters = [];
      return;
    }
    const selectedBuyIn: string[] = [];
    filters.forEach((data: any) => {
      if (data.name === 'blinds') {
        switch (data.value) {
          case '2/5':
            this.selectedStakes = FilterConstant.micro;
            break;
          case '5/10, 10/25':
            this.selectedStakes = FilterConstant.low;
            break;
          case '25/50, 100/200':
            this.selectedStakes = FilterConstant.mid;
            break;

          default:
            this.selectedStakes = FilterConstant.high;
            break;
        }
      }
      if (data.name === 'isMR' && !data.value) {
        this.selectedTypes = 'Non RIT';
      } else if (data.name === 'isMR' && data.value) {
        this.selectedTypes = 'RIT';
      } else if (data.name === 'isFF') {
        this.selectedTypes = 'Fast Fold';
      } else if (data.name === 'isStraddle') {
        this.selectedTypes = 'Straddle';
      } else if (data.name === 'userCount') {
        if (data.value === 6) {
          this.isFullTableSelected = true;
        } else {
          this.isEmptyTableSelected = true;
        }
      }

      if (data.name === 'maxPlayers') {
        this.selectedTableSize = data.value;
      }

      if (data.name === 'amount') {
        selectedBuyIn.push(data.label);
      }
    });
    this.selectedBuyIns = Array.from(new Set(selectedBuyIn));
  }

  onStakesSelected(stk: string) {
    if (this.filters === 'reset') this.filters = [];
    this.selectedStakes = stk;
    let operator: string = '';
    let value: any = '';
    switch (stk) {
      case FilterConstant.micro:
        value = '2/5';
        operator = '<=';
        break;
      case FilterConstant.low:
        value = '5/10, 10/25';
        break;
      case FilterConstant.mid:
        value = '25/50, 100/200';
        break;
      default:
        operator = '>=';
        value = '250/500';
        break;
    }
    let index = -1;
    for (let i = 0; i < this.filters.length; i += 1) {
      const filter = this.filters[i];
      if (filter.name === 'blinds') {
        index = i;
      }
    }
    if (index > -1) this.filters.splice(index, 1);
    this.filters.push({
      name: 'blinds',
      operator,
      value
    });
  }

  onTypesSelected(tp: string) {
    if (this.filters === 'reset') this.filters = [];
    this.selectedTypes = tp;
    let type;
    let value: number = 1;
    switch (tp) {
      case FilterConstant.nonRit:
        type = 'isMR';
        value = 0;
        break;
      case FilterConstant.rit:
        type = 'isMR';
        break;
      case FilterConstant.fastFold:
        type = 'isFF';
        break;
      default:
        type = 'isStraddle';
        break;
    }
    let index = -1;
    for (let i = 0; i < this.filters.length; i += 1) {
      const filter = this.filters[i];
      if (filter.name === 'isMR' || filter.name === 'isFF' || filter.name === 'isStraddle') {
        index = i;
      }
    }
    if (index > -1) this.filters.splice(index, 1);
    this.filters.push({
      name: type,
      operator: '==',
      value
    });
  }

  onTableSizeSelected(ts: any) {
    if (this.filters === 'reset') this.filters = [];
    this.selectedTableSize = ts;

    const existingIndices = this.filters.reduce((acc: number[], element: any, index: number) => {
      if (element.name === 'maxPlayers') {
        acc.push(index);
      }
      return acc;
    }, []);

    if (existingIndices.length > 0) {
      existingIndices.reverse().forEach((index: number) => {
        this.filters.splice(index, 1);
      });
    }

    this.filters.push({
      name: 'maxPlayers',
      operator: '==',
      value: ts.toString()
    });
  }

  isBuyInSelected(bI: any): boolean {
    return this.selectedBuyIns.includes(bI);
  }

  onBuyInSelected(bI: any) {
    if (this.filters === 'reset') this.filters = [];
    this.selectedBuyIn = bI;
    const existingIndex = this.buyInSelected.findIndex(
      (element: any) => (element.name === bI || element.label === bI) && element.isSelected
    );

    if (existingIndex !== -1) {
      this.buyInSelected.splice(existingIndex, 1);
    } else {
      this.buyInSelected.push({
        name: bI,
        isSelected: true
      });
    }

    const index = this.selectedBuyIns.indexOf(bI);
    if (index > -1) {
      let buyInIndex: number = -1;

      const buyInIndexdiff: any = [];

      this.selectedBuyIns.forEach((val, i) => {
        if (val === bI) {
          buyInIndex = i;
        }
      });

      this.filters.forEach((val: any, i: number) => {
        if (val.label && val.label === bI) {
          buyInIndexdiff.push(i);
        }
      });

      this.selectedBuyIns.splice(buyInIndex, 1);

      if (buyInIndexdiff.length > 1) {
        this.filters.splice(buyInIndexdiff[0], 2);
      } else {
        this.filters.splice(buyInIndexdiff[0], 1);
      }
    } else {
      this.selectedBuyIns.push(bI);

      if (this.selectedBuyIns.length > 0) {
        switch (bI) {
          case '<=100':
            this.filters.push({
              name: 'amount',
              operator: '<=',
              value: parseInt(bI.slice(2), 10),
              label: bI
            });
            break;
          case '>=1,501':
            this.filters.push({
              name: 'amount',
              operator: '>=',
              value: parseInt(bI.slice(2).replace(/,/g, ''), 10),
              label: bI
            });
            break;
          default: {
            const rangeValues = bI.split('-');
            const lowerBound = parseInt(rangeValues[0]?.replace(/,/g, ''), 10);
            this.filters.push({
              name: 'amount',
              operator: '>=-<=',
              value: lowerBound,
              label: bI
            });

            break;
          }
        }
      }
    }
  }

  isSelectedBuyIn(gt: any): boolean {
    return this.selectedGameTypes?.includes(gt);
  }

  showFullTable() {
    this.isFullTableSelected = !this.isFullTableSelected;
    this.setLocalFilter('full');
  }

  showEmptyTable() {
    this.isEmptyTableSelected = !this.isEmptyTableSelected;
    this.setLocalFilter('zero');
  }

  setLocalFilter(type: string) {
    if (this.filters === 'reset') this.filters = [];
    const checkVal = type === 'full' ? 6 : 0;
    const values: any = [];
    let idx: number = -1;
    for (let i = 0; i < this.filters.length; i += 1) {
      const filter = this.filters[i];
      if (filter.name === 'userCount' && checkVal === filter.value) {
        values.push(filter.value);
        idx = i;
      }
    }

    if (values.length <= 0) {
      this.filters.push({
        name: 'userCount',
        operator: '!=',
        value: checkVal
      });
    } else {
      this.filters.splice(idx, 1);
    }
  }

  onSngApply() {
    this.lobbyService.addFilters(this.filters);
  }

  onReset() {
    this.selectedStakes = '';
    this.selectedTypes = '';
    this.lobbyService.addFilters('reset');
    this.filters = [];
    this.dialogRef.close(this.filtersCopy);
  }

  onClose(type?: string) {
    if (!type) {
      this.lobbyService.addFilters(this.filters);
    }
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogRef.close(this.filtersCopy);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (
      this.lobbyService.lastSelectedFilter === 'reset' ||
      this.lobbyService.lastSelectedFilter === undefined
    ) {
      this.lobbyService.filterSelectionChange.next(false);
    } else this.lobbyService.filterSelectionChange.next(true);

    this.dialogRef.close(this.filtersCopy);

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onGameTypeSelected(gt: string) {
    let data: string = '';
    switch (gt) {
      case FilterConstant.holdem:
        data = 'HOLDEM';
        break;
      default:
        data = 'OMAHA';
        break;
    }

    let idx: number = -1;
    if (this.selectedGameType && this.selectedGameType.length > 0) {
      this.selectedGameType.forEach((val, i) => {
        if (val.key === data) {
          idx = i;
        }
      });
    }

    if (idx <= -1) {
      this.selectedGameType.push({
        key: data,
        name: gt
      });
    } else {
      this.selectedGameType.splice(idx, 1);
    }
    this.cdr.detectChanges();
  }

  isGameTypeSelected(gt: string): boolean {
    let isSelected: boolean = false;
    if (this.selectedGameType && this.selectedGameType.length > 0) {
      this.selectedGameType.forEach((val) => {
        if (val.name === gt) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  onStatusSelected(sL: string) {
    let data: string = '';
    switch (sL) {
      case FilterConstant.lateReg:
        data = 'late_reg';
        break;
      case FilterConstant.running:
        data = 'active';
        break;
      case FilterConstant.finished:
        data = 'completed';
        break;
      default:
        data = sL;
        break;
    }

    let idx: number = -1;
    if (this.selectedStatus && this.selectedStatus.length > 0) {
      this.selectedStatus.forEach((val, i) => {
        if (val.key === data) {
          idx = i;
        }
      });
    }

    if (idx <= -1) {
      this.selectedStatus.push({
        key: data,
        name: sL
      });
    } else {
      this.selectedStatus.splice(idx, 1);
    }
    this.cdr.detectChanges();
  }

  isStatusSelected(sL: string): boolean {
    let isSelected: boolean = false;
    if (this.selectedStatus && this.selectedStatus.length > 0) {
      this.selectedStatus.forEach((val) => {
        if (val.name === sL) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  onBuyInTournamentSelected(bI: string) {
    let data: string = '';
    switch (bI) {
      case '<= ₹ 100':
        data = '100';
        break;
      case '₹ 101 - ₹ 500':
        data = '101-500';
        break;
      case '₹ 501 - ₹ 1,000':
        data = '501-1000';
        break;
      case '₹ 1,001 - ₹ 5,000':
        data = '1001-5000';
        break;
      case '₹ 5,000 & Above':
        data = '5000';
        break;
      default:
        data = bI;
        break;
    }

    let idx: number = -1;
    if (this.selectedBuyInTournament && this.selectedBuyInTournament.length > 0) {
      this.selectedBuyInTournament.forEach((val, i) => {
        if (val.key === data) {
          idx = i;
        }
      });
    }

    if (idx <= -1) {
      this.selectedBuyInTournament.push({
        key: data,
        name: bI
      });
    } else {
      this.selectedBuyInTournament.splice(idx, 1);
    }
    this.cdr.detectChanges();
  }

  isBuyInTournamentSelected(bI: string): boolean {
    let isSelected: boolean = false;
    if (this.selectedBuyInTournament && this.selectedBuyInTournament.length > 0) {
      this.selectedBuyInTournament.forEach((val) => {
        if (val.name === bI) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  onFormatSelected(fL: string) {
    let data: string = '';
    switch (fL) {
      case FilterConstant.reentry:
        data = 'isRentry';
        break;
      case FilterConstant.rebuyAndAddon:
        data = 'addOnAllowed';
        break;
      case FilterConstant.knockout:
        data = 'isBountyMTT';
        break;
      case FilterConstant.winTheButton:
        data = 'isWinTheButton';
        break;
      case FilterConstant.freezeout:
        data = 'freezeout';
        break;
      default:
        break;
    }

    let idx: number = -1;
    if (this.selectedFormat && this.selectedFormat.length > 0) {
      this.selectedFormat.forEach((val, i) => {
        if (val.key === data) {
          idx = i;
        }
      });
    }

    if (idx <= -1) {
      this.selectedFormat.push({
        key: data,
        name: fL
      });
    } else {
      this.selectedFormat.splice(idx, 1);
    }
    this.cdr.detectChanges();
  }

  isFormatSelected(fL: string): boolean {
    let isSelected: boolean = false;
    if (this.selectedFormat && this.selectedFormat.length > 0) {
      this.selectedFormat.forEach((val) => {
        if (val.name === fL) {
          isSelected = true;
        }
      });
    }
    return isSelected;
  }

  applyTournamentFilter(type?: string) {
    this.lobbyService.tournamentMttListount = 0;
    const token = this.localStorageService.getItem('token');
    const filters: UserSettingsModel[] = [];
    const tempFilters: UserSettingsModel[] = [];
    if (type) {
      this.selectedGameType = [];
      this.selectedStatus = [];
      this.selectedBuyInTournament = [];
      this.selectedFormat = [];
    }
    this.gameTypes.forEach((val: string) => {
      const data = [
        {
          keyName: val,
          keyValue: '',
          keyStatus: LobbyMtt.INACTIVE
        }
      ];
      filters.push(data[0]);
      if (token) this.sfsRequestService.setUserSettingsData(data);

      this.selectedGameType.forEach((element: KeyValuePair) => {
        if (element.name === val) {
          const data1 = [
            {
              keyName: val,
              keyValue: element.key,
              keyStatus: LobbyMtt.ACTIVE
            }
          ];
          tempFilters.push(data1[0]);
          if (token) this.sfsRequestService.setUserSettingsData(data1);
        }
      });
    });

    this.statusList.forEach((val: string) => {
      const data = [
        {
          keyName: val,
          keyValue: '',
          keyStatus: LobbyMtt.INACTIVE
        }
      ];
      filters.push(data[0]);
      if (token) this.sfsRequestService.setUserSettingsData(data);

      this.selectedStatus.forEach((element: KeyValuePair) => {
        if (element.name === val) {
          const data1 = [
            {
              keyName: val,
              keyValue: element.key,
              keyStatus: LobbyMtt.ACTIVE
            }
          ];
          tempFilters.push(data1[0]);
          if (token) this.sfsRequestService.setUserSettingsData(data1);
        }
      });
    });

    this.buyInsTornaments.forEach((val: string) => {
      const data = [
        {
          keyName: val.replace('/₹|_/g', ''),
          keyValue: '',
          keyStatus: LobbyMtt.INACTIVE
        }
      ];
      filters.push(data[0]);
      if (token) this.sfsRequestService.setUserSettingsData(data);

      this.selectedBuyInTournament.forEach((element: KeyValuePair) => {
        if (element.name === val) {
          const data1 = [
            {
              keyName: val,
              keyValue: element.key,
              keyStatus: LobbyMtt.ACTIVE
            }
          ];
          tempFilters.push(data1[0]);
          if (token) this.sfsRequestService.setUserSettingsData(data1);
        }
      });
    });

    this.formatList.forEach((val: string) => {
      const data = [
        {
          keyName: val,
          keyValue: '',
          keyStatus: LobbyMtt.INACTIVE
        }
      ];
      filters.push(data[0]);
      if (token) this.sfsRequestService.setUserSettingsData(data);

      this.selectedFormat.forEach((element: KeyValuePair) => {
        if (element.name === val) {
          const data1 = [
            {
              keyName: val,
              keyValue: element.key,
              keyStatus: LobbyMtt.ACTIVE
            }
          ];
          tempFilters.push(data1[0]);
          if (token) this.sfsRequestService.setUserSettingsData(data1);
        }
      });
    });
    let finalFilters = [...tempFilters, ...filters];
    finalFilters = finalFilters.filter(
      (obj: any, index: number, self: any) =>
        index === self.findIndex((item: any) => item.keyName === obj.keyName)
    );
    this.lobbyService.tournamentFlters = finalFilters;
    this.lobbyService.isFilterChannged.next(finalFilters);
    if (token) {
      this.sfsRequestService.getUserSettingsData();
    }
    this.cdr.detectChanges();
    this.dialogRef.close();
  }

  onClickResetFilter() {
    this.selectedBuyIn = '';
    this.selectedTableSize = '';
    this.selectedBuyIns = [];
    this.filteredTableSize = [];
    this.buyInFiltered = [];

    this.filters = [];

    this.lobbyService.addFilters('reset');
    this.dialogRef.close(this.filtersCopy);
  }
}
