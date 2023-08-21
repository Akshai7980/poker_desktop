import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { MessageConstant } from 'projects/shared/src/lib/constants/message-constant';
import { Paths, BaseResponse, MATDIALOG } from 'projects/shared/src/public-api';
import { interval } from 'rxjs/internal/observable/interval';
import { RulesDialogComponent } from '../dialogs/rules-dialog/rules-dialog.component';
import {
  LBDataTransformModel,
  LeaderBoardService,
  RHSJoinDataModel
} from '../../services/leader-board.service';
import { AdditionalInfo, Cgclist, RhsListResponse } from '../../models/response/rhs-list.response';
import {
  AdditionalInfos,
  Player,
  PriceStructure,
  RankData,
  RankingListResponse,
  VariableRankData
} from '../../models/response/ranking-list.response';
import { RegisterModel } from '../../models/view/register.model';
import { ConstantValues, Leaderboard, MaxValue } from '../../constants/app-constants';
import { JoinResponse } from '../../models/response/join.response';

@Component({
  selector: 'app-leaderboard-rhs-container',
  templateUrl: './leaderboard-rhs-container.component.html',
  styleUrls: ['./leaderboard-rhs-container.component.scss']
})
export class LeaderboardRhsContainerComponent implements OnDestroy, OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  assetsImagePath = Paths.imagePath;

  tabsClick: string = 'ranking';

  rhsList: Cgclist[];

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  @Input() leagueId: string;

  @Input() contestType: string;

  @Input() displayName: string;

  @Input() description: string;

  @Input() showRhs: boolean = true;

  isKnowMoreUrl = false;

  showJoin: boolean = true;

  userName: string;

  prizeData: PriceStructure;

  variableRankData: VariableRankData[] = [];

  prizeInfo: RankData[] = [];

  shortDescriptionCGP: string;

  differenceInDays: number | Date;

  constructor(
    private dialog: MatDialog,
    private leaderBoardService: LeaderBoardService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.subscribeToChanges();
  }

  rankingList: RankingListResponse[] = [];

  tabClick: string = ConstantValues.TODAY;

  additionalInfo: AdditionalInfo = new AdditionalInfo();

  contentHeight: number = 0;

  myIdentifier: ElementRef;

  ranks: Player[] = [];

  pendingRanks: Player[] = [];

  firstThreeRanks: Player[] = [];

  showRank: boolean = false;

  todayList: Cgclist[] = [];

  upcomingList: Cgclist[] = [];

  completedList: Cgclist[] = [];

  rankingAdditionalData: AdditionalInfos;

  showSymbol: boolean = true;

  headerValue: string;

  headerInfo: string;

  showEmptyleaderBoard: boolean = false;

  showEmptyPrizeRow: boolean = false;

  startTime: Date;

  currentDate = new Date();

  timeDifference: number;

  timer: number;

  days: number;

  minutes: number;

  hours: number;

  remainingTime: string = '0D : 0H : 0M';

  joinedStatus: boolean = false;

  displayNameCGP: string;

  descriptionCGP: string;

  shortDescription: string;

  reflectChanges(changes: LBDataTransformModel) {
    this.rhsList = [];
    this.todayList = [];
    this.upcomingList = [];
    this.completedList = [];
    this.additionalInfo = new AdditionalInfo();
    this.isKnowMoreUrl = false;
    this.showRank = false;
    this.showJoin = true;
    if (changes.leagueId) {
      this.leagueId = changes.leagueId;
      this.showRank = false;
      if (changes.contestType === 'CGP') {
        this.getRhsList();
      } else {
        this.getRankingList();
      }
    }
    if (changes.contestType) {
      this.contestType = changes.contestType;
    }
    if (changes.displayName) {
      this.displayName = changes.displayName;
      this.displayNameCGP = changes.displayName;
    }
    if (changes.description) {
      this.description = changes.description;
      this.descriptionCGP = changes.description;
    }
    if (changes.showRhs) {
      this.showRhs = changes.showRhs;
    }
  }

  viewRules() {
    this.dialog.open(RulesDialogComponent, {
      ...MATDIALOG.rulesDialog,
      data: { ...this.additionalInfo }
    });
  }

  getRhsList() {
    const getRhsList$ = this.leaderBoardService.getRhsList(
      ConstantValues.LEADERBOARD,
      this.leagueId
    );
    const getRhsList: Subscription = getRhsList$.subscribe({
      next: (res: BaseResponse<RhsListResponse>) => {
        if (res.code === Leaderboard.SUCCESS) {
          this.rhsList = res.data.CGCList;
          this.additionalInfo = res.data.additionalInfo;
          this.showJoin = true;
          this.shortDescription = this.additionalInfo.shortDescription;
          this.shortDescriptionCGP = this.shortDescription;
          this.startTime = new Date(this.additionalInfo.playStartDate);
          const intervalTime = interval(MaxValue.INTERVAL).subscribe(() => {
            const currentTime = new Date();
            const timeDifference = this.startTime.getTime() - currentTime.getTime();
            this.remainingTime = this.formatCountdown(timeDifference);
          });
          this.subscriptions.push(intervalTime);
          this.isKnowMoreUrl = !!this.leaderBoardService.validURL(
            this.additionalInfo.knowMoreContent
          );
          this.todayList = this.rhsList.filter(
            (item: Cgclist) => item.status === ConstantValues.LIVE
          );
          this.upcomingList = this.rhsList.filter(
            (item: Cgclist) =>
              item.status !== ConstantValues.LIVE && item.status !== ConstantValues.COMPLETED
          );
          this.completedList = this.rhsList.filter(
            (item: Cgclist) => item.status === ConstantValues.COMPLETED
          );
        } else {
          this.showEmptyleaderBoard = true;
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
    this.subscriptions.push(getRhsList);
  }

  formatCountdown(seconds: number) {
    if (Number.isNaN(seconds)) {
      return '0D : 0H : 0M';
    }
    let remainingTime = seconds;
    const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
    remainingTime -= days * 24 * 60 * 60 * 1000;
    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    remainingTime -= hours * 60 * 60 * 1000;
    const minutes = Math.floor(remainingTime / (60 * 1000));

    if (days === 0 && hours === 0 && minutes > 0) {
      return `${minutes}Min`;
    }

    return `${days.toString().padStart(2, '0')}D : ${hours.toString().padStart(2, '0')}H : ${minutes
      .toString()
      .padStart(2, '0')}M`;
  }

  onShowKnowMore() {
    if (!this.isKnowMoreUrl) {
      this.viewRules();
    }
    const timeVar = setTimeout(() => {
      const height: number = this.myIdentifier?.nativeElement?.offsetHeight ?? 0;
      if (height && !Number.isNaN(height)) {
        this.contentHeight = height - 56;
      }
      clearTimeout(timeVar);
    }, 100);
  }

  getRankingList() {
    const getRankList$ = this.leaderBoardService.getRankingList(this.leagueId);
    const getRankList: Subscription = getRankList$.subscribe({
      next: (res: BaseResponse<RankingListResponse[]>) => {
        if (res.code === Leaderboard.SUCCESS) {
          this.rankingList = res.data;
          this.prizeInfo = this.rankingList[0]?.priceStructure?.rankData;
          this.additionalInfo = this.rankingList[0]?.additionalInfo;
          this.headerValue = this.rankingList[0]?.leagueHeader;
          this.headerInfo = this.rankingList[0]?.leagueInfo;
          this.startTime = new Date(this.additionalInfo.playStartDate);
          const intervalTime = interval(MaxValue.INTERVAL).subscribe(() => {
            const currentTime = new Date();
            const timeDifference = this.startTime.getTime() - currentTime.getTime();
            this.remainingTime = this.formatCountdown(timeDifference);
          });
          this.subscriptions.push(intervalTime);
          this.showRank = true;
          if (this.rankingList[0]?.players?.length !== 0) {
            this.showRank = true;
            this.ranks = this.rankingList[0]?.players;
            this.pendingRanks = this.ranks.slice(4);
            if (
              this.ranks[0]?.prizePool !== null &&
              (Object.keys(this.ranks[0]?.prizePool).length !== 0 ||
                Object.keys(this.ranks[0]?.prizePool).length === 0)
            ) {
              const ranksCopy = Object.create(this.ranks);
              this.firstThreeRanks =
                ranksCopy.filter(
                  (element: Player) =>
                    element.rank === 1 || element.rank === 2 || element.rank === 3
                ) || [];
              const timer = setInterval(() => {
                this.timeDifference -= 60000;
                this.remainingTime = this.formatCountdown(this.timeDifference);
                if (this.timeDifference <= 0) {
                  clearInterval(timer);
                }
              }, 60000);
            }
          } else {
            const user = this.localStorageService.getItem('userLoginDetails');
            this.userName = user?.userName;
            this.showEmptyleaderBoard = true;
          }
          if (this.rankingList[0]?.priceStructure !== null) {
            this.prizeData = this.rankingList[0]?.priceStructure;
            this.variableRankData = this.prizeData?.variableRankData;
            this.showEmptyPrizeRow = false;
          } else {
            const user = this.localStorageService.getItem('userLoginDetails');
            this.userName = user?.userName;
            this.showEmptyPrizeRow = true;
          }
        } else {
          const user = this.localStorageService.getItem('userLoginDetails');
          this.userName = user?.userName;
          this.showEmptyPrizeRow = true;
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
    this.subscriptions.push(getRankList);
  }

  openRanking(leagueId: string, contestType: string, displayName: string, description: string) {
    if (leagueId) {
      this.leagueId = leagueId;
      this.contestType = contestType;
      this.displayName = displayName;
      this.description = description;
      this.getRankingList();
    }
  }

  onTabClick(val: string) {
    this.tabClick = val;
    this.showRank = false;
  }

  onRegister() {
    const register = new RegisterModel();
    register.clear();
    register.contestType = this.contestType;
    register.leagueId = this.leagueId;
    const registerData$ = this.leaderBoardService.register(register);
    const registerData: Subscription = registerData$.subscribe({
      next: (res: BaseResponse<JoinResponse>) => {
        if (res.code === Leaderboard.SUCCESS) {
          this.showJoin = false;
          this.joinedStatus = true;
          const data: RHSJoinDataModel = {
            showJoinedStatus: true
          };
          this.leaderBoardService.dataTransformHandlerRhs.next(data);
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.SuccessfullJoin,
            flag: ConstantValues.SUCCESS_FLAG
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
    this.subscriptions.push(registerData);
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

  backToCgcList() {
    this.showRank = false;
    this.displayName = this.displayNameCGP;
    this.description = this.descriptionCGP;
    this.shortDescription = this.shortDescriptionCGP;
  }

  subscribeToChanges() {
    const changes = this.leaderBoardService.dataTransformHandler.subscribe(
      (data: LBDataTransformModel) => {
        this.reflectChanges(data);
        this.showRhs = data.showRhs;
      }
    );
    this.subscriptions.push(changes);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
