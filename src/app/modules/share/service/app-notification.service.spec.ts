import { TestBed } from '@angular/core/testing';

import { AppNotificationService } from './app-notification.service';

describe('AppNotificationService', () => {
  let service: AppNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
