import { Component, HostBinding, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdditionalInfo } from '../../../models/response/rhs-list.response';

@Component({
  selector: 'app-rules-dialog',
  templateUrl: './rules-dialog.component.html',
  styleUrls: ['../../../../assets/styles/modal.scss', '../../../../assets/styles/buttons.scss']
})
export class RulesDialogComponent {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  constructor(
    public dialogRef: MatDialogRef<RulesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdditionalInfo
  ) {}

  close() {
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }
}
