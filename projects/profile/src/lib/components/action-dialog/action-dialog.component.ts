import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse, MessageConstant, ToastModel } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { Paths } from '../../constants/app-constants';
import { GetSavedCardsRes } from '../../models/response/get-saved-cards-response';
import { DeleteSavedCardsModel } from '../../models/view/delete-saved-cards-model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['../../../assets/components/common.scss', '../../../assets/components/buttons.scss']
})
export class ActionDialogComponent implements OnDestroy {
  isShowToast: boolean = false;

  toastValue: ToastModel;

  result: BaseResponse<GetSavedCardsRes>;

  assetsImagePath = Paths.imagePath;

  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private readonly profileService: ProfileService
  ) {}

  onYes() {
    this.deleteUserSavedCard(this.data);
  }

  onNo() {
    this.dialogRef.close();
  }

  deleteUserSavedCard(cardId: string) {
    const panCardDetails = new DeleteSavedCardsModel();

    panCardDetails.clear();

    panCardDetails.cardId = cardId;

    const deleteSavedCard = this.profileService.deleteSavedCard(panCardDetails).subscribe(
      (res: BaseResponse<GetSavedCardsRes>) => {
        this.result = res;
        this.dialogRef.close(this.result);
      },
      () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    );
    this.subscriptions.push(deleteSavedCard);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
