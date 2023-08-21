import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'projects/shared/src/public-api';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TransactionHistoryComponent } from './transaction-history.component';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      declarations: [TransactionHistoryComponent],
      imports: [HttpClientModule],
      providers: [
        NetworkService,
        {
          provide: Router,
          useValue: mockRouter
        },
        FormBuilder,
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: DialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
