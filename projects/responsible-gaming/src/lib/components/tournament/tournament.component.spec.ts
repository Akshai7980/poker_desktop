import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import PrimengModule from 'src/app/primeng.module';
import { ResponsibleGameService } from '../../services/responsible-game.service';
import { TournamentComponent } from './tournament.component';

describe('TournamentComponent', () => {
  let component: TournamentComponent;
  let fixture: ComponentFixture<TournamentComponent>;
  let mockResponsibleGameServiceSpy: jasmine.SpyObj<ResponsibleGameService>;
  let mockMatDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    // Create mock ResponsibleGameService and MatDialog
    mockResponsibleGameServiceSpy = jasmine.createSpyObj('ResponsibleGameService', [
      'getRestrictTableTab',
      'toValidateSaveData'
    ]);
    mockMatDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [TournamentComponent],
      imports: [ReactiveFormsModule, PrimengModule],
      providers: [
        { provide: ResponsibleGameService, useValue: mockResponsibleGameServiceSpy },
        { provide: MatDialog, useValue: mockMatDialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentComponent);
    component = fixture.componentInstance;

    mockResponsibleGameServiceSpy = TestBed.inject(
      ResponsibleGameService
    ) as jasmine.SpyObj<ResponsibleGameService>;
    mockMatDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    fixture.detectChanges();
    expect(component.tournamentForm).toBeDefined();
    expect(component.selectedLimitRadio).toBe(2);
    expect(component.tournamentForm.get('limits')?.value).toBe(2);
    expect(component.tournamentForm.get('buyInLimit')?.value).toBeNull();
  });

  it('should set the selectedLimitRadio to 1 (SET_LIMIT) and show the buyInLimit input field when clicking on "Select A Buy-in Limit"', () => {
    fixture.detectChanges();
    component.onSelectLimitRadio(1, 'set_limit');
    expect(component.selectedLimitRadio).toBe(1);
    expect(component.showBuyInLimitInputField).toBe(true);
  });

  it('should set the selectedLimitRadio to 2 (PLAY_ALL) and hide the buyInLimit input field when clicking on "Play All Tournaments"', () => {
    fixture.detectChanges();
    component.onSelectLimitRadio(2, 'play_all');
    expect(component.selectedLimitRadio).toBe(2);
    expect(component.showBuyInLimitInputField).toBe(false);
  });

  it('should set the selectedLimitRadio to 3 (RESTRICT_ALL) and hide the buyInLimit input field when clicking on "I Don’t Want To Play Any Tournaments"', () => {
    fixture.detectChanges();
    component.onSelectLimitRadio(3, 'restrict_all');
    expect(component.selectedLimitRadio).toBe(3);
    expect(component.showBuyInLimitInputField).toBe(false);
  });

  it('should enable submit button when selecting a new limit other than the default PLAY_ALL', () => {
    fixture.detectChanges();
    expect(component.enableSubmit).toBe(false);
    component.onSelectLimitRadio(1, 'set_limit');
    expect(component.enableSubmit).toBe(true);
  });

  it('should enable submit button when selecting a new limit other than the default RESTRICT_ALL', () => {
    fixture.detectChanges();
    expect(component.enableSubmit).toBe(false);
    component.onSelectLimitRadio(1, 'set_limit');
    expect(component.enableSubmit).toBe(true);
  });

  it('should disable submit button when selecting the default PLAY_ALL', () => {
    fixture.detectChanges();
    expect(component.enableSubmit).toBe(false);
    component.onSelectLimitRadio(2, 'play_all');
    expect(component.enableSubmit).toBe(false);
  });

  it('should disable submit button when selecting the default RESTRICT_ALL', () => {
    fixture.detectChanges();
    expect(component.enableSubmit).toBe(false);
    component.onSelectLimitRadio(3, 'restrict_all');
    expect(component.enableSubmit).toBe(true);
  });
});
