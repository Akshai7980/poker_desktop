import { ChangeDetectorRef } from '@angular/core';
import { LobbyService, ServerCommands, SfsRequestService } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

export interface SfsCommandModel {
  cmd: string;
  data: {
    sfsCommandConst: any;
    userListHavingNonEmptyNotes: any;
  };
  params: {
    gameConfigId: number;
    gameConfigIds: number[];
  };
}

export interface LobbyTournamentMttSocketResModel {
  cmd: string;
  params: {
    allTables: LobbyTournamentMttAllTablesSocketResModel[];
    mttType: string;
  };
}

export interface LobbyTournamentMttAllTablesSocketResModel {
  configId: string;
  status: string;
  userCount: string;
}

export class LobbyModel extends ServerCommands {
  favTableList: Array<number> = [];

  isShowMyFav: boolean = false;

  subscription: Subscription[] = [];

  constructor(
    public sfsRequestService: SfsRequestService,
    public cdr: ChangeDetectorRef,
    public lobbyService: LobbyService
  ) {
    super(true);
  }

  protected onInit() {}

  override initSfsCommands(event: SfsCommandModel) {}
}
