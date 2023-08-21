import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse, FLAG, MessageConstant } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { APIResponseCode, Paths } from '../../constants/app-constants';
import { MATDIALOG } from '../../constants/dialog.constants';
import { GetSavedCardsRes } from '../../models/response/get-saved-cards-response';
import { ProfileService } from '../../services/profile.service';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';

export interface SavedCardModel {
  cardId: string;
  cardNumber: string;
  cardType: string;
  cardIssuer: string;
  cardBrand: string;
}

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['../../../assets/components/common.scss']
})
export class ManageCardsComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100';

  assetsImagePath = Paths.imagePath;

  allSavedCards: SavedCardModel[] = [];

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly profileService: ProfileService,
    private dialogRef: MatDialogRef<ManageCardsComponent>
  ) {}

  ngOnInit(): void {
    this.getCardDetails();
  }

  onClose() {
    const profileDialog = this.dialog.getDialogById('poker-profile');
    profileDialog?.close();
    this.goBackToProfile();
  }

  openActionDialog(cardId: string) {
    const data = cardId;
    const dialogRef = this.dialog.open(ActionDialogComponent, { data, ...MATDIALOG.actionDialog });
    const dialog = dialogRef.afterClosed().subscribe((result: BaseResponse<GetSavedCardsRes>) => {
      if (result.code === APIResponseCode.AUTH.SUCCESS) {
        this.allSavedCards.splice(Number(cardId), 1);
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.cardDelete,
          flag: FLAG.success
        };
      } else {
        this.isShowToast = true;
        this.toastValue = {
          message: result?.message,
          flag: FLAG.error
        };
      }
    });
    this.subscriptions.push(dialog);
  }

  getCardDetails() {
    const getSavedCards = this.profileService.getSavedCards().subscribe(
      (res: BaseResponse<GetSavedCardsRes>) => {
        this.allSavedCards = res.data.list;
      },
      (error: Error) => {
        this.isShowToast = true;

        this.toastValue = {
          message: error.message,
          flag: FLAG.error
        };
      }
    );
    this.subscriptions.push(getSavedCards);
  }

  goBackToProfile() {
    this.profileService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
