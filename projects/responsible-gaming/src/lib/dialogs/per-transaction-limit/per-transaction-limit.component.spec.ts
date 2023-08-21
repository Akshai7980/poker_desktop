import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PerTransactionLimitComponent } from './per-transaction-limit.component';

describe('PerTransactionLimitComponent', () => {
  let component: PerTransactionLimitComponent;
  let fixture: ComponentFixture<PerTransactionLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerTransactionLimitComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerTransactionLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
