import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface AlertData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class InfoAlertComponent {
  message: AlertData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertData, public dilogref: DialogRef) {
    this.message = data;
  }

  close() {
    this.dilogref.close();
  }
}
