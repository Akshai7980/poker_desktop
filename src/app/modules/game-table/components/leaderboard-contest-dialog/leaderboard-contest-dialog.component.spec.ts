import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardContestDialogComponent } from './leaderboard-contest-dialog.component';

describe('LeaderboardContestDialogComponent', () => {
  let component: LeaderboardContestDialogComponent;
  let fixture: ComponentFixture<LeaderboardContestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaderboardContestDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardContestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
