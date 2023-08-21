import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LeaderBoardComponent } from './leader-board.component';

describe('LeaderBoardComponent', () => {
  let component: LeaderBoardComponent;
  let fixture: ComponentFixture<LeaderBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaderBoardComponent],
      providers: [{ provide: MatDialog, useValue: {} }, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
