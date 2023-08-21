import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DailyLimitComponent } from './daily-limit.component';

describe('DailyLimitComponent', () => {
  let component: DailyLimitComponent;
  let fixture: ComponentFixture<DailyLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyLimitComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
