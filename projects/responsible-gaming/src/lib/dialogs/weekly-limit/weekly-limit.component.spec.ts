import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { WeeklyLimitComponent } from './weekly-limit.component';

describe('WeeklyLimitComponent', () => {
  let component: WeeklyLimitComponent;
  let fixture: ComponentFixture<WeeklyLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeeklyLimitComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
