import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import { AppNotificationService } from '../service/app-notification.service';
import { NotificationObject } from '../models/app-notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './app-notification.component.html',
  styleUrls: ['./app-notification.component.scss']
})
export class AppNotificationComponent {
  isVisible: boolean = false;

  data: NotificationObject;

  assetsImagePath = Paths.imagePath;

  constructor(private notification: AppNotificationService) {
    this.assignDefault();
    this.notification.open.subscribe((resp: NotificationObject | undefined) => {
      if (resp) {
        this.isVisible = true;
        this.data = resp;
      } else {
        this.isVisible = false;
        this.assignDefault();
      }
    });
  }

  close() {
    this.notification.closeNotification();
  }

  assignDefault() {
    this.data = {
      type: '',
      severity: '',
      message: ''
    };
  }
}
