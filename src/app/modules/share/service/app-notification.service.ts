import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationObject } from '../models/app-notification.model';
import { NotificationConstants } from '../constants/shared-module-constants';

@Injectable({
  providedIn: 'root'
})
export class AppNotificationService {
  open = new Subject<NotificationObject | undefined>();

  openNotification(typeParam: string, severityParam: string, messageParam: string) {
    this.open.next({
      type: typeParam,
      severity: severityParam,
      message: messageParam
    });

    // Closing Notification after 3 secs
    const timeout = setTimeout(() => {
      this.closeNotification();
      clearTimeout(timeout);
    }, NotificationConstants.TIMEOUT);
  }

  closeNotification() {
    this.open.next(undefined);
  }
}
