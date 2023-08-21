import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { CashierService } from './cashier.service';

describe('CashierService', () => {
  let service: CashierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule]
    });
    service = TestBed.inject(CashierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
