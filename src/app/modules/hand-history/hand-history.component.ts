import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { Paths } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-hand-history',
  templateUrl: './hand-history.component.html',
  styleUrls: ['./hand-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HandHistoryComponent {
  @HostBinding('class') class = 'p-rel';

  assetsImagePath = Paths.imagePath;

  cashBtnClicked: boolean = true;
}
