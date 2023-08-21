import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CashGamesList, TableRingList } from 'projects/shared/src/lib/models/common/lobby.model';
import { LobbyService, MATDIALOG, Paths } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { IconsLegendComponent } from '../../../dialogs/icons-legend/icons-legend.component';

@Component({
  selector: 'app-avg-stack-table',
  templateUrl: './avg-stack-table.component.html',
  styleUrls: ['./avg-stack-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvgStackTableComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-scroll';

  assetsImagePath = Paths.imagePath;

  subscriptions: Subscription[] = [];

  tables: Array<AvgStackTableModel> = [];

  @Input() tableRingList: TableRingList = {} as TableRingList;

  @Input() selectedGame: CashGamesList = {} as CashGamesList;

  avgStackAscend: boolean = true;

  feeAscend: boolean = true;

  userCountAscend: boolean = false;

  constructor(
    public dialog: MatDialog,
    private lobbyService: LobbyService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const ringListSub = this.lobbyService.updatedRingList.subscribe((res: any) => {
      this.tables = res?.table;
      this.showSelectedTableInfo(this.tables[0]);
      const tableListSub = this.lobbyService.getFilteredTableList().subscribe((tables) => {
        this.tables = tables;
        this.sortByParameter('userCount', 'number');
        this.changeDetectorRef.detectChanges();
      });
      this.tables[0].isSelected = true;
      this.subscriptions.push(tableListSub);

      this.moveTableSelection();

      this.changeDetectorRef.detectChanges();
    });
    this.subscriptions.push(ringListSub);
  }
  showSelectedTableInfo(table: AvgStackTableModel) {
    if (!table) {
      return;
    }

    this.tables.forEach((element: AvgStackTableModel) => {
      const updatedElement: AvgStackTableModel = element;
      updatedElement.isSelected = false;
    });

    const selectedTable = this.tables.find((element: any) => element.id === table.id);
    if (selectedTable) {
      selectedTable.isSelected = true;
    }

    if (table) {
      this.getTableDetails(table);
    }
  }

  openIconsLegendDialog() {
    this.dialog.open(IconsLegendComponent, {
      ...MATDIALOG.animatedDialog,
      data: { from: 'CASH_GAMES' }
    });
  }

  getTableDetails(table: AvgStackTableModel) {
    const params = {
      selectedTab: 1,
      data: {
        selectedTableId: table.id
      }
    };

    this.lobbyService.setSelectedTabAndData(params);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  sortByParameter(parameter: string, parameterType: string) {
    if (parameterType === 'string') this.sortCashGamesStrings(parameter);
    else if (parameterType === 'number') this.sortCashGamesNumbers(parameter);
  }

  sortCashGamesStrings(parameter: any) {
    const currentList = [...this.tables];
    this.tables = this.tables.sort((a: any, b: any) =>
      a[parameter].toString().localeCompare(b[parameter].toString())
    );
    if (JSON.stringify(this.tables) === JSON.stringify(currentList)) {
      this.tables = this.tables.sort((a: any, b: any) =>
        b[parameter].toString().localeCompare(a[parameter].toString())
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  sortCashGamesNumbers(parameter: any) {
    this.tables = this.tables ? this.tables : [];
    const currentList = [...this.tables];

    this.tables = this.tables.sort(
      (a: any, b: any) =>
        parseInt(a[parameter].toString(), 10) - parseInt(b[parameter].toString(), 10)
    );

    if (JSON.stringify(this.tables) === JSON.stringify(currentList)) {
      this.tables = this.tables.sort(
        (a: any, b: any) =>
          parseInt(b[parameter].toString(), 10) - parseInt(a[parameter].toString(), 10)
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  moveTableSelection() {
    const detectTableSelection = this.lobbyService.detectTableSelection.subscribe((data: any) => {
      const currentIndex = this.tables
        .map((item) => Number(item.id))
        .indexOf(data.tableData.tableId);

      if (data.isNext) {
        this.showSelectedTableInfo(this.tables[currentIndex + 1]);
      } else {
        this.showSelectedTableInfo(this.tables[currentIndex - 1]);
      }
    });
    this.subscriptions.push(detectTableSelection);
  }

  onTableDataHover(table: any) {
    this.tables.forEach((element: AvgStackTableModel) => {
      const updatedElement: AvgStackTableModel = element;
      updatedElement.isSelected = false;
    });

    const selectedTable = this.tables.find(
      (element: AvgStackTableModel) => element.id === table.id
    );
    if (selectedTable) {
      selectedTable.isSelected = true;
    }
  }
}

export interface AvgStackTableModel {
  id: string;
  userCount: number;
  avgStack: string;
  fee: string;
  isMR: boolean;
  isFF: boolean;
  isStraddle: boolean;
  maxPlayers: number;
  isSelected: boolean;
}
