import { TestBed } from '@angular/core/testing';

import { RafService } from './raf.service';

describe('RafService', () => {
  let service: RafService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RafService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
