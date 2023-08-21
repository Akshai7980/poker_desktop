import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  BroadcastService,
  LobbyService,
  Paths,
  SfsRequestService,
  UtilityService
} from 'projects/shared/src/public-api';

import { PrivateTableModel } from '../../models/view/private-table.model';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: [
    '../../../../../assets/abstract/_core.scss',
    '../../../../../assets/theme/components/custom.scss'
  ]
})
export class CreateTableComponent extends PrivateTableModel implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  createTableForm: FormGroup = new FormGroup({});

  override tableData: any;

  selectedOption = new FormControl();

  gameType = new FormControl();

  createTable: any;

  private subscriptions: Subscription[] = [];

  selectedOptions: any;

  selectedOption1: any;

  selectedBlind: any;

  constructor(
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public override lobbyService: LobbyService,
    public override sfsRequestService: SfsRequestService,
    public override cdr: ChangeDetectorRef,
    public override broadcastService: BroadcastService,
    public override utilService: UtilityService,
    public dialogref: MatDialogRef<CreateTableComponent>
  ) {
    super(sfsRequestService, cdr, lobbyService, broadcastService, utilService);
  }

  ngOnInit() {
    super.onInit();
    this.createTableForm = this.formBuilder.group({
      players: ['', [Validators.required]],
      blinds: ['', [Validators.required]],
      buyIn: ['', [Validators.required]]
    });
  }

  openInviteDialog() {
    this.sendReqToCreatePvt();
    const privateTableData = this.lobbyService.PrivateTableList.subscribe((res: any) => {
      const datas = res.tables;

      this.createTable = datas[datas.length - 1];

      this.dialogref.close(this.createTable);
    });
    this.subscriptions.push(privateTableData);
  }

  onClose() {
    this.dialogref.addPanelClass('dialog-slide-out-right');
    this.dialogref.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogref.close();
    }, 1000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
