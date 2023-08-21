import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CurrencyFormatPipe } from 'projects/shared/src/public-api';

import { ReferFriendComponent } from './refer-friend.component';

describe('ReferFriendComponent', () => {
  let component: ReferFriendComponent;
  let fixture: ComponentFixture<ReferFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferFriendComponent, CurrencyFormatPipe],
      imports: [MatDialogModule],
      providers: [HttpClient, HttpHandler, { provide: MatDialog, useValue: {} }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
