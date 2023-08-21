import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html'
})
export class MyStatsComponent {
  assetsImagePath = Paths.imagePath;

  tabId: number;

  onTabSelection(tabId: number) {
    this.tabId = tabId;
  }
}
