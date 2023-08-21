import { Injectable } from '@angular/core';
import { APIMethod } from 'src/app/core/constants/api-enum.constants';
import { BaseResponse, NetworkService } from 'projects/shared/src/public-api';
import environment from 'projects/shared/src/environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
import { RAF } from '../constants/app-url.constants';
import { RAFBonusResponse } from '../models/response/raf-bonus.response';
import { KnowMoreResponse } from '../models/response/know-more.response';
import { EarningsPointsResponse } from '../models/response/earnings-point.response';
import { FaqListResponse } from '../models/response/faq-list.response';
import { EarningsActiveResponse } from '../models/response/earnings-active.response';
import { RemindResponse } from '../models/response/remind.response';
import { PayoffHistoryResponse } from '../models/response/payoff-history.response';
import { PayoffHistoryModel } from '../models/view/payoff-history.model';
import { PayoffHistoryRequest } from '../models/request/payoff-history.request';
import { UnclaimedPayoutResponse } from '../models/response/unclaimed-payout.response';
import { RafLeaderboardResponse } from '../models/response/raf-leaderboard.response';
import { RAFBannerResponse } from '../models/response/banner-raf.response';

@Injectable({
  providedIn: 'root'
})
export class RAFService {
  constructor(private readonly networkService: NetworkService) {}

  // get raf-bonus list
  getRafBonusList(userId: number) {
    return this.networkService.call<RAFBonusResponse>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.RAF_BONUS}?userId=${userId}`,
      APIMethod.GET
    );
  }

  // get know more
  getKnowMore() {
    return this.networkService.call<BaseResponse<KnowMoreResponse>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.KNOW_MORE}`,
      APIMethod.GET
    );
  }

  // get earning points
  getEarningPoints() {
    return this.networkService.call<BaseResponse<EarningsPointsResponse>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.EARNING_POINTS}`,
      APIMethod.GET
    );
  }

  // get faq list
  getFaqList() {
    return this.networkService.call<BaseResponse<FaqListResponse[]>>(
      `${environment.config.TOMCAT_HOST + RAF.FAQ_LIST}?section=refer_and_earn`,
      APIMethod.GET
    );
  }

  // get earnings active list
  getEarningsList(status: string) {
    return this.networkService.call<BaseResponse<EarningsActiveResponse[]>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.ACTIVE_EARNINGS}?status=${status}`,
      APIMethod.GET
    );
  }

  // remind API
  getRemind(refereeId: number) {
    return this.networkService.call<BaseResponse<RemindResponse>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.REMIND}?refereeId=${refereeId}`,
      APIMethod.GET
    );
  }

  // get payoffHistory API
  getPayoffHistory(viewModel: PayoffHistoryModel) {
    const bodyData = viewModel.getRequestModel();
    const getPayoffHistory = this.networkService.call<
      PayoffHistoryRequest,
      BaseResponse<PayoffHistoryResponse>
    >(
      environment.config.RAF_TOMCAT_HOST + RAF.PAYOFF_HISTORY,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return getPayoffHistory;
  }

  // unclaimed payout API
  getUnclaimedPayout() {
    return this.networkService.call<BaseResponse<UnclaimedPayoutResponse[]>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.UNCLAIMEDPAYOUT}`,
      APIMethod.GET
    );
  }

  // claim API
  getClaim(campaignId: number) {
    return this.networkService.call<BaseResponse<string>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.CLAIM}?campaignId=${campaignId}`,
      APIMethod.GET
    );
  }

  // raf leaderboard API
  getRafLeaderboard(leaderboardId: number) {
    return this.networkService.call<BaseResponse<RafLeaderboardResponse>>(
      `${environment.config.RAF_TOMCAT_HOST + RAF.RAF_LEADERBOARD}?leaderboardId=${leaderboardId}`,
      APIMethod.GET
    );
  }

  // claim API
  getBannerRaf(client: string, places: string) {
    return this.networkService.call<BaseResponse<RAFBannerResponse>>(
      `${environment.config.TOMCAT_HOST + RAF.BANNER_RAF}?client=${client}&places=${places}`,
      APIMethod.GET
    );
  }

  // Add/Remove Animation Class on/and Dialog Close
  toggleAnimationDialog<T>(dialogRef: MatDialogRef<T>) {
    dialogRef.addPanelClass('dialog-slide-out-right');
    dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      dialogRef.close();
    }, 350);
  }
}
