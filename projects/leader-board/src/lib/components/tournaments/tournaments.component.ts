import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Paths, MessageConstant, BaseResponse } from 'projects/shared/src/public-api';
import { LeaderBoardListResponse } from '../../models/response/leader-board-list.response';
import {
  LBDataTransformModel,
  LeaderBoardService,
  RHSJoinDataModel
} from '../../services/leader-board.service';
import { ConstantValues, Leaderboard } from '../../constants/app-constants';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['../../../assets/styles/tables.scss', '../../../assets/styles/leaderboard.scss']
})
export class TournamentsComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  assetsImagePath = Paths.imagePath;

  tabClick: string = ConstantValues.ALL;

  joinedTab: boolean = false;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  leaderBoardList: LeaderBoardListResponse[] = [];

  joinedList: LeaderBoardListResponse[] = [];

  tournamentList: LeaderBoardListResponse[] = [];

  @Output() leagueId = new EventEmitter<string>();

  @Output() contestType = new EventEmitter<string>();

  @Output() displayName = new EventEmitter<string>();

  @Output() description = new EventEmitter<string>();

  @Output() showRhs = new EventEmitter<boolean>();

  showSymbol: boolean = true;

  selectedLeagueId: string;

  differenceInDays: number | Date;

  @Input() showJoinStatus: boolean = false;

  constructor(public leaderBoardService: LeaderBoardService) {}

  ngOnInit(): void {
    this.getLeaderBoardList();
    this.subscribeToChanges();
  }

  openJoinedTab(val: string) {
    if (val === ConstantValues.ALL) {
      this.joinedTab = false;
      if (this.tournamentList?.length !== 0) {
        const data: LBDataTransformModel = {
          leagueId: this.tournamentList[0].leagueId,
          contestType: this.tournamentList[0].contestType,
          displayName: this.tournamentList[0].displayName,
          description: this.tournamentList[0].description,
          showRhs: true
        };
        this.leaderBoardService.dataTransformHandler.next(data);
      }
    } else if (val === ConstantValues.JOINED) {
      this.joinedTab = true;
      if (this.joinedList?.length !== 0) {
        const data: LBDataTransformModel = {
          leagueId: this.joinedList[0].leagueId,
          contestType: this.joinedList[0].contestType,
          displayName: this.joinedList[0].displayName,
          description: this.joinedList[0].description,
          showRhs: true
        };
        this.leaderBoardService.dataTransformHandler.next(data);
      } else {
        const data: LBDataTransformModel = {
          leagueId: '',
          contestType: this.joinedList[0]?.contestType,
          displayName: this.joinedList[0]?.displayName,
          description: this.joinedList[0]?.description,
          showRhs: false
        };
        this.leaderBoardService.dataTransformHandler.next(data);
      }
    }
  }

  getLeaderBoardList() {
    const getLeaderBoardList$ = this.leaderBoardService.getLeaderBoardList(
      ConstantValues.LEADERBOARD
    );
    const getLeaderBoardList: Subscription = getLeaderBoardList$.subscribe({
      next: (res: BaseResponse<LeaderBoardListResponse[]>) => {
        if (res.code === Leaderboard.SUCCESS) {
          this.leaderBoardList = res.data;
          this.tournamentList = this.leaderBoardList.filter(
            (item: LeaderBoardListResponse) =>
              item.contestType.toLowerCase() === ConstantValues.TOURNEY ||
              item.contestType.toLowerCase() === ConstantValues.POY
          );
          if (this.tournamentList?.length !== 0) {
            const data: LBDataTransformModel = {
              leagueId: this.tournamentList[0].leagueId,
              contestType: this.tournamentList[0].contestType,
              displayName: this.tournamentList[0].displayName,
              description: this.tournamentList[0].description,
              showRhs: true
            };
            this.leaderBoardService.dataTransformHandler.next(data);
          } else {
            const data: LBDataTransformModel = {
              leagueId: '',
              contestType: this.tournamentList[0]?.contestType,
              displayName: this.tournamentList[0]?.displayName,
              description: this.tournamentList[0]?.description,
              showRhs: false
            };
            this.leaderBoardService.dataTransformHandler.next(data);
          }
          this.joinedList = this.tournamentList.filter(
            (item: LeaderBoardListResponse) => item.isJoined
          );
          if (this.joinedList?.length !== 0) {
            this.selectedLeagueId = this.joinedList[0].leagueId;
            const data: LBDataTransformModel = {
              leagueId: '',
              contestType: this.joinedList[0].contestType,
              displayName: this.joinedList[0].displayName,
              description: this.joinedList[0].description,
              showRhs: true
            };
            this.leaderBoardService.dataTransformHandler.next(data);
          }
        } else {
          this.selectedLeagueId = this.joinedList[0].leagueId;
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: ConstantValues.ERROR_FLAG
          };
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: ConstantValues.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getLeaderBoardList);
  }

  openRhsByLeagueId(
    leagueId: string,
    contestType: string,
    displayName: string,
    description: string
  ) {
    this.selectedLeagueId = leagueId;
    const data: LBDataTransformModel = {
      leagueId: '',
      contestType: '',
      displayName: '',
      description: '',
      showRhs: true
    };
    if (this.tournamentList?.length !== 0) {
      if (leagueId) {
        data.leagueId = leagueId;
      }
      if (contestType) {
        data.contestType = contestType;
      }
      if (displayName) {
        data.displayName = displayName;
      }
      if (description) {
        data.description = description;
      }
    }
    this.leaderBoardService.dataTransformHandler.next(data);
  }

  isWithin24Hours(date: Date): boolean {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const startDate = new Date();
    const endDate = new Date(date);
    this.differenceInDays = this.getDaysDifference(startDate, endDate);

    return date >= twentyFourHoursAgo && date <= currentDate;
  }

  getDaysDifference(startDate: Date, endDate: Date) {
    const oneDay = 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(Number(endDate) - Number(startDate));
    const daysDifference = Math.round(timeDifference / oneDay);
    return daysDifference;
  }

  reflectChanges(changes: RHSJoinDataModel) {
    if (changes.showJoinedStatus) {
      this.showJoinStatus = changes.showJoinedStatus;
    }
  }

  subscribeToChanges() {
    const changes = this.leaderBoardService.dataTransformHandlerRhs.subscribe(
      (data: RHSJoinDataModel) => {
        this.reflectChanges(data);
        this.showJoinStatus = data.showJoinedStatus;
      }
    );
    this.subscriptions.push(changes);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
