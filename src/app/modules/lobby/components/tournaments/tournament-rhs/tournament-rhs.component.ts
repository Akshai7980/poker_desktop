import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PrizeArr,
  TableTournament,
  TournamentRhs,
  WinningArr
} from 'projects/shared/src/lib/models/common/lobby.model';
import { Subscription } from 'rxjs';
import {
  APIResponseCode,
  BaseResponse,
  LobbyService,
  LocalStorageService,
  Paths,
  ScreenId,
  ToastTime,
  WindowManagerConstant
} from 'projects/shared/src/public-api';

@Component({
  selector: 'app-tournament-rhs',
  templateUrl: './tournament-rhs.component.html',
  styleUrls: ['./tournament-rhs.component.scss']
})
export class TournamentRhsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  selectedGame: TableTournament = {} as TableTournament;

  selectedGameRhs: TournamentRhs = {} as TournamentRhs;

  subscriptions: Subscription[] = [];

  intervalVar: any;

  getObjectKeyLength(val: any) {
    return Object.keys(val).length;
  }

  rankPrizeHeaderList: any[] = [
    {
      title: 'RANK'
    },
    {
      title: 'Prize'
    }
  ];

  rankPrizeHeaderList2: any[] = [
    {
      title: 'RANK'
    },
    {
      title: 'Players'
    },
    {
      title: 'Prize'
    },
    {
      title: 'Bounty'
    }
  ];

  rankPrizeHeaderList3: any[] = [
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

  rankPrizeBodyList: any[] = [
    {
      rank: 1,
      icon: 'first-prize-medal.png',
      prize: '₹ 45,054',
      showOrange: true
    },
    {
      rank: 2,
      icon: 'second-prize-medal.png',
      prize: '₹ 45,054',
      showOrange: true
    },
    {
      rank: 3,
      icon: 'third-prize-medal.png',
      prize: '₹ 45,054',
      showOrange: true
    },
    {
      rank: 4,
      icon: null,
      prize: '₹ 45,054',
      showOrange: false
    },
    {
      rank: 5,
      icon: null,
      prize: '₹ 45,054',
      showOrange: false
    },
    {
      rank: 6,
      icon: null,
      prize: '₹ 45,054',
      showOrange: false
    }
  ];

  rankPrizeBodyList2: any[] = [
    {
      rank: 1,
      icon: 'first-prize-medal.png',
      prizes: { money: '₹ 45,054', bonus: '2,000 IB', ticket: '2' },
      player: 'coastlineo',
      bounty: '₹ 2,889',
      bountyCount: 2,
      showOrange: true
    },
    {
      rank: 2,
      icon: 'second-prize-medal.png',
      prizes: { money: '₹ 20,054', bonus: '1,800 IB' },
      player: 'coastlineo',
      bounty: '₹ 2,889',
      bountyCount: 2,
      showOrange: true
    },
    {
      rank: 3,
      icon: 'third-prize-medal.png',
      prizes: { money: '₹ 15,050', bonus: '150 IB' },
      player: 'coastlineo',
      bounty: '₹ 2,889',
      bountyCount: 2,
      showOrange: true
    },
    {
      rank: 4,
      icon: null,
      prizes: { money: '₹ 20,054' },
      player: 'coastlineo',
      bounty: '₹ 2,889',
      bountyCount: 2,
      showOrange: false
    },
    {
      rank: 5,
      icon: null,
      prizes: { money: '₹ 20,054' },
      player: 'coastlineo',
      bounty: '₹ 2,889',
      bountyCount: 2,
      showOrange: false
    },
    {
      rank: 6,
      icon: null,
      prizes: { money: '₹ 20,054' },
      player: 'coastlineo',
      bounty: '₹ 2,889',
      bountyCount: 2,
      showOrange: false
    }
  ];

  rankPrizeBodyList3: any[] = [
    {
      rank: 1,
      icon: 'first-prize-medal.png',
      prizes: { money: '₹ 45,054', bonus: '2,000 IB', ticket: '2' },
      player: 'coastlineo',
      showOrange: true
    },
    {
      rank: 2,
      icon: 'second-prize-medal.png',
      prizes: { money: '₹ 20,054', bonus: '1,800 IB' },
      player: 'coastlineo',
      showOrange: true
    },
    {
      rank: 3,
      icon: 'third-prize-medal.png',
      prizes: { money: '₹ 15,050', bonus: '150 IB' },
      player: 'coastlineo',
      showOrange: true
    },
    {
      rank: 4,
      icon: null,
      prizes: { money: '₹ 20,054' },
      player: 'coastlineo',
      showOrange: false
    },
    {
      rank: 5,
      icon: null,
      prizes: { money: '₹ 20,054' },
      player: 'coastlineo',
      showOrange: false
    },
    {
      rank: 6,
      icon: null,
      prizes: { money: '₹ 20,054' },
      player: 'coastlineo',
      showOrange: false
    }
  ];

  constructor(
    private lobbyService: LobbyService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const tournSub = this.lobbyService.selectedTournamentMtt.subscribe((val: TableTournament) => {
      this.selectedGame = val;
      this.getRhsData();
    });

    this.subscriptions.push(tournSub);
  }

  openTournamentsMttWindow() {
    window.open(
      `${ScreenId.TOURNAMENTS}`,
      `${ScreenId.TOURNAMENTS}`,
      `width=${WindowManagerConstant.WINDOW_SIZE.TOURNAMENTS[0]}px,
      height=${WindowManagerConstant.WINDOW_SIZE.TOURNAMENTS[1]}px`
    );
  }

  getRhsData() {
    const reqParams = {
      configId: this.selectedGame.id,
      UserToken: this.localStorageService.getItem('token')
    };
    const rhsSub = this.lobbyService
      .getLobbyMttRhsData(reqParams)
      .subscribe((res: BaseResponse<TournamentRhs>) => {
        if (res.code === APIResponseCode.SUCCESS) {
          this.selectedGameRhs = res.data;

          if (this.intervalVar) {
            clearInterval(this.intervalVar);
          }
          this.intervalVar = setInterval(() => {
            this.checkRemainingTime(date);
          }, ToastTime.ONESECOND);

          const date: any = new Date(this.selectedGameRhs.startDate);
          const hours = date.getHours();
          const minutes = date.getMinutes();

          const amOrPm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

          this.selectedGameRhs.time = `${formattedHours}:${formattedMinutes} ${amOrPm}`;

          this.selectedGameRhs.month = date.toLocaleString('default', { month: 'short' });
          this.selectedGameRhs.day = date.getDate();
          if (this.selectedGameRhs.status.toLowerCase() === 'running') {
            this.selectedGameRhs.prizeConfig.forEach((val: PrizeArr) => {
              const element = val;
              switch (element.rank) {
                case 1:
                  element.icon = 'first-prize-medal.png';
                  element.isHighlisghted = true;
                  break;
                case 2:
                  element.icon = 'second-prize-medal.png';
                  element.isHighlisghted = true;
                  break;
                case 3:
                  element.icon = 'third-prize-medal.png';
                  element.isHighlisghted = true;
                  break;
                default:
                  element.icon = '';
                  element.isHighlisghted = false;
                  break;
              }
            });
          }
          if (this.selectedGameRhs.status.toLowerCase() === 'completed') {
            this.selectedGameRhs.winner.forEach((val: WinningArr) => {
              const element = val;
              switch (element.rank) {
                case 1:
                  element.icon = 'first-prize-medal.png';
                  element.isHighlisghted = true;
                  break;
                case 2:
                  element.icon = 'second-prize-medal.png';
                  element.isHighlisghted = true;
                  break;
                case 3:
                  element.icon = 'third-prize-medal.png';
                  element.isHighlisghted = true;
                  break;
                default:
                  element.icon = '';
                  element.isHighlisghted = false;
                  break;
              }
            });
          }
        }
      });

    this.subscriptions.push(rhsSub);
  }

  checkRemainingTime(date: any) {
    const currentDate: any = new Date();

    const timeDifferenceMillis = date - currentDate;

    const remainingDays = Math.floor(timeDifferenceMillis / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(
      (timeDifferenceMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const remainingMinutes = Math.floor((timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60));

    let days: string = remainingDays.toString();
    let hours: string = remainingHours.toString();
    let mins: string = remainingMinutes.toString();

    if (remainingDays <= 0) {
      days = '00';
    } else if (remainingDays < 10) {
      days = `0${remainingDays}`;
    }

    if (remainingHours <= 0) {
      hours = '00';
    } else if (remainingHours < 10) {
      hours = `0${remainingHours}`;
    }

    if (remainingMinutes <= 0) {
      mins = '00';
    } else if (remainingMinutes < 10) {
      mins = `0${remainingMinutes}`;
    }

    this.selectedGameRhs.remainingTime = {
      days,
      hours,
      mins
    };

    this.selectedGameRhs.remainingMins = Math.floor(timeDifferenceMillis / (1000 * 60));
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalVar);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
