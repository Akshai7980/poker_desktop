import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { RAFService } from '../../services/raf.service';
import { KnowMoreResponse } from '../../models/response/know-more.response';
import { FaqListResponse } from '../../models/response/faq-list.response';
import { RAF_CONSTANTS } from '../../constants/app-constants';

@Component({
  selector: 'app-know-more',
  templateUrl: './know-more.component.html',
  styleUrls: ['../../../assets/styles/_shared.scss']
})
export class KnowMoreComponent implements OnInit, OnDestroy {
  constructor(
    private rafService: RAFService,
    @Inject(MAT_DIALOG_DATA) public readonly data: { from: string },
    private readonly dialogRef: MatDialogRef<KnowMoreComponent>
  ) {}

  @HostBinding('class') class = 'd-flex flex-column hp100 gap16';

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  knowMoreData: KnowMoreResponse;

  faqList: FaqListResponse[] = [];

  ngOnInit(): void {
    this.getKnowMore();
    this.getFaqList();
  }

  getKnowMore() {
    const getKnowMore$ = this.rafService.getKnowMore();
    const getKnowMore: Subscription = getKnowMore$.subscribe({
      next: (res: BaseResponse<KnowMoreResponse>) => {
        this.knowMoreData = res.data;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getKnowMore);
  }

  getFaqList() {
    const getFaqList$ = this.rafService.getFaqList();
    const getFaqList: Subscription = getFaqList$.subscribe({
      next: (res: BaseResponse<FaqListResponse[]>) => {
        this.faqList = res.data;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getFaqList);
  }

  onClose(): void {
    this.rafService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
