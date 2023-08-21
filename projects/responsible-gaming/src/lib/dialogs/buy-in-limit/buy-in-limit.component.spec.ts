import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BuyInLimitComponent } from './buy-in-limit.component';

describe('BuyInLimitComponent', () => {
  let component: BuyInLimitComponent;
  let fixture: ComponentFixture<BuyInLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyInLimitComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyInLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
