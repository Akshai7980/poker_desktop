import { Component, Input, OnChanges } from '@angular/core';
import { colors } from 'projects/cashier/src/assets/abstract/colorsConfig';
import { CashierConstants, Paths } from '../../constants/app-constants';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {
  assetsImagePath = Paths.imagePath;

  @Input() timelineArray: any[];

  @Input() layout: string = CashierConstants.vertical;

  @Input() adjacentClass?: string;

  crDate: number;

  diffDate: number;

  colors = colors;

  ngOnChanges() {
    let timelineObj = {
      color: this.colors['secondary-success'],
      date: '',
      icon: '',
      reason: '',
      status: '',
      title: CashierConstants.Approved,
      isIndex: true
    };
    if (this.timelineArray?.length === 0) {
      timelineObj = {
        color: this.colors['secondary-success'],
        date: '',
        icon: CashierConstants.two,
        reason: '',
        status: '',
        title: CashierConstants.Approved,
        isIndex: true
      };
      this.timelineArray.push(timelineObj);
    } else if (this.timelineArray?.length === 1) {
      timelineObj = {
        color: this.colors['secondary-success'],
        date: '',
        icon: CashierConstants.two,
        reason: '',
        status: '',
        title: CashierConstants.Approved,
        isIndex: true
      };
      this.timelineArray.push(timelineObj);
      timelineObj = {
        color: this.colors['secondary-success'],
        date: '',
        icon: CashierConstants.three,
        reason: '',
        status: '',
        title: CashierConstants.bankDetails,
        isIndex: true
      };
      this.timelineArray.push(timelineObj);
    } else if (this.timelineArray?.length === 2) {
      timelineObj = {
        color: this.colors['secondary-success'],
        date: '',
        icon: CashierConstants.three,
        reason: '',
        status: '',
        title: CashierConstants.bankDetails,
        isIndex: true
      };
      this.timelineArray.push(timelineObj);
    }
  }
}
