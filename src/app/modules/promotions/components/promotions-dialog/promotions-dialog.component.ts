import { Component, OnInit } from '@angular/core';
import { Paths } from 'projects/shared/src/public-api';
import { rawContent1, rawContent2, tableData, TableType } from '../../static/data';

export interface PromotionColsDialogModel {
  field: string;
  header: string;
}

export interface PromotionEventDialogModel {
  status: string;
  icon: number;
}

@Component({
  selector: 'app-promotions-dialog',
  templateUrl: './promotions-dialog.component.html',
  styleUrls: ['./promotions-dialog.component.scss']
})
export class PromotionsDialogComponent implements OnInit {
  assetsImagePath = Paths.imagePath;

  rawContent1: string;

  rawContent2: string;

  isToggled: boolean = false;

  cols: Array<PromotionColsDialogModel>;

  tableData: TableType[];

  events: Array<PromotionEventDialogModel>;

  ngOnInit(): void {
    this.rawContent1 = `${rawContent1.slice(0, 264)}... `;
    this.rawContent2 = rawContent2;
    this.cols = [
      { field: 'weeks', header: 'Weeks' },
      { field: 'start date/time', header: 'Start Date/Time' },
      { field: 'end date/time', header: 'End Date/Time' }
    ];
    this.tableData = tableData;
    this.events = [
      {
        status: 'Go to poker Lobby',
        icon: 1
      },
      {
        status: 'Under tourney lobby look for daily Free Tournaments at various times of the day',
        icon: 2
      },
      {
        status: 'Register and let the game begin',
        icon: 3
      }
    ];
  }

  toggleContent() {
    this.isToggled = !this.isToggled;
    if (this.isToggled) {
      this.rawContent1 = rawContent1;
    } else {
      this.rawContent1 = `${rawContent1.slice(0, 264)}... `;
    }
  }
}
