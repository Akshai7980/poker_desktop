import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';

@Component({
  selector: 'app-icons-legend',
  templateUrl: './icons-legend.component.html',
  styleUrls: [
    '../../../../../assets/abstract/_core.scss',
    '../../../../../assets/theme/components/custom.scss'
  ]
})
export class IconsLegendComponent {
  assetsImagePath = Paths.imagePath;

  constructor(
    public dialogRef: MatDialogRef<IconsLegendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  iconsLegend = [
    {
      icon: 'rit.svg',
      title: 'Run it Twice',
      desc: 'When two players are All-in and agree to “Run It Twice”, the remaining board will get dealt twice.'
    },
    {
      icon: 'straddle.svg',
      title: 'Straddle',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing. sit amet'
    },
    {
      icon: 'fast-fold.svg',
      title: 'Fast Fold',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing. sit amet'
    }
  ];

  iconsLegendTournament = [
    {
      title: 'Re-Entry',
      desc: 'Players are allowed to Re-Enter if they are eliminated.',
      isIcon: false,
      shortCode: 'RE'
    },
    {
      title: 'Knockout',
      desc: 'Every time you eliminate a player, you will recieve the cash bounty attached to their head.',
      isIcon: false,
      shortCode: 'KO'
    },
    {
      title: 'Progressive Knockout',
      desc: 'Players collect half of a bounty if they knock a player out, while the other half of the bounty is added to their own head.',
      isIcon: false,
      shortCode: 'PKO'
    },
    {
      title: 'Rebuy + Addon',
      desc: 'Buying more chips when you have lost your entire stack or have fallen to a short stack level. At the end of “Rebuy” period, players will be able to Add-on to their stack.',
      isIcon: false,
      shortCode: 'R+A'
    },
    {
      title: 'Freezeout',
      desc: 'Players are not allowed to Rebuy or Add-on.',
      isIcon: false,
      shortCode: 'FO'
    },
    {
      title: 'Win The Button',
      desc: 'Awards the winner of the previous hand with the Dealer button in next hand.',
      isIcon: true
    },
    {
      title: 'Satty',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing. sit amet',
      isIcon: false,
      shortCode: 'Satty'
    }
  ];

  onClose() {
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }
}
