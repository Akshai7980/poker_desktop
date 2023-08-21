import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';

export interface ThemeDialogData {
  tableImg: string;
  cardName: string;
  backCard: string;
  background: string;
}

@Component({
  selector: 'app-theme-table-preview',
  templateUrl: './theme-table-preview.component.html'
})
export class ThemeTablePreviewComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column hp100';

  assetsImagePath = Paths.imagePath;

  themePath = Paths.themePath;

  tableImg: string;

  selectedCardName: string;

  selectedBackCard: string;

  background: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ThemeDialogData) {}

  ngOnInit(): void {
    this.tableImg = this.data.tableImg;
    this.selectedCardName = this.data.cardName;
    this.selectedBackCard = this.data.backCard;
    this.background = this.data.background;
  }
}
