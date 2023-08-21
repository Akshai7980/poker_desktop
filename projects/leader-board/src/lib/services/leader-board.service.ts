import { Injectable } from '@angular/core';
import { BaseResponse, NetworkService } from 'projects/shared/src/public-api';
import { APIMethod } from 'src/app/core/constants/api-enum.constants';
import { Subject } from 'rxjs/internal/Subject';
import environment from 'projects/shared/src/environments/environment';
import { LEADER_BOARD } from '../constants/app-url.constants';
import { FaqResponse } from '../models/response/faq.resonse';
import { LeaderBoardListResponse } from '../models/response/leader-board-list.response';
import { RhsListResponse } from '../models/response/rhs-list.response';
import { RankingListResponse } from '../models/response/ranking-list.response';
import { RegisterModel } from '../models/view/register.model';
import { RegisterRequest } from '../models/request/register.request';
import { RegexExpression } from '../constants/app-constants';
import { JoinResponse } from '../models/response/join.response';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardService {
  dataTransformHandler = new Subject<LBDataTransformModel>();
  dataTransformHandlerRhs = new Subject<RHSJoinDataModel>();

  constructor(private readonly networkService: NetworkService) {}

  // get faq list
  getFaqList(leaderboard: string) {
    return this.networkService.call<BaseResponse<FaqResponse[]>>(
      `${environment.config.TOMCAT_HOST + LEADER_BOARD.FAQ_LIST}?section=${leaderboard}`,
      APIMethod.GET
    );
  }

  // get leaderboard list
  getLeaderBoardList(leaderboard: string) {
    return this.networkService.call<BaseResponse<LeaderBoardListResponse[]>>(
      `${environment.config.TOMCAT_HOST + LEADER_BOARD.LEADER_BOARD_LIST}?type=${leaderboard}`,
      APIMethod.GET
    );
  }

  // get rhs-list
  getRhsList(leaderboard: string, leagueId: string) {
    return this.networkService.call<BaseResponse<RhsListResponse>>(
      `${
        environment.config.TOMCAT_HOST + LEADER_BOARD.RHS_LIST
      }?type=${leaderboard}&leagueId=${leagueId}`,
      APIMethod.GET
    );
  }

  // regex for url
  validURL(str: string) {
    const regex = new RegExp(RegexExpression.knowMoreUrl);
    if (!regex.test(str)) {
      return false;
    }
    return true;
  }

  // get ranking list
  getRankingList(leagueId: string) {
    return this.networkService.call<BaseResponse<RankingListResponse[]>>(
      `${environment.config.TOMCAT_HOST + LEADER_BOARD.RANKING_LIST}?leagueId=${leagueId}`,
      APIMethod.GET
    );
  }

  // register on join
  register(viewModel: RegisterModel) {
    const bodyData = viewModel.getRequestModel();
    const register = this.networkService.call<RegisterRequest, BaseResponse<JoinResponse>>(
      environment.config.TOMCAT_HOST + LEADER_BOARD.REGISTER_LIST,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return register;
  }
}

export interface LBDataTransformModel {
  leagueId: string;
  contestType: string;
  displayName: string;
  description: string;
  showRhs: boolean;
}

export interface RHSJoinDataModel {
  showJoinedStatus: boolean;
}
