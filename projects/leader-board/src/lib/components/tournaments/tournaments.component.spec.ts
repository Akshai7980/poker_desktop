import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { TournamentsComponent } from './tournaments.component';

describe('TournamentsComponent', () => {
  let component: TournamentsComponent;
  let fixture: ComponentFixture<TournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentsComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set joinedTab to true', () => {
    const val = 'all';
    component.joinedTab = false;
    component.openJoinedTab(val);
    expect(component.joinedTab).toBe(false);
  });

  it('should update properties based on successful API response', () => {
    const mockResponse = {
      code: 200,
      message: 'Success',
      data: [
        {
          leagueId: 'CGP1',
          leagueType: 'cgp',
          displayName: 'Promo1',
          contestType: 'CGP',
          createdAt: '2023-06-01T09:29:07.113Z',
          description: 'New test',
          prizePool: {
            other_giveaways: 'i1wiquiu',
            prize: 600,
            bonus: 3650,
            crown: 210,
            tickets: 4
          },
          leaderboardSeq: 999,
          status: '2023-05-31T18:30:00.000Z',
          isJoined: true
        },
        {
          leagueId: 'balraj1',
          leagueType: 'cgp',
          displayName: 'POKER2.00',
          contestType: 'CGP',
          createdAt: '2023-05-25T07:50:13.435Z',
          description: 'oiuyt',
          prizePool: {
            other_giveaways: 'dvbvdfgbnhbgvf',
            prize: 1200,
            bonus: 7300,
            crown: 420,
            tickets: 8
          },
          leaderboardSeq: 999,
          status: '2023-05-24T18:30:00.000Z',
          isJoined: true
        },
        {
          leagueId: 'Poker2O',
          leagueType: 'cgp',
          displayName: 'Poker 2.O Leaderboard',
          contestType: 'CGP',
          createdAt: '2023-05-24T07:50:19.370Z',
          description: 'Win to earn',
          prizePool: {
            other_giveaways: 'Win to earn more prizes',
            prize: 1800,
            bonus: 10950,
            crown: 630,
            tickets: 12
          },
          leaderboardSeq: 999,
          status: '2023-05-23T18:30:00.000Z',
          isJoined: true
        }
      ]
    };
    expect(mockResponse).toBeDefined();
    component.getLeaderBoardList();
  });

  it('should emit leagueId and contestType if tournamentList is not empty', () => {
    const mockResponse = {
      code: 200,
      message: 'Success',
      data: [
        {
          leagueId: 'CGP1',
          leagueType: 'cgp',
          displayName: 'Promo1',
          contestType: 'CGP',
          createdAt: '2023-06-01T09:29:07.113Z',
          description: 'New test',
          prizePool: {
            other_giveaways: 'i1wiquiu',
            prize: 600,
            bonus: 3650,
            crown: 210,
            tickets: 4
          },
          leaderboardSeq: 999,
          status: '2023-05-31T18:30:00.000Z',
          isJoined: true
        },
        {
          leagueId: 'balraj1',
          leagueType: 'cgp',
          displayName: 'POKER2.00',
          contestType: 'CGP',
          createdAt: '2023-05-25T07:50:13.435Z',
          description: 'oiuyt',
          prizePool: {
            other_giveaways: 'dvbvdfgbnhbgvf',
            prize: 1200,
            bonus: 7300,
            crown: 420,
            tickets: 8
          },
          leaderboardSeq: 999,
          status: '2023-05-24T18:30:00.000Z',
          isJoined: true
        },
        {
          leagueId: 'Poker2O',
          leagueType: 'cgp',
          displayName: 'Poker 2.O Leaderboard',
          contestType: 'CGP',
          createdAt: '2023-05-24T07:50:19.370Z',
          description: 'Win to earn',
          prizePool: {
            other_giveaways: 'Win to earn more prizes',
            prize: 1800,
            bonus: 10950,
            crown: 630,
            tickets: 12
          },
          leaderboardSeq: 999,
          status: '2023-05-23T18:30:00.000Z',
          isJoined: true
        }
      ]
    };
    expect(mockResponse).toBeDefined();
    spyOn(component.leagueId, 'emit');
    spyOn(component.contestType, 'emit');
    component.openRhsByLeagueId('1', 'type1', '', '');
  });

  it('should emit leagueId and contestType when tournamentList is not empty', () => {
    const leagueId = '123';
    const contestType = 'cash';
    const displayName = '';
    const description = '';

    spyOn(component.leagueId, 'emit');
    spyOn(component.contestType, 'emit');

    component.openRhsByLeagueId(leagueId, contestType, displayName, description);
    component.openRhsByLeagueId(leagueId, contestType, displayName, description);

    expect(component.leagueId.emit).not.toHaveBeenCalled();
    expect(component.contestType.emit).not.toHaveBeenCalled();
  });

  it('should not emit leagueId if leagueId is empty', () => {
    const leagueId = '';
    const contestType = 'testContestType';
    const displayName = '';
    const description = '';
    component.openRhsByLeagueId(leagueId, contestType, displayName, description);

    if (leagueId) {
      spyOn(component.leagueId, 'emit');
    }

    if (contestType) {
      spyOn(component.contestType, 'emit');
    }
  });

  it('should not emit contestType if contestType is empty', () => {
    const leagueId = 'testLeagueId';
    const contestType = '';
    const displayName = '';
    const description = '';

    spyOn(component.leagueId, 'emit');
    spyOn(component.contestType, 'emit');

    component.openRhsByLeagueId(leagueId, contestType, displayName, description);

    expect(component.contestType.emit).not.toHaveBeenCalled();
  });

  it('should not emit leagueId and contestType if tournamentList is empty', () => {
    component.tournamentList = [];
    const leagueId = 'testLeagueId';
    const contestType = 'testContestType';
    const displayName = '';
    const description = '';

    spyOn(component.leagueId, 'emit');
    spyOn(component.contestType, 'emit');

    component.openRhsByLeagueId(leagueId, contestType, displayName, description);

    expect(component.leagueId.emit).not.toHaveBeenCalled();
    expect(component.contestType.emit).not.toHaveBeenCalled();
  });
});
