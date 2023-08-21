import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TournamentsDialogData } from '../../models/tournaments.model';

@Component({
  selector: 'app-unregister',
  templateUrl: './unregister.component.html'
})
export class UnregisterComponent {
  constructor(
    public dialogRef: MatDialogRef<UnregisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TournamentsDialogData
  ) {}

  userConsent(consent: boolean) {
    this.dialogRef.close(consent);
  }
}
