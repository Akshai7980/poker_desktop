import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { CashierService } from './cashier.service';

describe('CashierService', () => {
  let service: CashierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
      imports: [MatDialogModule]
    });
    service = TestBed.inject(CashierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
