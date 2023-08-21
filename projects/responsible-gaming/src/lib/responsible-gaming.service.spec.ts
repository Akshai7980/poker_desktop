import { TestBed } from '@angular/core/testing';

import { ResponsibleGamingService } from './responsible-gaming.service';

describe('ResponsibleGamingService', () => {
  let service: ResponsibleGamingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsibleGamingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
