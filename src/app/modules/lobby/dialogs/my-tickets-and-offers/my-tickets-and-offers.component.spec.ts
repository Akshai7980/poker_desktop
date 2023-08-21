import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MyTicketsAndOffersComponent } from './my-tickets-and-offers.component';

describe('MyTicketsAndOffersComponent', () => {
  let component: MyTicketsAndOffersComponent;
  let fixture: ComponentFixture<MyTicketsAndOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTicketsAndOffersComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        HttpClient,
        HttpHandler,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyTicketsAndOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
