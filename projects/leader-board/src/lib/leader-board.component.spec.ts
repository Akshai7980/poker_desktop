import { ComponentFixture, TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MATDIALOG } from 'projects/shared/src/public-api';
import { CashGamesComponent } from './components/cash-games/cash-games.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { LeaderBoardComponent } from './leader-board.component';
import { RulesDialogComponent } from './components/dialogs/rules-dialog/rules-dialog.component';
import { FaqDialogComponent } from './components/dialogs/faq-dialog/faq-dialog.component';

describe('LeaderBoardComponent', () => {
  let component: LeaderBoardComponent;
  let fixture: ComponentFixture<LeaderBoardComponent>;
  let cashGamesComponent: CashGamesComponent;
  let tournamentsComponent: TournamentsComponent;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [LeaderBoardComponent],
      providers: [{ provide: MatDialog, useValue: dialog }, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set leagueId to an empty string when event is truthy', () => {
    component.leagueId = '123';
    expect(component.leagueId).toBe('123');
  });

  it('should not change leagueId when event is falsy', () => {
    component.leagueId = '123';
    expect(component.leagueId).toBe('123');
  });

  it('should subscribe to the leagueId of CashGamesComponent when passed as componentRef', () => {
    const mockLeagueId = '123';
    component.handleData(cashGamesComponent);
    cashGamesComponent?.leagueId.next(mockLeagueId);
    expect(component?.leagueId).toBeUndefined();
  });

  it('should subscribe to the leagueId of TournamentsComponent when passed as componentRef', () => {
    const mockLeagueId = '456';
    component.handleData(tournamentsComponent);
    tournamentsComponent?.leagueId.next(mockLeagueId);
    expect(component?.leagueId).toBeUndefined();
  });

  it('should open the RulesDialogComponent dialog', () => {
    component.viewRules();
    expect(dialog.open).toHaveBeenCalledWith(RulesDialogComponent, { ...MATDIALOG.rulesDialog });
  });

  it('should open the RulesDialogComponent dialog', () => {
    component.viewFaq();
    expect(dialog.open).toHaveBeenCalledWith(FaqDialogComponent, { ...MATDIALOG.faqDialog });
  });
});
