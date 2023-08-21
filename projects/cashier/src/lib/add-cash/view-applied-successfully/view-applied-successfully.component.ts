import { Component, HostBinding, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface BonusDataModel {
  bonusCode: string;
}

@Component({
  selector: 'app-view-applied-successfully',
  templateUrl: './view-applied-successfully.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class ViewAppliedSuccessfullyComponent {
  @HostBinding('class') class = 'd-flex flex-column flex-1 wp100 hp100';

  constructor(
    private dialogRef: MatDialogRef<ViewAppliedSuccessfullyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BonusDataModel
  ) {}

  close() {
    this.dialogRef.close();
  }
}
