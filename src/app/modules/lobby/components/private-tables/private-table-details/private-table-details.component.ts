import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  APIResponseCode,
  Paths,
  WindowManagerConstant,
  BaseResponse,
  PrivateTableRhsResponse,
  LobbyService
} from 'projects/shared/src/public-api';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import { PvtTables } from '../../../models/view/private-table-list';

@Component({
  selector: 'app-private-table-details',
  templateUrl: './private-table-details.component.html',
  styleUrls: ['./private-table-details.component.scss']
})
export class PrivateTableDetailsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  showTableView: boolean = false;

  createdTable: PvtTables;

  isShowListData: boolean = false;

  rhsData: PrivateTableRhsResponse;

  subscriptions: Subscription[] = [];

  constructor(
    public lobbyService: LobbyService,
    public clipboard: Clipboard,
    private winCommService: WindowCommService
  ) {
    const joinSubscription = this.lobbyService.sfsCommandResult.subscribe((resp) => {
      if (resp.cmd === 'bdy.join') {
        this.onPvtTableJoinReq(resp);
      }
    });
    this.subscriptions.push(joinSubscription);
  }

  ngOnInit() {
    const selectedRhsData = this.lobbyService.selectedrhsData.subscribe((res: PvtTables) => {
      this.isShowListData = true;
      this.createdTable = res;

      this.getPrivateTableRhsData();
    });

    this.subscriptions.push(selectedRhsData);
  }

  getPrivateTableRhsData() {
    const privateRhsData = this.lobbyService
      .getPrivateRHSUserStackData(this.createdTable.configId)
      .subscribe((res: BaseResponse<PrivateTableRhsResponse>) => {
        if (res.code === APIResponseCode.AUTH.SUCCESS) {
          this.rhsData = res.data;
          this.showTableView = false;
        }
      });

    this.subscriptions.push(privateRhsData);
  }

  copyToClipBoard(code: string) {
    this.clipboard.copy(code);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  joinTable() {
    this.lobbyService.joinTable(this.createdTable.pnr, true);
  }

  listToggle() {
    this.showTableView = !this.showTableView;
  }

  onPvtTableJoinReq(data: any) {
    if (data.param.msg === 6 || data.param.msg === 2) {
      const pvtTableData = {
        tableType: 3,
        data: this.createdTable
      };
      this.winCommService.openWindow(
        WindowManagerConstant.WINDOW_TYPE.GAMETABLE,
        '',
        pvtTableData,
        pvtTableData.data.configId,
        true
      );
    }
  }
}
