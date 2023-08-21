import { ChangeDetectorRef, Directive } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  List,
  Table
} from 'projects/shared/src/lib/models/response/createPrivateTableData.response.model';
import {
  BroadcastService,
  GlobalConstant,
  LobbyService,
  MessageConstant,
  ServerCommands,
  SfsRequestService,
  UtilityService
} from 'projects/shared/src/public-api';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { InviteYourFriendComponent } from '../../dialogs/invite-your-friend/invite-your-friend.component';
import { PrivateTable } from './private-table-list';

@Directive()
export class PrivateTableModel extends ServerCommands {
  public isShowCreateTablepopup: boolean;

  public pvtTableParsedArr: Array<List>;

  public pvtTableCurrentConfig: any = {};

  public pvtTableLevel: Table[];

  public pvtTableLevel1: Table;

  public pvtGameType: string;

  public pvtTableSize: number;

  public pvtTableBuyin: string;

  public pvtTableExpiryText: string;

  public pvtTableCurrentId: string;

  public tableData: PrivateTable;

  public pvtErrorMsg: string;

  public errMsg = false;

  public tableList: PrivateTable;

  public toastValue: ToastModel;

  isbtnDisable: boolean = true;

  public isShowToast: boolean = false;

  isShowBuyInPopup: boolean;

  buyInPopupData: any;

  isShowError: boolean;

  InviteDialogInstance: MatDialogRef<InviteYourFriendComponent>;

  isOpenCreateDialog: boolean = false;

  constructor(
    public sfsRequestService: SfsRequestService,
    public cdr: ChangeDetectorRef,
    public lobbyService: LobbyService,
    public broadcastService: BroadcastService,
    public utilService: UtilityService
  ) {
    super(true);
  }

  onInit() {
    this.isShowCreateTablepopup = false;
    this.tableData = [];
    const timeout = setTimeout(() => {
      this.sfsRequestService.onPvtReq(GlobalConstant.PVT_CMD.BUDDY_LIST_TABLES);
      clearInterval(timeout);
    }, 1000);
  }

  override initSfsCommands(event: any) {
    switch (event.cmd) {
      case 'bdy.list':
        this.tableData = event.params.BuddyTableList;
        this.lobbyService.PrivateTableList.next(event.params.BuddyTableList);
        break;
      case 'bdy.join':
        this.onPvttableJoinReq(event);
        break;
      case 'bdy.createNew':
        if (event.params.se !== undefined && !event.params.se) {
          this.lobbyService.getPrivateTableCreateData().subscribe(
            (response: any) => {
              if (response.code === 200) {
                if (response.data.list) {
                  this.pvtTableParsedArr = this.parsePvtTableData(response.data.list);

                  this.setCreatePvtTable(0);
                }
              }
            },
            () => {
              this.isShowToast = true;
              this.toastValue = {
                message: MessageConstant.ErrorHandHistory,
                flag: 'error'
              };
            }
          );
        } else if (event.params.se === undefined) {
          this.onPvtTableCreate(event);
        }
        break;
      case 'lobby.buyindata':
        if (event.params.fRoom === '') {
          const { params } = event;
          if (this.isShowBuyInPopup) {
            // If buyin form already open / then ignore and reject other lobby buyindata command
            params.sid = params.sid || -1;

            if (params.srName && params.sid && params.srName !== '' && params.sid !== -1) {
              this.sfsRequestService.requestForCancelGamePlay(
                params.srName,
                params.sid,
                params.gcId
              );
            }
          } else {
            this.isShowBuyInPopup = true;
            this.buyInPopupData = params;
            const buyInParse = JSON.parse(this.buyInPopupData.bid);
            this.buyInPopupData.isDecimalTable = buyInParse.idt;
            this.buyInPopupData.cashBal =
              buyInParse.rcd - buyInParse.tb + (buyInParse.vcd - buyInParse.vtb);
            this.cdr.detectChanges();
          }
        }
        break;
      case 'lobby.play':
        // this.msgDialogService.open(MessageConstant.roomDonotExistError, {
        //   dialogTitle: 'ROOM JOIN ERROR',
        //   showCancelButton: false
        // });
        break;
      default:
        break;
    }
  }

