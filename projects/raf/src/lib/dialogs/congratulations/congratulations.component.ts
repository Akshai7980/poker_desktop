import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
