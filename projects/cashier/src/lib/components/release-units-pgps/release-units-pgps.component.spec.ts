import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDateRangePicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CashierService } from '../../services/cashier.service';
import { CustomDateAdapter, ReleaseUnitsPgpsComponent } from './release-units-pgps.component';

describe('ReleaseUnitsPgpsComponent', () => {
  let component: ReleaseUnitsPgpsComponent;
  let fixture: ComponentFixture<ReleaseUnitsPgpsComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<ReleaseUnitsPgpsComponent>>;

  beforeEach(async () => {
    const mockCashierServiceSpy = jasmine.createSpyObj('CashierService', [
      'getFaqData',
      'getReleaseUnitPgpsData'
    ]);
    const mockMatDialogSpy = jasmine.createSpyObj('MatDialog', ['close', 'open']);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, MatDatepickerModule],
      declarations: [ReleaseUnitsPgpsComponent],
      providers: [
        { provide: CashierService, useValue: mockCashierServiceSpy },
        { provide: MatDialog, useValue: mockMatDialogSpy },
        { provide: MatDateRangePicker, useValue: {} },
        { provide: MatDatepickerModule, useValue: {} },
        { provide: CustomDateAdapter, useClass: CustomDateAdapter },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseUnitsPgpsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
