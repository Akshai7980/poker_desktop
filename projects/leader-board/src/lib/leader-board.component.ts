import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { MATDIALOG, Paths } from 'projects/shared/src/public-api';

import { CashGamesComponent } from './components/cash-games/cash-games.component';
import { FaqDialogComponent } from './components/dialogs/faq-dialog/faq-dialog.component';
import { RulesDialogComponent } from './components/dialogs/rules-dialog/rules-dialog.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { LBDataTransformModel, LeaderBoardService } from './services/leader-board.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['../assets/styles/leaderboard.scss']
})
export class LeaderBoardComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-1 hp100 ovf-y-auto';

  assetsImagePath = Paths.imagePath;

  tabClick: string = 'live';

  tabsClick: string = 'ranking';

  leagueId: string;

  contestType: string;

  displayName: string;

  description: string;

  showRhs: boolean;

  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    private route: Router,
    private leaderboardService: LeaderBoardService
  ) {}

  ngOnInit(): void {
    const leaderBoardTab = this.localStorageService.getItem('leaderBoardTab');
    if (leaderBoardTab === 'CASH') {
      this.route.navigate(['leaderboard/cash-games']);
    } else if (leaderBoardTab === 'TOURNAMENT') {
      this.route.navigate(['leaderboard/tournaments']);
    } else {
      this.route.navigate(['leaderboard/cash-games']);
    }

    this.subscribeToData();
  }

  subscribeToData() {
    this.leaderboardService.dataTransformHandler.subscribe((data: LBDataTransformModel) => {
      this.leagueId = data.leagueId;
      this.contestType = data.contestType;
      this.displayName = data.displayName;
      this.description = data.description;
    });
  }

  viewRules() {
    this.dialog?.open(RulesDialogComponent, {
      ...MATDIALOG.rulesDialog
    });
  }

  viewFaq() {
    this.dialog.open(FaqDialogComponent, {
      ...MATDIALOG.faqDialog
    });
  }

  handleData(componentRef: CashGamesComponent | TournamentsComponent) {
    if (componentRef instanceof CashGamesComponent) {
      const child: CashGamesComponent = componentRef;
      child.leagueId.subscribe((e: string) => {
        this.leagueId = e;
      });
      child.contestType.subscribe((e: string) => {
        this.contestType = e;
      });
      child.displayName.subscribe((e: string) => {
        this.displayName = e;
      });
      child.description.subscribe((e: string) => {
        this.description = e;
      });
      child.showRhs.subscribe((e: boolean) => {
        this.showRhs = e;
      });
    }

    if (componentRef instanceof TournamentsComponent) {
      const tourney: TournamentsComponent = componentRef;
      tourney.leagueId.subscribe((e: string) => {
        this.leagueId = e;
      });

      tourney.contestType.subscribe((e: string) => {
        this.contestType = e;
      });
      tourney.displayName.subscribe((e: string) => {
        this.displayName = e;
      });
      tourney.description.subscribe((e: string) => {
        this.description = e;
      });
      tourney.showRhs.subscribe((e: boolean) => {
        this.showRhs = e;
      });
    }
  }

  onTabChange(event: Event) {
    if (event) {
      const target = event.target as HTMLInputElement;
      if (target.innerText === 'Cash Games') {
        this.localStorageService.setItem('leaderBoardTab', 'CASH');
      } else if (target.innerText === 'Tournaments') {
        this.localStorageService.setItem('leaderBoardTab', 'TOURNAMENT');
      }
      this.leagueId = '';
      this.contestType = '';
    }
  }
}
