import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  GlobalConstant,
  MATDIALOG,
  Paths,
  RowClickedData,
  LobbyService,
  SfsRequestService,
  BroadcastService,
  UtilityService
} from 'projects/shared/src/public-api';
import { InfoAlertComponent } from 'src/app/modules/share/alert/alert.component';

import { CreateTableComponent } from '../../dialogs/create-table/create-table.component';
import { InviteYourFriendComponent } from '../../dialogs/invite-your-friend/invite-your-friend.component';
import { PrivateTable, PvtTables } from '../../models/view/private-table-list';
import { PrivateTableModel } from '../../models/view/private-table.model';

@Component({
  selector: 'app-private-tables',
  templateUrl: './private-tables.component.html',
  styleUrls: ['./private-tables.component.scss']
})
export class PrivateTablesComponent extends PrivateTableModel implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  joinTableForm: FormGroup = new FormGroup({});

  createdTable: PrivateTable;

  joinedTable: PrivateTable;

  PvtTableData: PrivateTable;

  isShowTable: boolean = false;

  subscriptions: Subscription[] = [];

  isshowAlert: boolean = false;

  rowClickedData: RowClickedData;

  constructor(
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public override lobbyService: LobbyService,
    public override sfsRequestService: SfsRequestService,
    public override cdr: ChangeDetectorRef,
    public override broadcastService: BroadcastService,
    public override utilService: UtilityService
  ) {
    super(sfsRequestService, cdr, lobbyService, broadcastService, utilService);
    this.joinTableForm = this.formBuilder.group({
      tableCode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    super.onInit();
    const PrivateTableList = this.lobbyService.PrivateTableList.subscribe((res: any) => {
      this.isShowTable = true;
      if (res) {
        this.PvtTableData = res.tables;
        this.createdTable = this.PvtTableData.filter((item: PvtTables) => item.own === 'Me').map(
          (item: PvtTables) => item
        );
        this.joinedTable = this.PvtTableData.filter((item: PvtTables) => item.own !== 'Me').map(
          (item: PvtTables) => item
        );
        if (this.createdTable.length > 0) {
          this.getRhsData(this.createdTable[0]);
        } else if (this.createdTable.length === 0 && this.joinedTable.length > 0) {
          this.getRhsData(this.joinedTable[0]);
        }
      }
    });
    this.subscriptions.push(PrivateTableList);
  }

  pvtTableHeaders: any[] = [
    {
      title: 'Table',
      isIcon: false,
      isAscend: false
    },
    {
      title: 'Blinds',
      isIcon: true,
      isAscend: false
    },
    {
      title: 'Players',
      isIcon: true,
      isAscend: false
    },
    {
      title: 'Buy-In',
      isIcon: true,
      isAscend: false
    },
    {
      title: 'Expiry Date',
      isIcon: true,
      isAscend: false
    },
    {
      title: 'Other Actions',
      isIcon: false,
      isAscend: false
    }
  ];

  openInviteDialog(data: PvtTables) {
    if (data) {
      this.dialog.open(InviteYourFriendComponent, {
        ...MATDIALOG.InviteYourFriendDialog,
        data: { from: 'PrivateTablesComponent', data }
      });
    }
  }

  sort(header: any) {
    const createdTableList = [...this.createdTable];
    const joinedTableList = [...this.joinedTable];
    switch (header.title) {
      case 'Players':
        this.createdTable = this.createdTable.sort((a, b) => {
          const first = Number(a.jnd) / a.mxp;
          const second = Number(b.jnd) / b.mxp;
          return second - first;
        });

        this.joinedTable = this.joinedTable.sort((a, b) => {
          const first = Number(a.jnd) / a.mxp;
          const second = Number(b.jnd) / b.mxp;
          return second - first;
        });
        {
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', false);
          }
        }

        if (JSON.stringify(this.createdTable) === JSON.stringify(createdTableList)) {
          this.createdTable = this.createdTable.sort((a, b) => {
            const first = Number(a.jnd) / a.mxp;
            const second = Number(b.jnd) / b.mxp;
            return first - second;
          });

          if (JSON.stringify(this.joinedTable) === JSON.stringify(joinedTableList)) {
            this.joinedTable = this.joinedTable.sort((a, b) => {
              const first = Number(a.jnd) / a.mxp;
              const second = Number(b.jnd) / b.mxp;
              return second - first;
            });
          }
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', true);
          }
        }

        break;
      case 'Blinds':
        this.createdTable = this.createdTable.sort(
          (a, b) => parseFloat(a.sbbb) - parseFloat(b.sbbb)
        );
        this.joinedTable = this.joinedTable.sort((a, b) => parseFloat(a.sbbb) - parseFloat(b.sbbb));

        {
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', false);
          }
        }

        if (JSON.stringify(this.createdTable) === JSON.stringify(createdTableList)) {
          this.createdTable = this.createdTable.sort(
            (a, b) => parseFloat(b.sbbb) - parseFloat(a.sbbb)
          );

          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', true);
          }
        }
        if (JSON.stringify(this.joinedTable) === JSON.stringify(joinedTableList)) {
          this.joinedTable = this.joinedTable.sort(
            (a, b) => parseFloat(b.sbbb) - parseFloat(a.sbbb)
          );
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', true);
          }
        }

        break;
      case 'Buy-In':
        this.createdTable = this.createdTable.sort(
          (a, b) => parseFloat(a.blbh) - parseFloat(b.blbh)
        );

        this.joinedTable = this.joinedTable.sort((a, b) => parseFloat(a.blbh) - parseFloat(b.blbh));

        {
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', false);
          }
        }
        if (JSON.stringify(this.createdTable) === JSON.stringify(createdTableList)) {
          this.createdTable = this.createdTable.sort(
            (a, b) => parseFloat(b.blbh) - parseFloat(a.blbh)
          );

          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', true);
          }
        }
        if (JSON.stringify(this.joinedTable) === JSON.stringify(joinedTableList)) {
          this.joinedTable = this.joinedTable.sort(
            (a, b) => parseFloat(b.blbh) - parseFloat(a.blbh)
          );
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', true);
          }
        }
        break;
      case 'Expiry Date':
        this.createdTable = this.createdTable.sort((a, b) => {
          const [dateAPart, timeAPart] = a.ed.split('|');
          const [dateBPart, timeBPart] = b.ed.split('|');
          const [dayA, monthA, yearA] = dateAPart.split('/');
          const [dayB, monthB, yearB] = dateBPart.split('/');
          const [hourA, minuteA] = timeAPart.split(':');
          const [hourB, minuteB] = timeBPart.split(':');

          const dateA = new Date(
            parseInt(yearA, 10),
            parseInt(monthA, 10) - 1,
            parseInt(dayA, 10),
            parseInt(hourA, 10),
            parseInt(minuteA, 10)
          );
          const dateB = new Date(
            parseInt(yearB, 10),
            parseInt(monthB, 10) - 1,
            parseInt(dayB, 10),
            parseInt(hourB, 10),
            parseInt(minuteB, 10)
          );

          return dateB.getTime() - dateA.getTime();
        });

        this.joinedTable = this.joinedTable.sort((a, b) => {
          const [dateAPart, timeAPart] = a.ed.split('|');
          const [dateBPart, timeBPart] = b.ed.split('|');
          const [dayA, monthA, yearA] = dateAPart.split('/');
          const [dayB, monthB, yearB] = dateBPart.split('/');
          const [hourA, minuteA] = timeAPart.split(':');
          const [hourB, minuteB] = timeBPart.split(':');

          const dateA = new Date(
            parseInt(yearA, 10),
            parseInt(monthA, 10) - 1,
            parseInt(dayA, 10),
            parseInt(hourA, 10),
            parseInt(minuteA, 10)
          );
          const dateB = new Date(
            parseInt(yearB, 10),
            parseInt(monthB, 10) - 1,
            parseInt(dayB, 10),
            parseInt(hourB, 10),
            parseInt(minuteB, 10)
          );

          return dateB.getTime() - dateA.getTime();
        });
        {
          const value = Reflect.get(header, 'isAscend');
          if (typeof value === 'boolean') {
            Reflect.set(header, 'isAscend', false);
          }
        }
        if (JSON.stringify(this.createdTable) === JSON.stringify(createdTableList)) {
          this.createdTable = this.createdTable.sort((a, b) => {
            const [dateAPart, timeAPart] = a.ed.split('|');
            const [dateBPart, timeBPart] = b.ed.split('|');
            const [dayA, monthA, yearA] = dateAPart.split('/');
            const [dayB, monthB, yearB] = dateBPart.split('/');
            const [hourA, minuteA] = timeAPart.split(':');
            const [hourB, minuteB] = timeBPart.split(':');

            const dateA = new Date(
              parseInt(yearA, 10),
              parseInt(monthA, 10) - 1,
              parseInt(dayA, 10),
              parseInt(hourA, 10),
              parseInt(minuteA, 10)
            );
            const dateB = new Date(
              parseInt(yearB, 10),
              parseInt(monthB, 10) - 1,
              parseInt(dayB, 10),
              parseInt(hourB, 10),
              parseInt(minuteB, 10)
            );

            return dateA.getTime() - dateB.getTime();
          });

          if (JSON.stringify(this.joinedTable) === JSON.stringify(joinedTableList)) {
            this.joinedTable = this.joinedTable.sort((a, b) => {
              const [dateAPart, timeAPart] = a.ed.split('|');
              const [dateBPart, timeBPart] = b.ed.split('|');
              const [dayA, monthA, yearA] = dateAPart.split('/');
              const [dayB, monthB, yearB] = dateBPart.split('/');
              const [hourA, minuteA] = timeAPart.split(':');
              const [hourB, minuteB] = timeBPart.split(':');

              const dateA = new Date(
                parseInt(yearA, 10),
                parseInt(monthA, 10) - 1,
                parseInt(dayA, 10),
                parseInt(hourA, 10),
                parseInt(minuteA, 10)
              );
              const dateB = new Date(
                parseInt(yearB, 10),
                parseInt(monthB, 10) - 1,
                parseInt(dayB, 10),
                parseInt(hourB, 10),
                parseInt(minuteB, 10)
              );

              return dateA.getTime() - dateB.getTime();
            });
          }
          {
            const value = Reflect.get(header, 'isAscend');
            if (typeof value === 'boolean') {
              Reflect.set(header, 'isAscend', true);
            }
          }
        }

        break;
      default:
        break;
    }
  }

  openCreateTableDialog() {
    if (this.createdTable?.length > 2) {
      this.dialog.open(InfoAlertComponent, {
        ...MATDIALOG.actionDialog,
        data: {
          title: 'Alert',
          message: 'You have reached the maximum limit for creating Private Tables.'
        }
      });
    } else {
      this.sfsRequestService.onPvtReq(GlobalConstant.PVT_CMD.BUDDY_CREATE_TABLE, null);

      const dialogSub = this.dialog
        .open(CreateTableComponent, MATDIALOG.createTableDialog)
        .afterClosed()
        .subscribe((result: any) => {
          this.openInviteDialog(result);
        });
      this.subscriptions.push(dialogSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getDateformate(dates: string) {
    const dateParts = dates.split('/');
    const day = parseInt(dateParts[1], 10);
    const month = parseInt(dateParts[0], 10) - 1;
    const year = parseInt(dateParts[2].split('|')[0], 10);

    const timePart = dates.split('|')[1].trim();
    const [hourString, minuteString] = timePart.split(':');
    const hour = parseInt(hourString.trim(), 10);
    const minute = parseInt(minuteString.trim(), 10);

    const date = new Date(year, month, day, hour, minute);

    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd MMM | hh:mm a');
  }

  getRhsData(ev: PvtTables) {
    this.PvtTableData = this.PvtTableData.map((data: any) => {
      if (data.configId === ev.configId) {
        return { ...data, isSelected: true };
      }
      return { ...data, isSelected: false };
    });
    this.lobbyService.selectedrhsData.next(ev);
  }

  submit() {
    this.onPvtTableJoin(this.joinTableForm.controls['tableCode'].value);
  }

  onChangejoinText(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isShowError = false;
    this.isbtnDisable = true;
    if (target.value.length >= 11) {
      this.isbtnDisable = false;
    }
  }
}
