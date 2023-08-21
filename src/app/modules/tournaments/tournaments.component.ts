import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATDIALOG, Paths } from 'projects/shared/src/public-api';
import { Tab, Tournaments, TournamentsStatus } from './models/tournaments.model';
import { TournamentsData, tournamentTab } from './static/static-data';
import { LateRegistrationComponent } from './dialogs/late-registration/late-registration.component';
import { UnregisterComponent } from './dialogs/unregister/unregister.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent {
  assetsImagePath = Paths.imagePath;

  tabs: Tab[] = tournamentTab;

  TOURNAMENTS_STATUS: typeof TournamentsStatus = TournamentsStatus;

  tournamentsData: Tournaments[] = TournamentsData;

  constructor(public dialog: MatDialog) {}

  // Pass either 'INSUFFICIENT_BALANCE' or 'SUFFICIENT_BALANCE' as an argument to check screens
  openRegistrationDialog(val: string) {
    this.dialog.open(LateRegistrationComponent, {
      ...MATDIALOG.RegistrationDialog,
      data: { from: val, component: 'TOURNAMENTS' }
    });
  }

  openUnRegisterDialog(val: string) {
    this.dialog.open(UnregisterComponent, {
      ...MATDIALOG.actionDialog,
      data: { from: val, component: 'TOURNAMENTS' }
    });
  }
}
