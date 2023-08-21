import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATDIALOG, Paths } from 'projects/shared/src/public-api';
import { PromotionsDialogComponent } from './components/promotions-dialog/promotions-dialog.component';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent {
  assetsImagePath = Paths.imagePath;

  promotions: any[] = [
    {
      titleText: 'Daily free tournaments',
      subtitletext: 'Play to win ₹5000 with just ₹100 fee',
      imageSrc: 'cash-sprint.svg'
    },
    {
      titleText: 'Fly to Vegas',
      subtitletext: 'Play to win ₹5000 with just ₹100 fee',
      imageSrc: 'fly-vegas.svg'
    },
    {
      titleText: 'Pro Leaderboard',
      subtitletext: 'Play to win ₹5000 with just ₹100 fee',
      imageSrc: 'pro-leaderboard.svg'
    },
    {
      titleText: 'Daily free tournaments',
      subtitletext: 'Play to win ₹5000 with just ₹100 fee',
      imageSrc: 'cash-sprint.svg'
    },
    {
      titleText: 'Fly to Vegas',
      subtitletext: 'Play to win ₹5000 with just ₹100 fee',
      imageSrc: 'fly-vegas.svg'
    },
    {
      titleText: 'Pro Leaderboard',
      subtitletext: 'Play to win ₹5000 with just ₹100 fee',
      imageSrc: 'pro-leaderboard.svg'
    }
  ];

  promotionCrousels: any[] = [
    {
      imageSrc: 'counterstrk.svg'
    },
    {
      imageSrc: 'counterstrk.svg'
    },
    {
      imageSrc: 'counterstrk.svg'
    }
  ];

  constructor(public dialog: MatDialog) {}

  openPromotionDialog() {
    this.dialog.open(PromotionsDialogComponent, MATDIALOG.promotionsDialog);
  }
}
