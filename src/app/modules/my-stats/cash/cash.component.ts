import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.scss']
})
export class CashComponent {
  value = 100;

  assetsImagePath = Paths.imagePath;

  view: any[] = [500, 400];

  // options
  showLegend: boolean = true;

  showLabels: boolean = true;

  single = [
    {
      name: 'Germany',
      value: 8940000
    }
  ];

  constructor() {
    Object.assign(this, this.single);
  }

  getColor(percentage: number) {
    if (percentage === 50) {
      return 'black';
    }
    if (percentage > 80) {
      return 'red';
    }
    return 'green';
  }
}
