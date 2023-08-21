import { RedeemScratchCardRequest } from '../request/redeem-scrtch-code.request.model';

export class RedeemScratchCodeModel {
  code: string;

  clear() {
    this.code = '';
  }

  getRequestModel(): RedeemScratchCardRequest {
    const redeemScratchCard: RedeemScratchCardRequest = {
      code: this.code
    };

    return redeemScratchCard;
  }
}
