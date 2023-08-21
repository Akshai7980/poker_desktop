import { FormGroup } from '@angular/forms';
import { CashGamesDataRequest } from '../request/cash-games-request.model';

export class CashGamesModel {
  user: string;

  count: number;

  sDt: string;

  eDt: string;

  searchBy: string;

  constructor(formGroup?: FormGroup) {
    formGroup?.valueChanges.subscribe((resp) => {
      this.user = resp.mobileNumber;
    });
  }

  getRequestModel(): CashGamesDataRequest {
    const cashGamesRequestModel: CashGamesDataRequest = {
      count: this.count,
      sDt: this.sDt,
      eDt: this.eDt,
      searchBy: this.searchBy
    };
    return cashGamesRequestModel;
  }
}
