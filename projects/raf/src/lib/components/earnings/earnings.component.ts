import { Component, Input, OnDestroy, OnInit, Type } from '@angular/core';
import { Paths, BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { EarningTabs } from '../../models/models';
import { ViewSummaryComponent } from '../../dialogs/view-summary/view-summary.component';
import { MATDIALOG } from '../../constants/dialog.constants';
import { ReferNowComponent } from '../../dialogs/refer-now/refer-now.component';
import { EarningsActiveResponse } from '../../models/response/earnings-active.response';
import { RAFService } from '../../services/raf.service';
import { EarningsInactiveResponse } from '../../models/response/earnings-inactive.response';
import { EarningsDroppedResponse } from '../../models/response/earnings-dropped.response';
import { RAF, RAF_CONSTANTS } from '../../constants/app-constants';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  referNow = ReferNowComponent;

  viewSummaryComponent = ViewSummaryComponent;

  referrals: number;

  lifeTimeEarnings: number;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  @Input() inactiveEarningsList: EarningsInactiveResponse[] = [];

  @Input() activeEarningsList: EarningsActiveResponse[] = [];

  @Input() droppedEarningsList: EarningsDroppedResponse[] = [];

  earningTabs: EarningTabs[] = [
    { title: 'active', dotColor: 'bg-primary-success', chipCount: 0 },
    { title: 'inactive', dotColor: 'bg-primary-warning', chipCount: 0 },
    { title: 'dropped', dotColor: 'bg-primary-error', chipCount: 0 }
  ];

  constructor(public dialog: MatDialog, private rafService: RAFService) {}

  ngOnInit(): void {
    const data = window.history.state;
    if (data) {
      this.referrals = data.totalReffered;
      this.lifeTimeEarnings = data.lifeTimeEarning;
    }
    this.getActiveEarnings();
    this.getInactiveEarnings();
    this.getDroppedEarnings();
  }

  earningTabsActive: string = this.earningTabs[0].title;

  onSelectTab(tab: string) {
    this.earningTabsActive = tab;
    this.getShownText(this.earningTabsActive);
  }

  shownText: string = RAF_CONSTANTS.ACTIVE_TEXT;

  getShownText(earningTabsActive: string) {
    switch (earningTabsActive) {
      case 'active':
        this.shownText = RAF_CONSTANTS.ACTIVE_TEXT;
        break;
      case 'inactive':
        this.shownText = RAF_CONSTANTS.INACTIVE_TEXT;
        break;
      case 'dropped':
        this.shownText = RAF_CONSTANTS.DROPPED_TEXT;
        break;
      default:
        this.shownText = RAF_CONSTANTS.INACTIVE_TEXT;
        break;
    }
  }

  openDialog(component: Type<ReferNowComponent | ViewSummaryComponent>) {
    this.dialog.open(
      component,
      component === this.viewSummaryComponent
        ? MATDIALOG.animatedFlexWidthDialog
        : MATDIALOG.animatedSingleDialog
    );
  }

  getActiveEarnings() {
    const getEarningPoints$ = this.rafService.getEarningsList(RAF_CONSTANTS.ACTIVE);
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<EarningsActiveResponse[]>) => {
        if (res.code === RAF.SUCCESS) {
          this.activeEarningsList = res.data;
          this.earningTabs[0].chipCount = this.activeEarningsList.length;
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
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

  getInactiveEarnings() {
    const getEarningPoints$ = this.rafService.getEarningsList(RAF_CONSTANTS.INACTIVE);
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<EarningsInactiveResponse[]>) => {
        if (res.code === RAF.SUCCESS) {
          this.inactiveEarningsList = res.data;
          this.earningTabs[1].chipCount = this.inactiveEarningsList.length;
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
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

  getDroppedEarnings() {
    const getEarningPoints$ = this.rafService.getEarningsList(RAF_CONSTANTS.DROPPED);
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<EarningsDroppedResponse[]>) => {
        if (res.code === RAF.SUCCESS) {
          this.droppedEarningsList = res.data;
          this.earningTabs[2].chipCount = this.droppedEarningsList.length;
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
