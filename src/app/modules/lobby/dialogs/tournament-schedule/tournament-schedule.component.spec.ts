import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TournamentScheduleComponent } from './tournament-schedule.component';

describe('TournamentScheduleComponent', () => {
  let component: TournamentScheduleComponent;
  let fixture: ComponentFixture<TournamentScheduleComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<TournamentScheduleComponent>>;

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['addPanelClass', 'removePanelClass']);
    await TestBed.configureTestingModule({
      declarations: [TournamentScheduleComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MatDialogRef, useValue: mockMatDialogRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
