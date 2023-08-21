import { Component, HostBinding, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimationOptions } from 'ngx-lottie';
import { Paths } from '../../constants/app-constants';

@Component({
  selector: 'app-congratulations-dialog',
  templateUrl: './congratulations-dialog.component.html'
})
export class CongratulationsDialogComponent {
  @HostBinding('class') class = 'p-rel';

  assetsImagePath = Paths.imagePath;

  options: AnimationOptions = {
    path: '/assets/animations/animation.json'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
