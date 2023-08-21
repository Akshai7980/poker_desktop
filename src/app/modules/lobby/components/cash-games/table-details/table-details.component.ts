import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  APIResponseCode,
  Paths,
  BaseResponse,
  LobbyService,
  ToastTime,
  WindowCommService,
  WindowManagerConstant
} from 'projects/shared/src/public-api';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { RingTableInfoResponse } from 'projects/shared/src/lib/models/response/get-table-info.model';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDetailsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  showTableView: boolean = false;

  subscriptions: Subscription[] = [];

  @Input() selectedTable: any;

  currentTableIndex: number = 0;

  tableLength: number = 0;

  showList: boolean = true;

  stopRecursion: boolean = false;

  constructor(
    private lobbyService: LobbyService,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private winCommService: WindowCommService
  ) {}

  ngOnInit(): void {
    const dataSub = this.lobbyService.getSelectedTabAndData().subscribe((res) => {
      this.showList = true;
      if (res && res.data && res.data?.selectedTableId) {
        this.getTableDetails(res.data.selectedTableId);
      } else {
        this.selectedTable = null;
        this.showList = false;
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.push(dataSub);

    const isTableViewSelected = this.localStorageService.getItem('isLobbyTableViewSelected');
    if (isTableViewSelected) {
      this.showTableView = isTableViewSelected;
    }
  }

  getTableDetails(roomId: any) {
    if (this.stopRecursion) return;
    this.stopRecursion = true;
    const tableDetailsSub = this.lobbyService
      .getRingTableInfo(roomId)
      .subscribe((resp: BaseResponse<RingTableInfoResponse>) => {
        if (resp.code === APIResponseCode.AUTH.SUCCESS) {
          this.selectedTable = this.convertRingTableInfoToViewModel(resp.data);
          this.winCommService.currentSelectedTable = this.selectedTable;
          this.lobbyService.joinTable(this.selectedTable.tableId);
          this.cdr.detectChanges();
        }
        const timeoutVar = setTimeout(() => {
          this.stopRecursion = false;
          clearTimeout(timeoutVar);
        }, ToastTime.ONESECOND);
      });
    this.subscriptions.push(tableDetailsSub);
  }

  convertRingTableInfoToViewModel(apiResponse: RingTableInfoResponse) {
    const playerJoinedStatus = this.lobbyService.joinedRooms.includes(apiResponse.roomName);
    const selectedTable: TableDetailsViewModel = {
      avgStack: apiResponse.avgStack,
      roomVacantInfo: apiResponse.roomVacantInfo.toString(),
      tableId: apiResponse.tableId,
      waitListCount: apiResponse.waitListCount.toString(),
      roomNameByPlayOptions: apiResponse.roomName,
      players: [],
      isPlayerJoined: playerJoinedStatus
    };

    apiResponse.playerArr.forEach((element) => {
      const player: PlayerModel = {
        avatar: element.avatar,
        isBB: element.isBB,
        isSB: element.isSB,
        isDealer: element.isD,
        name: element.playerName,
        playerGameChips: element.stackAmt
      };
      selectedTable.players.push(player);
    });
    return selectedTable;
  }

  goToPreviousTable() {
    this.lobbyService.detectTableSelection.next({ tableData: this.selectedTable, isNext: false });
  }

  goToNextTable() {
    this.lobbyService.detectTableSelection.next({ tableData: this.selectedTable, isNext: true });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  toggleView() {
    this.showTableView = !this.showTableView;
    this.localStorageService.setItem('isLobbyTableViewSelected', this.showTableView);
  }

  joinTable() {
    const winData = {
      data: {
        tbl: this.selectedTable.tableId,
        roomName: this.selectedTable.roomNameByPlayOptions
      }
    };
    this.winCommService.openWindow(
      WindowManagerConstant.WINDOW_TYPE.GAMETABLE,
      this.selectedTable.roomNameByPlayOptions,
      winData
    );
  }
}

export interface PlayerModel {
  avatar: string;
  isBB: boolean;
  isDealer: boolean;
  name: string;
  playerGameChips: number;
  isSB: boolean;
}

export interface TableDetailsViewModel {
  avgStack: string;
  roomVacantInfo: string;
  tableId: number;
  waitListCount: string;
  roomNameByPlayOptions: string;
  players: Array<PlayerModel>;
  isPlayerJoined: boolean;
}
