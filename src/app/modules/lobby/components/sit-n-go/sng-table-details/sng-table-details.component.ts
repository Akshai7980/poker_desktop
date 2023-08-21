import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  APIResponseCode,
  BaseResponse,
  BlindStructureResponse,
  LobbyService,
  MATDIALOG,
  Paths,
  SngTableDetailsResponse,
  SngWinnerDataResponse
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';
import { CoreCommonService } from 'src/app/core/services/core-common.service';

import { RegistrationComponent } from '../../../dialogs/registration/registration.component';
import {
  BlindStructureViewModel,
  LeaderBoardViewModel,
  SngList,
  SngListViewModel,
  TableInfoViewModel
} from '../../../models/view/sng-view-model';

@Component({
  selector: 'app-sng-table-details',
  templateUrl: './sng-table-details.component.html',
  styleUrls: ['./sng-table-details.component.scss']
})
export class SngTableDetailsComponent implements OnDestroy, OnChanges {
  assetsImagePath = Paths.imagePath;

  ringVariant: string = '';

  subscriptions: Subscription[] = [];

  sngViewModel = new SngListViewModel([], [], []);

  @Input() data: SngList;

  sngTableHeaders: any[] = [
    {
      title: 'Level'
    },
    {
      title: 'Small Blind '
    },
    {
      title: 'Big Blind'
    },
    {
      title: 'Ante'
    }
  ];

  blindStructureViewModel = new BlindStructureViewModel([]);

  sngLeaderBoardTableHeaders: any[] = [
    {
      title: 'RANK'
    },
    {
      title: 'Players'
    },
    {
      title: 'Prize'
    }
  ];

  leaderBoardViewModel = new LeaderBoardViewModel([]);

  tableInfoViewModel = new TableInfoViewModel();

  sngTableData: SngList;

  isSngTableEmpty: boolean = false;

  constructor(
    private lobbyService: LobbyService,
    private dialog: MatDialog,
    private coreCommonService: CoreCommonService,
    public cdr: ChangeDetectorRef
  ) {
    const isSngTableEmptySub = this.lobbyService.isSngTableEmpty.subscribe((val: boolean) => {
      this.isSngTableEmpty = val;
    });
    this.subscriptions.push(isSngTableEmptySub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.getTableInfo(changes['data'].currentValue?.Id);
      this.getWinnersData(changes['data'].currentValue?.Id);
      this.ringVariant = changes['data'].currentValue?.RingVariant;
      this.getBlindStructure(14);

      const rowClickSub = this.lobbyService.detectSngRowClick.subscribe((res: SngList) => {
        this.sngTableData = res;
        this.cdr.detectChanges();
      });
      this.subscriptions.push(rowClickSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTableInfo(tableId: string) {
    const tblInfoSub = this.lobbyService.getSngTableInfo(tableId).subscribe(
      (resp: BaseResponse<SngTableDetailsResponse>) => {
        if (resp.code === APIResponseCode.SUCCESS) {
          this.tableInfoViewModel.convertToViewModel(resp?.data);
        }
      },
      () => {
        this.isSngTableEmpty = true;
      }
    );
    this.subscriptions.push(tblInfoSub);
  }

  getWinnersData(tableId: string) {
    const dataSub = this.lobbyService
      .getSngWinnerData(tableId)
      .subscribe((resp: BaseResponse<SngWinnerDataResponse>) => {
        if (resp.code === APIResponseCode.SUCCESS) {
          this.leaderBoardViewModel.convertToViewModel(resp?.data);
        }
      });
    this.subscriptions.push(dataSub);
  }

  getBlindStructure(blindType: number) {
    const dataSub = this.lobbyService
      .getBlindStructure(blindType)
      .subscribe((resp: BaseResponse<BlindStructureResponse>) => {
        if (resp.code === APIResponseCode.SUCCESS) {
          this.blindStructureViewModel.convertToViewModel(resp?.data);
        }
      });
    this.subscriptions.push(dataSub);
  }

  openRegistrationDialog(val: string, data: any) {
    this.coreCommonService.loginForCTA(() => {
      const tickets = this.sngTableData.buyInArr.map((item: any) => item.ticketName);

      const dataToSend = {
        userBalance: 0,
        minBuyIn: this.sngTableData.buyInArr[0].amount,
        fee: this.sngTableData.buyInArr[0].fee,
        hasTicket: this.sngTableData.buyInArr.length > 1,
        hasTicketForSNG: this.sngTableData.buyInArr.length > 1,
        tickets: tickets.filter((item: any) => item !== undefined),
        name: data.name
      };

      if (data.status.toLowerCase() === 'registering') {
        this.dialog.open(RegistrationComponent, {
          ...MATDIALOG.RegistrationDialog,
          data: { from: val, component: 'SIT_AND_GO', details: dataToSend }
        });
      }
    });
  }
}
