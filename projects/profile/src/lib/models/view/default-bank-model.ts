import { DefaultBankRequest } from '../request/default-bank-request';

export class DefaultBankModel {
  userBankId: string;

  clear() {
    this.userBankId = '';
  }

  getRequestModel(): DefaultBankRequest {
    const defaultbankReq: DefaultBankRequest = {
      userBankId: this.userBankId
    };

    return defaultbankReq;
  }
}
