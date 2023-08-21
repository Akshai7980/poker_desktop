export interface VerifyUpiResponse {
  userBankId: number;
  Status: string;
}

export interface VerifyUpiRequest {
  userBankId: number;
}

export class VerifyUpiModel {
  userBankId: number;

  constructor(userBankId: number) {
    this.userBankId = userBankId;
  }

  getRequestModel(): VerifyUpiRequest {
    const requestModel: VerifyUpiRequest = {
      userBankId: this.userBankId
    };

    return requestModel;
  }
}
