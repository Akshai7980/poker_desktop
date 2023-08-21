import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-multi-accounting',
  templateUrl: './multi-accounting.component.html',
  styleUrls: ['./multi-accounting.component.scss']
})
export class MultiAccountingComponent {
  assetsImagePath = Paths.imagePath;
}
