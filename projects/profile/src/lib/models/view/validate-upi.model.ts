export interface ValidateUpiResponse {
  userBankId: number;
  userId: number;
  accountName: string;
  accountNumber: any;
  vpa: string;
  accountType: string;
  ifscId: any;
  isVerified: number;
  isDefault: number;
  isDeleted: number;
  status: string;
  uploadByAdmin: number;
  approvedByAdmin: any;
  adminReason: any;
  isIdfyFailure: number;
  reason: any;
  approvedMode: string;
  verificationLevel: string;
  addedOn: string;
  modifiedOn: string;
}

export interface ValidateUpiRequest {
  vpa: string;
}
export class ValidateUpiModel {
  vpa: string;

  constructor(vpa: string) {
    this.vpa = vpa;
  }

  getRequestModel(): ValidateUpiRequest {
    const requestModel: ValidateUpiRequest = {
      vpa: this.vpa
    };

    return requestModel;
  }
}