  onPvttableJoinReq(data: any) {
    const obj = data.params;

    const mesg: any = MessageConstant.pvtTableJoinTableMsg;
    if (obj.msg === 0) {
      this.isShowToast = true;
      this.isShowError = true;
      this.isbtnDisable = true;
      this.toastValue = {
        message: mesg[obj.msg],
        flag: 'error'
      };
    } else if (obj.ret) {
      this.isShowToast = true;
      this.isbtnDisable = true;
      this.toastValue = {
        message: mesg[6],
        flag: 'success'
      };
    } else {
      this.isShowError = true;
      this.isShowToast = true;
      this.isbtnDisable = true;

      this.toastValue = {
        message: mesg[obj.msg],
        flag: 'error'
      };
    }
  }

  onGameVariantChange(val = 0) {
    this.setCreatePvtTable(val);
    this.cdr.detectChanges();
  }

  setCreatePvtTable(index = 0) {
    this.pvtTableCurrentConfig = this.pvtTableParsedArr[index];

    this.pvtGameType = this.pvtTableCurrentConfig?.rvText;

    [this.pvtTableSize] = this.pvtTableCurrentConfig.tableSize;
    this.pvtTableLevel = this.getTableLevel();

    [this.pvtTableLevel1] = this.pvtTableLevel;

    this.pvtTableBuyin = this.pvtTableLevel1.buyinK;
    this.pvtTableCurrentId = this.pvtTableLevel1._id;
    this.cdr.detectChanges();
  }

  setTableSize(val: number) {
    this.pvtTableSize = val;
    this.pvtTableLevel = this.getTableLevel();

    [this.pvtTableLevel1] = this.pvtTableLevel;

    this.onBlindChange();
    this.cdr.detectChanges();
  }

  onPvtTableCreate(data: any) {
    const obj = data.params;
    if (obj.ret) {
      this.toastValue = {
        message: MessageConstant.pvtTableCreateSuccess,
        flag: 'success'
      };
    } else {
      const msgString = obj.reason;
      this.toastValue = {
        message: msgString,
        flag: 'error'
      };
    }
  }

  onBlindChange() {
    this.pvtTableBuyin = this.pvtTableLevel1.buyinK;
    this.pvtTableExpiryText = this.pvtTableLevel1.expiryText;
    this.pvtTableCurrentId = this.pvtTableLevel1._id;
    this.cdr.detectChanges();
  }

  parsePvtTableData(data: any) {
    const tempArr = [];
    let tempObj: any = {};
    for (let i = 0; i < data.length; i += 1) {
      tempObj = {};
      tempObj.tables = Object.entries(this.groupBy(data[i].tables, 'maxp'));
      tempObj.rvText = data[i].rvText;
      tempObj.tableSize = data[i].tableSize.sort((a: any, b: any) => a - b);
      tempArr.push(tempObj);
    }
    return tempArr;
  }

  groupBy(objectArray: any, property: any) {
    return objectArray.reduce((acc: any, obj: any) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }

      const newObj = {
        ...obj,
        blindK: `${obj.sbText}/${obj.bbText}`,
        buyinK: `${obj.buyloText}/${obj.buyhiText}`
      };

      acc[key].push(newObj);
      return acc;
    }, {});
  }

  getTableLevel() {
    return this.pvtTableCurrentConfig.tables.find(
      (tab: any) => tab[0] === this.pvtTableSize.toString()
    )[1];
  }

  sendReqToCreatePvt() {
    const param: any = {};
    param._id = this.pvtTableCurrentId;

    this.sfsRequestService.onPvtReq(GlobalConstant.PVT_CMD.BUDDY_CREATE_TABLE, param);

    this.isShowCreateTablepopup = false;

    this.lobbyService.PrivateTableList.next(this.tableList);
  }

  onPvtTableJoin(pnrCode: any) {
    if (pnrCode) {
      this.sfsRequestService.onPvtReq(GlobalConstant.PVT_CMD.BUDDY_JOIN_TABLE, pnrCode);
    }
  }
}
