import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paths } from 'projects/shared/src/public-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  assetsImagePath = Paths.imagePath;

  tickets: string[] = [];

  selectedRegRadio: string = '';

  selectedRegMoneyRadio: string = '';

  regForm: FormGroup = new FormGroup({});

  showAddCashBtn: boolean = false;

  regMoneyOptionDisabled: boolean = false;

  regTicketOptionDisabled: boolean = false;

  registrationAmount: number = 0;

  fee: number = 0;

  constructor(
    public readonly dialogRef: MatDialogRef<RegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.regForm = this.formBuilder.group({
      money: ['', [Validators.required]],
      ticket: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.toValidateSelection();
  }

  toValidateSelection() {
    this.registrationAmount = this.data.details.minBuyIn;
    this.fee = this.data.details.fee;
    this.tickets = this.data.details.tickets;

    if (
      this.data.details?.userBalance > this.data.details?.minBuyIn &&
      this.data.details?.hasTicket
    ) {
      this.selectedRegRadio = 'ticket-0';
    } else if (
      this.data.details?.userBalance > this.data.details?.minBuyIn &&
      !this.data.details?.hasTicket &&
      this.data.details.hasTicketForSNG
    ) {
      this.selectedRegMoneyRadio = 'money';
    } else if (
      this.data.details?.hasTicket &&
      this.data.details?.userBalance < this.data.details?.minBuyIn
    ) {
      this.selectedRegRadio = 'ticket-0';
    } else if (
      !this.data.details?.hasTicket &&
      this.data.details?.userBalance < this.data.details?.minBuyIn
    ) {
      this.regMoneyOptionDisabled = true;
      this.showAddCashBtn = true;
    } else if (
      this.data.details?.userBalance > this.data.details?.minBuyIn &&
      !this.data.details?.hasTicket &&
      !this.data.details.hasTicketForSNG
    ) {
      this.regTicketOptionDisabled = true;
    }
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

  onClickRegister() {
    this.dialogRef.close();
    this.router.navigate(['/game-table']);
  }
}
