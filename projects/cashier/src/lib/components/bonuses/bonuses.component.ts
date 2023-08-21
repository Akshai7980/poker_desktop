import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { Cashier, Paths } from '../../constants/app-constants';
import { BonusInfoData } from '../../models/response/bonusInfoResponse.model';
import { CashierService } from '../../services/cashier.service';

export interface BonusPoints {
  title: string;
  points: Array<string>;
}

@Component({
  selector: 'app-bonuses',
  templateUrl: './bonuses.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class BonusesComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  instantBonus: BonusPoints;

  boosterBonus: BonusPoints;

  freeChips: BonusPoints;

  tournamentBonus: BonusPoints;

  toastValue: ToastModel;

  isShowToast: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly cashierService: CashierService,
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<BonusesComponent>
  ) {}

  ngOnInit(): void {
    this.getVipTermsInfo();
    const dialogRefSub: Subscription = this.dialogRef.backdropClick()?.subscribe(() => {
      this.backToCashier();
    });
    this.subscriptions.push(dialogRefSub);
  }

  getVipTermsInfo() {
    const getBonusesInfo$ = this.cashierService.getBonusesInfo();
    const getBonusesInfo: Subscription = getBonusesInfo$.subscribe({
      next: (res: BaseResponse<BonusInfoData>) => {
        if (res.code === Cashier.SUCCESS) {
          this.instantBonus = {
            title: 'Instant Bonus',
            points: [res.data.pageData.ibInfo[0], res.data.pageData.ibInfo[1]]
          };

          this.tournamentBonus = {
            title: 'Tournament Bonus',
            points: [res.data.pageData.tbInfo[0], res.data.pageData.tbInfo[1]]
          };

          this.boosterBonus = {
            title: 'Booster Bonus',
            points: [res.data.pageData.boosterBonusInfo[0], res.data.pageData.boosterBonusInfo[1]]
          };

          this.freeChips = {
            title: 'Free Chips',
            points: [res.data.pageData.freerollInfo[0]]
          };
        }
      },
      error: () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(getBonusesInfo);
  }

  onBack() {
    this.dialog.closeAll();
  }

  backToCashier() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }
}
