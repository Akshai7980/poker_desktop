import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { LeaderBoardService } from '../../../services/leader-board.service';
import { FaqResponse } from '../../../models/response/faq.resonse';
import { ConstantValues } from '../../../constants/app-constants';

@Component({
  selector: 'app-faq-dialog',
  templateUrl: './faq-dialog.component.html',
  styleUrls: ['../../../../assets/styles/modal.scss']
})
export class FaqDialogComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  faqList: FaqResponse[];

  constructor(
    public dialogRef: MatDialogRef<FaqDialogComponent>,
    public leaderBoardService: LeaderBoardService
  ) {}

  close() {
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  ngOnInit(): void {
    this.getFaqList();
  }

  getFaqList() {
    const getFaqList$ = this.leaderBoardService.getFaqList(ConstantValues.LEADERBOARD);
    const getFaqList: Subscription = getFaqList$.subscribe({
      next: (res: BaseResponse<FaqResponse[]>) => {
        this.faqList = res.data;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: ConstantValues.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getFaqList);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
