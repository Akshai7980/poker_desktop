import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { UnclaimedPayoutComponent } from './unclaimed-payout.component';

describe('UnclaimedPayoutComponent', () => {
  let component: UnclaimedPayoutComponent;
  let fixture: ComponentFixture<UnclaimedPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnclaimedPayoutComponent],
      providers: [{ provide: MatDialog, useValue: {} }, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(UnclaimedPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
