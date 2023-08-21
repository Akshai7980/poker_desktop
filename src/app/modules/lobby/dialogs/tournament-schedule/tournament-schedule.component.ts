import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';

export interface TournamentScheduleHeaderModel {
  title: string;
  isIcon: boolean;
}

export interface TournamentScheduleListModel {
  time: string;
  frequency: string;
  tournament: string;
  buyIn: string;
  type: string;
  gtd: string;
}

@Component({
  selector: 'app-tournament-schedule',
  templateUrl: './tournament-schedule.component.html',
  styleUrls: ['./tournament-schedule.component.scss']
})
export class TournamentScheduleComponent {
  assetsImagePath = Paths.imagePath;

  scheduleHeaders: TournamentScheduleHeaderModel[] = [
    {
      title: 'time',
      isIcon: true
    },
    {
      title: 'frequency',
      isIcon: false
    },
    {
      title: 'tournament',
      isIcon: false
    },
    {
      title: 'Buy-In',
      isIcon: true
    },
    {
      title: 'type',
      isIcon: false
    },
    {
      title: 'gtd',
      isIcon: true
    }
  ];

  scheduleList: TournamentScheduleListModel[] = [
    {
      time: '',
      frequency: '3rd-6th nov',
      tournament: 'Big Millions',
      buyIn: '11000',
      type: 'Series',
      gtd: '20,000,000'
    },
    {
      time: '',
      frequency: '6th-12th Feb',
      tournament: 'Deltin Poker Tournament',
      buyIn: '11,000',
      type: 'Series',
      gtd: '55,000'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Turbo 150',
      buyIn: '150',
      type: 'RE',
      gtd: '5,000'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    },
    {
      time: '8:00 AM',
      frequency: 'Daily',
      tournament: 'Classic 100',
      buyIn: '5,000',
      type: 'FO',
      gtd: '250'
    }
  ];

  constructor(public dialogRef: MatDialogRef<TournamentScheduleComponent>) {}

  onClose() {
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }
}
