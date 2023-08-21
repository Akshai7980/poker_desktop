import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paths } from 'projects/shared/src/public-api';
import { TournamentsDialogData } from '../../models/tournaments.model';

@Component({
  selector: 'app-late-registration',
  templateUrl: './late-registration.component.html'
})
export class LateRegistrationComponent {
  assetsImagePath = Paths.imagePath;

  tickets: string[] = ['SUP50TCKT'];

  selectedRegRadio: string = '';

  selectedRegMoneyRadio: string = '';

  regForm: FormGroup = new FormGroup({});

  showAddCashBtn: boolean = false;

  regMoneyOptionDisabled: boolean = false;

  regTicketOptionDisabled: boolean = false;

  registrationAmount: number = 0;

  fee: number = 0;

  constructor(
    public readonly dialogRef: MatDialogRef<LateRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: TournamentsDialogData,
    private readonly formBuilder: FormBuilder
  ) {
    this.regForm = this.formBuilder.group({
      money: ['', [Validators.required]],
      ticket: ['', [Validators.required]]
    });
  }

  onSelectRegRadio(val: string) {
    this.selectedRegRadio = val;
    this.showAddCashBtn = false;
    this.selectedRegMoneyRadio = '';
  }

  onSelectRegMoneyRadio() {
    this.showAddCashBtn = true;
    this.selectedRegRadio = '';
  }
}
