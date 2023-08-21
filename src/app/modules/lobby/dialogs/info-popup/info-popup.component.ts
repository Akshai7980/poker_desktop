import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: [
    '../../../../../assets/abstract/_core.scss',
    '../../../../../assets/theme/components/custom.scss'
  ]
})
export class InfoPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  userConsent(consent: boolean) {
    this.dialogRef.close(consent);
  }
}
