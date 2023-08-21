import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseResponse } from 'projects/shared/src/lib/models/common/base-response.model';
import { KnowMoreResponse } from 'projects/shared/src/lib/models/response/know-more.response';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-know-more',
  templateUrl: './know-more.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class KnowMoreComponent implements OnInit {
  title: string = '';

  answer: string = '';

  @Output() backClickEmit = new EventEmitter();

  constructor(private cashierService: CashierService) {}

  ngOnInit(): void {
    this.cashierService
      .getKnowMoreData()
      .subscribe((resp: BaseResponse<Array<KnowMoreResponse>>) => {
        this.title = resp.data[0].title;
        this.answer = resp.data[0].answer;
      });
  }

  onBackClick() {
    this.backClickEmit.emit(true);
  }
}
