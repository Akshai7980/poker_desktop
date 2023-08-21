import { TestBed } from '@angular/core/testing';

import { PokerProfileService } from './profile.service';

describe('PokerProfileService', () => {
  let service: PokerProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokerProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
