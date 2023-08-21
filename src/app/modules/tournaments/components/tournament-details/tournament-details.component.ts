import { Component } from '@angular/core';
import { Tournaments, TournamentsStatus } from '../../models/tournaments.model';
import { TournamentsData } from '../../static/static-data';

@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.scss']
})
export class TournamentDetailsComponent {
  TOURNAMENTS_STATUS: typeof TournamentsStatus = TournamentsStatus;

  tournamentsData: Tournaments[] = TournamentsData;
}
