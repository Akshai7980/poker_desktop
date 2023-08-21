import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { EarningsComponent } from './earnings.component';

describe('EarningsComponent', () => {
  let component: EarningsComponent;
  let fixture: ComponentFixture<EarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarningsComponent],
      providers: [{ provide: MatDialog, useValue: {} }, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(EarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
