import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeDialogData } from '../theme-table-preview/theme-table-preview.component';

@Component({
  selector: 'app-tourney-theme-table-preview',
  templateUrl: './tourney-theme-table-preview.component.html'
})
export class TourneyThemeTablePreviewComponent implements OnInit {
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
