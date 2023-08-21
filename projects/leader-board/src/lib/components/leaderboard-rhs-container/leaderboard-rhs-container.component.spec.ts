import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageConstant, BaseResponse, MATDIALOG } from 'projects/shared/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { JoinResponse } from '../../models/response/join.response';
import { Leaderboard } from '../../constants/app-constants';
import { RankingListResponse } from '../../models/response/ranking-list.response';
import { LeaderboardRhsContainerComponent } from './leaderboard-rhs-container.component';
import { RulesDialogComponent } from '../dialogs/rules-dialog/rules-dialog.component';
import { AdditionalInfo } from '../../models/response/rhs-list.response';

describe('LeaderboardRhsContainerComponent', () => {
  let component: LeaderboardRhsContainerComponent;
  let fixture: ComponentFixture<LeaderboardRhsContainerComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [LeaderboardRhsContainerComponent],
      providers: [{ provide: MatDialog, useValue: dialog }, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardRhsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the tabClick property to the provided value and showRank to false', () => {
    component.tabClick = '';
    component.showRank = true;
    const value = 'example value';
    component.onTabClick(value);
    expect(component.tabClick).toBe(value);
    expect(component.showRank).toBeFalse();
  });

  it('should update rankingList, showRank, ranks, and firstThreeRanks when API call is successful and players list is not empty', () => {
    component.leagueId = 'exampleLeagueId';
    component.rankingList = [];
    component.showRank = false;
    component.ranks = [];
    component.firstThreeRanks = [];
    const mockResponse: BaseResponse<RankingListResponse[]> = {
      code: 200,
      message: 'Success',
      data: [
        {
          additionalInfo: {
            playEndDate: '2023-06-14T07:53:19.000Z',
            playStartDate: '2023-05-25T08:05:06.000Z',
            promoStartDate: '2023-05-24T18:30:00.000Z',
            promoEndDate: '2023-06-15T18:29:59.000Z',
            leagueType: 'mhw',
            shortDescription: 'fbgdfn',
            knowMoreContent: 'no more',
            lastUpdateDate: '2023-05-31T20:45:00.160Z',
            isJoined: true,
            status: 'live',
            leagueId: '',
            displayName: ''
          },
          priceStructure: {
            total: {
              placesPaid: 6,
              totalPrizePool: {
                bonus: 3650,
                prize: 600,
                crown: 210,
                tickets: 4,
                other_giveaways: 3
              }
            },
            rankData: [
              {
                ib: 500,
                bb: 600,
                tb: 0,
                real: 100,
                crown: 60,
                rank: 1,
                tickets: 4,
                other_giveaways: 5
              },
              {
                ib: 400,
                bb: 500,
                tb: 0,
                real: 100,
                crown: 50,
                rank: 2,
                tickets: 0,
                other_giveaways: 5
              },
              {
                ib: 300,
                bb: 400,
                tb: 0,
                real: 100,
                crown: 40,
                rank: 3,
                tickets: 0,
                other_giveaways: 5
              },
              {
                ib: 200,
                bb: 300,
                tb: 0,
                real: 100,
                crown: 30,
                rank: 4,
                tickets: 0,
                other_giveaways: 5
              },
              {
                ib: 100,
                bb: 200,
                tb: 0,
                real: 100,
                crown: 20,
                rank: 5,
                tickets: 0,
                other_giveaways: 5
              },
              {
                ib: 50,
                bb: 100,
                tb: 0,
                real: 100,
                crown: 10,
                rank: 6,
                tickets: 0,
                other_giveaways: 5
              }
            ],
            variableRankData: [
              {
                rank: 1,
                maxCap: '199.00',
                prizePercent: '19.90'
              },
              {
                rank: 2,
                maxCap: '177.00',
                prizePercent: '17.70'
              },
              {
                rank: 3,
                maxCap: '155.00',
                prizePercent: '15.50'
              },
              {
                rank: 4,
                maxCap: '133.00',
                prizePercent: '13.30'
              },
              {
                rank: 5,
                maxCap: '111.00',
                prizePercent: '11.10'
              },
              {
                rank: 6,
                maxCap: '89.00',
                prizePercent: '8.90'
              },
              {
                rank: 7,
                maxCap: '67.00',
                prizePercent: '6.70'
              },
              {
                rank: 8,
                maxCap: '45.00',
                prizePercent: '4.50'
              },
              {
                rank: 9,
                maxCap: '23.00',
                prizePercent: '2.30'
              },
              {
                rank: 10,
                maxCap: '1.00',
                prizePercent: '0.10'
              }
            ]
          },
          players: [
            {
              leagueId: '45rt',
              userName: 'nidhi',
              userId: 17,
              points: 0,
              rank: 4,
              status: 'ENROLLED',
              prizePool: {
                ib: 200,
                bb: 300,
                tb: 0,
                real: 100,
                crown: 30,
                rank: 4,
                tickets: 0,
                other_giveaways: 5
              }
            }
          ],
          leagueHeader: 'Hands',
          leagueInfo: ''
        }
      ]
    };
    expect(mockResponse).toBeDefined();
    component.getRankingList();
    expect(component.showRank).toBeFalse();
  });

  it('should handle API error and show toast message when API call fails', () => {
    component.leagueId = 'exampleLeagueId';
    component.isShowToast = false;
    component.toastValue = { message: '', flag: '' };
    component.getRankingList();
    expect(component.isShowToast).toBeTrue();
    expect(component.toastValue).toEqual({
      message: MessageConstant.ApiError,
      flag: 'error'
    });
  });

  it('should set leagueIdForRank and call getRankingList when leagueId is provided', () => {
    component.leagueId = '';
    spyOn(component, 'getRankingList');
    component.openRanking('exampleLeagueId', '', '', '');
    expect(component.leagueId).toBe('exampleLeagueId');
    expect(component.getRankingList).toHaveBeenCalled();
  });

  it('should not set leagueIdForRank and not call getRankingList when leagueId is not provided', () => {
    component.leagueId = '';
    spyOn(component, 'getRankingList');
    component.openRanking('', '', '', '');
    expect(component.leagueId).toBe('');
    expect(component.getRankingList).not.toHaveBeenCalled();
  });

  it('should call viewRules method if isKnowMoreUrl is false', () => {
    spyOn(component, 'viewRules');
    component.isKnowMoreUrl = false;
    component.onShowKnowMore();
    expect(component.viewRules).toHaveBeenCalled();
  });

  it('should not call viewRules method if isKnowMoreUrl is true', () => {
    spyOn(component, 'viewRules');
    component.isKnowMoreUrl = true;
    component.onShowKnowMore();
    expect(component.viewRules).not.toHaveBeenCalled();
  });

  it('should update properties based on successful API response', () => {
    const mockResponse = {
      code: 200,
      message: 'Success',
      data: {
        CGCList: [
          {
            leagueType: 'mhw',
            contestType: 'CGC',
            leagueId: '45rt',
            displayName: 'fgrt',
            description: 'dvbc',
            prizePool: {
              other_giveaways: 'dfgbn',
              bonus: 3650,
              crown: 210,
              tickets: 4,
              prize: 600
            },
            status: 'live',
            placesPaid: 6,
            isJoined: true,
            myRank: 4
          },
          {
            leagueType: 'mhp',
            contestType: 'CGC',
            leagueId: 'THUR2',
            displayName: 'Poker2.02',
            description: 'ffg hjg ygy ygy ytug ygy',
            prizePool: {
              other_giveaways: 'hgiuo hgfdgtyfg',
              bonus: 3650,
              crown: 210,
              tickets: 4,
              prize: 600
            },
            status: 'live',
            placesPaid: 6,
            isJoined: false
          }
        ],
        additionalInfo: {
          leagueId: 'balraj1',
          displayName: 'POKER2.00',
          promoStartDate: '2023-05-24T18:30:00.000Z',
          promoEndDate: '2023-06-30T18:29:59.000Z',
          knowMoreContent: 'No more',
          shortDescription: 'rada rada',
          isJoined: true
        }
      }
    };
    expect(mockResponse).toBeDefined();
    component.leagueId = 'exampleLeagueId';
    component.getRhsList();
    expect(component.isKnowMoreUrl).toBe(false);
  });

  it('should register successfully and show success toast', () => {
    component.contestType = 'type1';
    component.leagueId = '1';
    const successResponse: BaseResponse<JoinResponse> = {
      code: Leaderboard.SUCCESS,
      data: {
        leagueId: 'THUR2'
      },
      message: 'Success message'
    };

    component.onRegister();

    expect(successResponse).toBeDefined();
    expect(component.showJoin).toBeTrue();
    expect(component.isShowToast).toBeTrue();
    expect(component.toastValue).toEqual({
      message: MessageConstant.ApiError,
      flag: 'error'
    });
  });

  it('should open the RulesDialogComponent dialog with additional data', () => {
    const additionalInfo = {};

    component.viewRules();

    expect(dialog.open).toHaveBeenCalledWith(RulesDialogComponent, {
      ...MATDIALOG.rulesDialog,
      data: additionalInfo
    });
  });

  it('should reset properties and update leagueId and contestType values', () => {
    component.rhsList = [];
    component.todayList = [];
    component.upcomingList = [];
    component.completedList = [];
    component.additionalInfo = new AdditionalInfo();
    component.isKnowMoreUrl = true;
    component.showJoin = true;
    component.showRank = true;
    component.leagueId = 'initialLeagueId';
    component.contestType = 'initialContestType';

    expect(component.rhsList).toEqual([]);
    expect(component.todayList).toEqual([]);
    expect(component.upcomingList).toEqual([]);
    expect(component.completedList).toEqual([]);
    expect(component.isKnowMoreUrl).toBe(true);
    expect(component.showJoin).toBe(true);
    expect(component.showRank).toBe(true);
  });
});
