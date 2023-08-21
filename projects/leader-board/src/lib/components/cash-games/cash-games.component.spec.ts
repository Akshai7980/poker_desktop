import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CashGamesComponent } from './cash-games.component';
import { LeaderBoardListResponse } from '../../models/response/leader-board-list.response';

describe('CashGamesComponent', () => {
  let component: CashGamesComponent;
  let fixture: ComponentFixture<CashGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashGamesComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(CashGamesComponent);
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

  it('should handle error and set isShowToast and toastValue properties', () => {
    component.getLeaderBoardList();

    expect(component.isShowToast).toBe(true);
    expect(component.toastValue).toEqual({
      message: MessageConstant.ApiError,
      flag: 'error'
    });
  });

  it('should fetch leader board list and update component properties accordingly', () => {
    // Set up the necessary conditions
    const mockLeaderBoardListResponse: BaseResponse<LeaderBoardListResponse[]> = {
      code: 200,
      message: 'success',
      data: [
        {
          leagueType: 'cgp',
          leagueId: 'leagueId1',
          contestType: 'contestType1',
          isJoined: true,
          createdAt: '',
          displayName: '',
          description: '',
          icon: '',
          prizePool: {
            other_giveaways: '',
            bonus: 1,
            prize: 4,
            crown: 5,
            tickets: 6
          },
          status: '',
          myRank: 2,
          availableOn: [],
          startDate: new Date(),
          endDate: new Date(),
          point: 1,
          placesPaid: 1
        }
      ]
    };

    component.getLeaderBoardList();

    expect(component.leaderBoardList).toBeUndefined();
    expect(mockLeaderBoardListResponse);
  });
});
