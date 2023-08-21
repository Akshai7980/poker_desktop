import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { BaseResponse, MessageConstant, Paths } from 'projects/shared/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { LeaderBoardMonthData } from '../../models/models';
import { leaderBoardMonthData } from '../../static/data';
import { KnowMoreComponent } from '../../dialogs/know-more/know-more.component';
import { MATDIALOG } from '../../constants/dialog.constants';
import { RAFService } from '../../services/raf.service';
import {
  LeaderboardUsersDto,
  RafLeaderboardResponse
} from '../../models/response/raf-leaderboard.response';
import { RAF, RAF_CONSTANTS } from '../../constants/app-constants';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 gap16';

  assetsImagePath = Paths.imagePath;

  constructor(public dialog: MatDialog, private rafService: RAFService) {}

  monthTabs: string[] = [];

  selectedMonthTab: string = this.monthTabs[0];

  leaderboardList: RafLeaderboardResponse;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  leaderboardUsersDTO: LeaderboardUsersDto[] = [];

  leaderboardId: number = -1;

  ngOnInit(): void {
    this.getRafLeaderboard();
  }

  onSelectMonthTab(tab: string) {
    this.selectedMonthTab = tab;
    if (this.selectedMonthTab === this.leaderboardList.previousLeaderboardName) {
      this.leaderboardId = this.leaderboardList.previousLeaderboardId;
      this.getRafLeaderboard();
    } else {
      this.leaderboardId = -1;
      this.getRafLeaderboard();
    }
  }

  leaderBoardMonthData: LeaderBoardMonthData[] = leaderBoardMonthData;

  openDialog() {
    this.dialog.open(KnowMoreComponent, {
      ...MATDIALOG.animatedSingleDialog,
      data: { from: RAF_CONSTANTS.LEADERBOARD }
    });
  }

  getRafLeaderboard() {
    const getRafLeaderboard$ = this.rafService.getRafLeaderboard(this.leaderboardId);
    const getRafLeaderboard: Subscription = getRafLeaderboard$.subscribe({
      next: (res: BaseResponse<RafLeaderboardResponse>) => {
        if (res.code === RAF.SUCCESS) {
          this.leaderboardList = res.data;
          this.leaderboardUsersDTO = this.leaderboardList.leaderboardUsersDTO;
          this.monthTabs = [];
          this.monthTabs.push(this.leaderboardList.currentLeaderboardName);
          [this.selectedMonthTab] = this.monthTabs;
          if (
            this.leaderboardList.previousLeaderboardId ||
            this.leaderboardList.previousLeaderboardName
          ) {
            this.monthTabs.push(this.leaderboardList.previousLeaderboardName);
          }
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getRafLeaderboard);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
