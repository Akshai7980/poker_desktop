import { UploadBankDetailsRequest } from '../request/upload-bank-details';

export class UploadBankDetailsModel {
  accountNumber: string;
  ifsc: string;

  clear() {
    this.accountNumber = '';
    this.ifsc = '';
  }

  getRequestModel(): UploadBankDetailsRequest {
    const uploadBankDetailsReq: UploadBankDetailsRequest = {
      accountNumber: this.accountNumber,
      ifsc: this.ifsc
    };

    return uploadBankDetailsReq;
  }
}
