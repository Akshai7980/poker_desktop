import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-leaderboard-contest-dialog',
  templateUrl: './leaderboard-contest-dialog.component.html',
  styleUrls: ['./leaderboard-contest-dialog.component.scss']
})
export class LeaderboardContestDialogComponent {
  tabClick: string = 'ranks';

  assetsImagePath = Paths.imagePath;
}
