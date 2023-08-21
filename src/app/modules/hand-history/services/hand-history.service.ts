import { Injectable } from '@angular/core';
import { APIMethod } from 'src/app/core/constants/api-enum.constants';
import { BaseResponse, HAND_HISTORY, NetworkService } from 'projects/shared/src/public-api';
import environment from 'projects/shared/src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { NewUserResponse } from '../models/response/new-user.response.model';
import { HandHistoryListResponse } from '../models/response/hand-history-list.response';

@Injectable({
  providedIn: 'root'
})
export class HandHistoryService {
  constructor(private networkService: NetworkService) {}

  getHandHistoryData(count: number | string, sDt: string, eDt: string, searchBy: string) {
    const url = `${environment.config.WEB_PROTOCOL}://${environment.config.HHR_HOST}${HAND_HISTORY.HAND_HISTORY_DATA}?count=${count}&sDt=${sDt}&eDt=${eDt}&searchBy=${searchBy}`;
    const cashGamesData = this.networkService.call<BaseResponse<HandHistoryListResponse[]>>(
      url,
      APIMethod.GET,
      new Map<string, string>()
    );
    return cashGamesData;
  }

  getHandHistoryListData(gameType: string): Observable<BaseResponse<HandHistoryListResponse[]>> {
    return this.networkService.call<BaseResponse<HandHistoryListResponse[]>>(
      `${environment.config.WEB_PROTOCOL}://${environment.config.HHR_HOST}${HAND_HISTORY.HAND_HISTORY_LIST}?gameType=${gameType}`,
      APIMethod.GET
    );
  }

  getNewUser(): Observable<BaseResponse<NewUserResponse>> {
    return this.networkService.call<BaseResponse<NewUserResponse>>(
      environment.config.TOMCAT_HOST + HAND_HISTORY.NEW_USER,
      APIMethod.GET
    );
  }
}
