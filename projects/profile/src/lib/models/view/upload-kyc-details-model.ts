import { UploadKycDetailsReq } from '../request/upload-kyc-details-req';

export class UploadKycDetailsModel {
  userId: number | null;

  docNumber: string;

  docType: string;

  file1: object;

  file2: object;

  clear() {
    this.userId = null;
    this.docNumber = '';
    this.docType = '';
    this.file1 = {};
    this.file2 = {};
  }

  getRequestModel(): UploadKycDetailsReq {
    const UploadKycDetailsRequestModel: UploadKycDetailsReq = {
      userId: this.userId,
      docNumber: this.docNumber,
      docType: this.docType,
      file1: this.file1,
      file2: this.file2
    };

    return UploadKycDetailsRequestModel;
  }
}
