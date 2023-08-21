import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent {
  assetsImagePath = Paths.imagePath;
}
