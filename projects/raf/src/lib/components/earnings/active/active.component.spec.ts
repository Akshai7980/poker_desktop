import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { ActiveComponent } from './active.component';

describe('ActiveComponent', () => {
  let component: ActiveComponent;
  let fixture: ComponentFixture<ActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
