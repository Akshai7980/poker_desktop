import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs/internal/Subscription';
import { CongratulationsComponent } from '../congratulations/congratulations.component';
import { MATDIALOG } from '../../constants/dialog.constants';
import { UnclaimedPayoutResponse } from '../../models/response/unclaimed-payout.response';
import { RAFService } from '../../services/raf.service';
import { RAF, RAF_CONSTANTS } from '../../constants/app-constants';

@Component({
  selector: 'app-unclaimed-payout',
  templateUrl: './unclaimed-payout.component.html',
  styleUrls: ['../../../assets/styles/_shared.scss']
})
export class UnclaimedPayoutComponent implements OnDestroy {
  @Input() unclaimedList: UnclaimedPayoutResponse[] = [];

  claimResponse: string;

  campaignId: number;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  constructor(public dialog: MatDialog, private rafService: RAFService) {}

  getClaim() {
    const getEarningPoints$ = this.rafService.getClaim(this.campaignId);
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<string>) => {
        if (res.code === RAF.SUCCESS) {
          this.claimResponse = res.message;
          this.openCongratulationDialog();
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: res.message,
            flag: RAF_CONSTANTS.ERROR_FLAG
          };
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getEarningPoints);
  }

  openDialog(campaignId: number) {
    this.campaignId = campaignId;
    this.getClaim();
  }

  openCongratulationDialog() {
    const timeVar = setTimeout(() => {
      this.dialog.open(CongratulationsComponent, {
        ...MATDIALOG.congratulationsDialog,
        data: this.claimResponse
      });
      clearTimeout(timeVar);
    }, RAF.TIMEOUT);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
